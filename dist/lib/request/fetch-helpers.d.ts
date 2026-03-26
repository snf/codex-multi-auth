/**
 * Helper functions for the custom fetch implementation
 * These functions break down the complex fetch logic into manageable, testable units
 */
import type { Auth, CodexClient } from "@codex-ai/sdk";
import { type FastSessionInputTrimPlan } from "./request-transformer.js";
import type { UserConfig, RequestBody } from "../types.js";
export interface RateLimitInfo {
    retryAfterMs: number;
    code?: string;
}
export interface EntitlementError {
    isEntitlement: true;
    code: string;
    message: string;
}
export declare const DEFAULT_UNSUPPORTED_CODEX_FALLBACK_CHAIN: Record<string, string[]>;
export interface UnsupportedCodexModelInfo {
    isUnsupported: boolean;
    code?: string;
    message?: string;
    unsupportedModel?: string;
}
export interface ResolveUnsupportedCodexFallbackOptions {
    requestedModel: string | undefined;
    errorBody: unknown;
    attemptedModels?: Iterable<string>;
    fallbackOnUnsupportedCodexModel: boolean;
    fallbackToGpt52OnUnsupportedGpt53: boolean;
    customChain?: Record<string, string[]>;
}
export interface TransformRequestForCodexResult {
    body: RequestBody;
    updatedInit: RequestInit;
    deferredFastSessionInputTrim?: FastSessionInputTrimPlan["trim"];
}
export declare function extractUnsupportedCodexModelFromText(bodyText: string): string | undefined;
export declare function getUnsupportedCodexModelInfo(errorBody: unknown): UnsupportedCodexModelInfo;
export declare function resolveUnsupportedCodexFallbackModel(options: ResolveUnsupportedCodexFallbackOptions): string | undefined;
/**
 * Returns true when the legacy `gpt-5.3-codex -> gpt-5.2-codex` edge is available.
 */
export declare function shouldFallbackToGpt52OnUnsupportedGpt53(requestedModel: string | undefined, errorBody: unknown): boolean;
/**
 * Detects whether an error code or response body indicates an entitlement/subscription issue for Codex models.
 *
 * Entitlement errors signal that the requested feature is not included in the user's plan and should not be treated as rate limits.
 * This function is pure and safe to call concurrently; it performs no filesystem access (including on Windows) and does not read or redact tokens — callers must avoid passing sensitive credentials in `code` or `bodyText`.
 *
 * @param code - The error code string returned by the service
 * @param bodyText - The response body text to inspect for entitlement-related phrases
 * @returns `true` if the combined `code` or `bodyText` indicates an entitlement/subscription issue, `false` otherwise
 */
export declare function isEntitlementError(code: string, bodyText: string): boolean;
/**
 * Detects whether an error indicates the workspace/account has been disabled or expired.
 *
 * Workspace disabled errors signal that the current workspace is no longer accessible
 * (expired, disabled, or removed) and the plugin should automatically switch to another account.
 *
 * @param status - HTTP status code
 * @param code - The error code string returned by the service
 * @param bodyText - The response body text to inspect for workspace-related phrases
 * @returns `true` if the error indicates a disabled/expired workspace
 */
export declare function isWorkspaceDisabledError(status: number, code: unknown, bodyText: string): boolean;
/**
 * Constructs a standardized 403 entitlement error Response indicating the user lacks access to Codex models.
 *
 * This function returns a JSON Response with an `error` payload containing a user-facing message, a
 * `type` of `"entitlement_error"`, and a `code` of `"usage_not_included"`. The message suggests checking
 * account/workspace access and re-authenticating with `codex login`.
 *
 * Concurrency: stateless and safe to call concurrently from multiple threads or requests.
 * Windows filesystem behavior: none (function does not access the filesystem).
 * Token redaction: any tokens are not included in the generated payload; do not pass sensitive tokens in `_bodyText`.
 *
 * @param _bodyText - Original response body text (accepted for compatibility; ignored when building the response)
 * @returns A 403 Response with a JSON body describing the entitlement error and guidance for resolving it
 */
