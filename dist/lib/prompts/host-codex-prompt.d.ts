/**
 * Codex Prompt Fetcher
 *
 * Fetches and caches the codex.txt system prompt from upstream GitHub sources.
 * Uses ETag-based caching to efficiently track updates.
 */
/**
 * Fetch codex.txt prompt with ETag-based caching
 * Uses HTTP conditional requests to efficiently check for updates
 *
 * Rate limit protection: Only checks GitHub if cache is older than 15 minutes
 * @returns The codex.txt content
 */
export declare function getHostCodexPrompt(): Promise<string>;
/**
 * Get first N characters of the cached prompt for verification
 * @param chars Number of characters to get (default: 50)
 * @returns First N characters or null if not cached
 */
export declare function getCachedPromptPrefix(chars?: number): Promise<string | null>;
/**
 * Prewarm the prompt cache without blocking startup.
 */
export declare function prewarmHostCodexPrompt(): void;
//# sourceMappingURL=host-codex-prompt.d.ts.map