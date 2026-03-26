import type { ConfigOptions, InputItem, ReasoningConfig, RequestBody, UserConfig } from "../types.js";
type FastSessionStrategy = "hybrid" | "always";
export interface TransformRequestBodyParams {
    body: RequestBody;
    codexInstructions: string;
    userConfig?: UserConfig;
    codexMode?: boolean;
    fastSession?: boolean;
    fastSessionStrategy?: FastSessionStrategy;
    fastSessionMaxInputItems?: number;
    deferFastSessionInputTrimming?: boolean;
    allowBackgroundResponses?: boolean;
}
export { isHostSystemPrompt, filterHostSystemPromptsWithCachedPrompt, } from "./helpers/input-utils.js";
/**
 * Normalize model name to Codex-supported variants
 *
 * Uses the shared model catalog so request routing, prompt selection, and CLI
 * diagnostics all agree on the same effective model.
 *
 * @param model - Original model name (e.g., "gpt-5-codex-low", "openai/gpt-5-codex")
 * @returns Normalized model name (e.g., "gpt-5-codex", "gpt-5.4", "gpt-5.1-codex-max")
 */
export declare function normalizeModel(model: string | undefined): string;
/**
 * Extract configuration for a specific model
 * Merges global options with model-specific options (model-specific takes precedence)
 * @param modelName - Model name (e.g., "gpt-5-codex")
 * @param userConfig - Full user configuration object
 * @returns Merged configuration for this model
 */
export declare function getModelConfig(modelName: string, userConfig?: UserConfig): ConfigOptions;
/**
 * Apply fast-session defaults to reduce latency/cost for interactive sessions.
 * Explicit user/model overrides still take precedence.
 */
export declare function applyFastSessionDefaults(userConfig?: UserConfig): UserConfig;
/**
 * Configure reasoning parameters based on model variant and user config
 *
 * NOTE: This plugin follows Codex CLI defaults instead of host defaults because:
 * - We're accessing the ChatGPT backend API (not OpenAI Platform API)
 * - host defaults may exclude gpt-5-codex from automatic reasoning configuration
 * - Codex CLI has been thoroughly tested against this backend
 *
 * @param originalModel - Original model name before normalization
 * @param userConfig - User configuration object
 * @returns Reasoning configuration
 */
export declare function getReasoningConfig(modelName: string | undefined, userConfig?: ConfigOptions): ReasoningConfig;
/**
 * Filter input array for stateless Codex API (store: false)
 *
 * Two transformations needed:
 * 1. Remove AI SDK-specific items (not supported by Codex API)
 * 2. Strip IDs from all remaining items (stateless mode)
 *
 * AI SDK constructs to REMOVE (not in OpenAI Responses API spec):
 * - type: "item_reference" - AI SDK uses this for server-side state lookup
 *
 * Items to KEEP (strip IDs):
 * - type: "message" - Conversation messages (provides context to LLM)
 * - type: "function_call" - Tool calls from conversation
 * - type: "function_call_output" - Tool results from conversation
 *
 * Context is maintained through:
 * - Full message history (without IDs)
 * - reasoning.encrypted_content (for reasoning continuity)
 *
 * @param input - Original input array from host/AI SDK
 * @returns Filtered input array compatible with Codex API
 */
export declare function filterInput(input: InputItem[] | undefined, options?: {
    stripIds?: boolean;
}): InputItem[] | undefined;
/**
 * Trim long stateless histories for low-latency sessions.
 * Keeps a small leading developer/system context plus the most recent items.
 */
export declare function trimInputForFastSession(input: InputItem[] | undefined, maxItems: number, options?: {
    preferLatestUserOnly?: boolean;
}): InputItem[] | undefined;
export interface FastSessionInputTrimPlan {
    shouldApply: boolean;
    isTrivialTurn: boolean;
    trim?: {
        maxItems: number;
        preferLatestUserOnly: boolean;
    };
}
export declare function resolveFastSessionInputTrimPlan(body: RequestBody, fastSession: boolean, fastSessionStrategy: FastSessionStrategy, fastSessionMaxInputItems: number): FastSessionInputTrimPlan;
/**
 * Filter out host system prompts from input
 * Used in CODEX_MODE to replace host prompts with Codex bridge guidance
 * @param input - Input array
 * @returns Input array without host system prompts
 */
export declare function filterHostSystemPrompts(input: InputItem[] | undefined): Promise<InputItem[] | undefined>;
/**
 * Add Codex bridge message to input if tools are present
 * @param input - Input array
 * @param hasTools - Whether tools are present in request
 * @returns Input array with bridge message prepended if needed
 */
export declare function addCodexBridgeMessage(input: InputItem[] | undefined, hasTools: boolean): InputItem[] | undefined;
/**
 * Add tool remapping message to input if tools are present
 * @param input - Input array
 * @param hasTools - Whether tools are present in request
 * @returns Input array with tool remap message prepended if needed
 */
export declare function addToolRemapMessage(input: InputItem[] | undefined, hasTools: boolean): InputItem[] | undefined;
/**
 * Transform request body for Codex API
 *
 * NOTE: Configuration follows Codex CLI patterns instead of host defaults:
 * - host may set textVerbosity="low" for gpt-5, but Codex CLI uses "medium"
 * - host may exclude gpt-5-codex from reasoning configuration
 * - This plugin defaults to store=false (stateless), with an explicit opt-in for background mode
 *
 * @param body - Original request body
 * @param codexInstructions - Codex system instructions
 * @param userConfig - User configuration from loader
 * @param codexMode - Enable CODEX_MODE (bridge prompt instead of tool remap) - defaults to true
 * @param fastSession - Force low-latency output settings for faster responses
 * @returns Transformed request body
 */
export declare function transformRequestBody(params: TransformRequestBodyParams): Promise<RequestBody>;
export declare function transformRequestBody(body: RequestBody, codexInstructions: string, userConfig?: UserConfig, codexMode?: boolean, fastSession?: boolean, fastSessionStrategy?: FastSessionStrategy, fastSessionMaxInputItems?: number, deferFastSessionInputTrimming?: boolean, allowBackgroundResponses?: boolean): Promise<RequestBody>;
//# sourceMappingURL=request-transformer.d.ts.map