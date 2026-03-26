/**
 * Model Configuration Map
 *
 * Maps host/runtime model identifiers to the effective model name we send to the
 * OpenAI Responses API. The catalog also carries prompt-family, reasoning, and
 * tool-surface metadata so routing logic stays consistent across the request
 * transformer, prompt selection, and CLI diagnostics.
 */
export type ModelReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
export type PromptModelFamily = "gpt-5-codex" | "codex-max" | "codex" | "gpt-5.2" | "gpt-5.1";
export interface ModelCapabilities {
    toolSearch: boolean;
    computerUse: boolean;
    compaction: boolean;
}
export interface ModelProfile {
    normalizedModel: string;
    promptFamily: PromptModelFamily;
    defaultReasoningEffort: ModelReasoningEffort;
    supportedReasoningEfforts: readonly ModelReasoningEffort[];
    capabilities: ModelCapabilities;
}
export declare const DEFAULT_MODEL = "gpt-5.4";
/**
 * Effective model profiles keyed by canonical model name.
 *
 * Prompt families intentionally stay on the latest prompt files currently
 * shipped by upstream Codex CLI. GPT-5.4 era general-purpose models still use
 * the GPT-5.2 prompt family because `gpt_5_4_prompt.md` is not present in the
 * latest upstream release.
 */
export declare const MODEL_PROFILES: Record<string, ModelProfile>;
declare const MODEL_MAP: Record<string, string>;
export { MODEL_MAP };
/**
 * Get normalized model name from a known config/runtime identifier.
 *
 * This does exact/alias lookup only. Use `resolveNormalizedModel()` when you
 * want GPT-5 family fallback behavior for unknown-but-similar names.
 */
export declare function getNormalizedModel(modelId: string): string | undefined;
/**
 * Resolve a model identifier to the effective API model.
 *
 * This expands exact alias lookup with GPT-5 family fallback rules so the
 * plugin never silently downgrades modern GPT-5 requests to GPT-5.1-era
 * routing.
 */
export declare function resolveNormalizedModel(model: string | undefined): string;
/**
 * Resolve the effective model profile for a requested model string.
 */
export declare function getModelProfile(model: string | undefined): ModelProfile;
/**
 * Expose current tool-surface metadata for diagnostics and capability checks.
 */
export declare function getModelCapabilities(model: string | undefined): ModelCapabilities;
/**
 * Check if a model ID is in the explicit model map.
 *
 * This only returns `true` for exact known aliases. Use
 * `resolveNormalizedModel()` if you want the fallback behavior.
 */
export declare function isKnownModel(modelId: string): boolean;
//# sourceMappingURL=model-map.d.ts.map