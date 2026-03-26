/**
 * Typed error hierarchy for the Codex plugin.
 * Provides structured error types with codes, causes, and context.
 */
/**
 * Error codes for categorizing errors.
 */
export declare const ErrorCode: {
    readonly NETWORK_ERROR: "CODEX_NETWORK_ERROR";
    readonly API_ERROR: "CODEX_API_ERROR";
    readonly AUTH_ERROR: "CODEX_AUTH_ERROR";
    readonly VALIDATION_ERROR: "CODEX_VALIDATION_ERROR";
    readonly RATE_LIMIT: "CODEX_RATE_LIMIT";
    readonly TIMEOUT: "CODEX_TIMEOUT";
};
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];
/**
 * Options for creating a CodexError.
 */
export interface CodexErrorOptions {
    code?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
}
/**
 * Base error class for all Codex plugin errors.
 * Supports error chaining via `cause` and arbitrary context data.
 */
export declare class CodexError extends Error {
    readonly name: string;
    readonly code: string;
    readonly context?: Record<string, unknown>;
    constructor(message: string, options?: CodexErrorOptions);
}
/**
 * Options for creating a CodexApiError.
 */
export interface CodexApiErrorOptions extends CodexErrorOptions {
    status: number;
    headers?: Record<string, string>;
}
/**
 * Error for HTTP/API response errors.
 */
export declare class CodexApiError extends CodexError {
    readonly name = "CodexApiError";
    readonly status: number;
    readonly headers?: Record<string, string>;
    constructor(message: string, options: CodexApiErrorOptions);
}
/**
 * Options for creating a CodexAuthError.
 */
export interface CodexAuthErrorOptions extends CodexErrorOptions {
    accountId?: string;
    retryable?: boolean;
}
/**
 * Error for authentication failures.
 */
export declare class CodexAuthError extends CodexError {
    readonly name = "CodexAuthError";
    readonly accountId?: string;
    readonly retryable: boolean;
    constructor(message: string, options?: CodexAuthErrorOptions);
}
/**
 * Options for creating a CodexNetworkError.
 */
export interface CodexNetworkErrorOptions extends CodexErrorOptions {
    retryable?: boolean;
}
/**
 * Error for network/connection failures.
 */
export declare class CodexNetworkError extends CodexError {
    readonly name = "CodexNetworkError";
    readonly retryable: boolean;
    constructor(message: string, options?: CodexNetworkErrorOptions);
}
/**
 * Options for creating a CodexValidationError.
 */
export interface CodexValidationErrorOptions extends CodexErrorOptions {
    field?: string;
    expected?: string;
}
/**
 * Error for input validation failures.
 */
export declare class CodexValidationError extends CodexError {
    readonly name = "CodexValidationError";
    readonly field?: string;
    readonly expected?: string;
    constructor(message: string, options?: CodexValidationErrorOptions);
}
/**
 * Options for creating a CodexRateLimitError.
 */
export interface CodexRateLimitErrorOptions extends CodexErrorOptions {
    retryAfterMs?: number;
    accountId?: string;
}
/**
 * Error for rate limit exceeded.
 */
export declare class CodexRateLimitError extends CodexError {
    readonly name = "CodexRateLimitError";
    readonly retryAfterMs?: number;
    readonly accountId?: string;
    constructor(message: string, options?: CodexRateLimitErrorOptions);
}
/**
 * Storage-specific error with a filesystem code, target path, and user-facing hint.
 */
export declare class StorageError extends CodexError {
    readonly name = "StorageError";
    readonly path: string;
    readonly hint: string;
    constructor(message: string, code: string, path: string, hint: string, cause?: Error);
}
//# sourceMappingURL=errors.d.ts.map