export declare function createEntitlementErrorResponse(_bodyText: string): Response;
export interface ErrorHandlingResult {
    response: Response;
    rateLimit?: RateLimitInfo;
    errorBody?: unknown;
}
export interface ErrorHandlingOptions {
    requestCorrelationId?: string;
    threadId?: string;
}
export interface ErrorDiagnostics {
    requestId?: string;
    cfRay?: string;
    correlationId?: string;
    threadId?: string;
    httpStatus?: number;
}
export interface CreateCodexHeadersOptions {
    model?: string;
    promptCacheKey?: string;
}
export interface ProxyCompatibleRequestInit extends RequestInit {
    agent?: unknown;
}
export interface CreateCodexHeadersParams {
    init?: RequestInit;
    accountId: string;
    accessToken: string;
    opts?: CreateCodexHeadersOptions;
}
/**
 * Determines if the current auth token needs to be refreshed
 * @param auth - Current authentication state
 * @returns True if token is expired or invalid
 */
export declare function shouldRefreshToken(auth: Auth, skewMs?: number): boolean;
/**
 * Refreshes the OAuth token and updates stored credentials
 * @param currentAuth - Current auth state
 * @param client - Codex client for updating stored credentials
 * @returns Updated auth (throws on failure)
 */
export declare function refreshAndUpdateToken(currentAuth: Auth, client: CodexClient): Promise<Auth>;
/**
 * Extracts URL string from various request input types
 * @param input - Request input (string, URL, or Request object)
 * @returns URL string
 */
export declare function extractRequestUrl(input: Request | string | URL): string;
/**
 * Rewrites OpenAI API URLs to Codex backend URLs
 * @param url - Original URL
 * @returns Rewritten URL for Codex backend
 */
export declare function rewriteUrlForCodex(url: string): string;
export declare function resolveProxyUrlForRequest(url: string, env?: NodeJS.ProcessEnv): string | undefined;
export declare function closeSharedProxyDispatchers(): Promise<void>;
export declare function applyProxyCompatibleInit(url: string, init?: ProxyCompatibleRequestInit, env?: NodeJS.ProcessEnv): ProxyCompatibleRequestInit;
/**
 * Transforms request body and logs the transformation
 * Fetches model-specific Codex instructions based on the request model
 *
 * @param init - Request init options
 * @param url - Request URL
 * @param userConfig - User configuration
 * @param codexMode - Enable CODEX_MODE (bridge prompt instead of tool remap)
 * @param parsedBody - Pre-parsed body to avoid double JSON.parse (optional)
 * @returns Transformed body and updated init, or undefined if no body
 */
export declare function transformRequestForCodex(init: RequestInit | undefined, url: string, userConfig: UserConfig, codexMode?: boolean, parsedBody?: Record<string, unknown>, options?: {
    fastSession?: boolean;
    fastSessionStrategy?: "hybrid" | "always";
    fastSessionMaxInputItems?: number;
    deferFastSessionInputTrimming?: boolean;
    allowBackgroundResponses?: boolean;
}): Promise<TransformRequestForCodexResult | undefined>;
/**
 * Creates headers for Codex API requests
 * @param init - Request init options
 * @param accountId - ChatGPT account ID
 * @param accessToken - OAuth access token
 * @returns Headers object with all required Codex headers
 */
export declare function createCodexHeaders(params: CreateCodexHeadersParams): Headers;
export declare function createCodexHeaders(init: RequestInit | undefined, accountId: string, accessToken: string, opts?: CreateCodexHeadersOptions): Headers;
/**
 * Handles error responses from the Codex API
 * @param response - Error response from API
 * @returns Original response or mapped retryable response
 */
export declare function handleErrorResponse(response: Response, options?: ErrorHandlingOptions): Promise<ErrorHandlingResult>;
/**
 * Handles successful responses from the Codex API
 * Converts SSE to JSON for non-streaming requests (generateText)
 * Passes through SSE for streaming requests (streamText)
 * @param response - Success response from API
 * @param isStreaming - Whether this is a streaming request (stream=true in body)
 * @returns Processed response (SSE→JSON for non-streaming, stream for streaming)
 */
export declare function handleSuccessResponse(response: Response, isStreaming: boolean, options?: {
    onResponseId?: (responseId: string) => void;
    streamStallTimeoutMs?: number;
}): Promise<Response>;
//# sourceMappingURL=fetch-helpers.d.ts.map