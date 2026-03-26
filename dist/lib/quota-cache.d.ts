export interface QuotaCacheWindow {
    usedPercent?: number;
    windowMinutes?: number;
    resetAtMs?: number;
}
export interface QuotaCacheEntry {
    updatedAt: number;
    status: number;
    model: string;
    planType?: string;
    primary: QuotaCacheWindow;
    secondary: QuotaCacheWindow;
}
export interface QuotaCacheData {
    byAccountId: Record<string, QuotaCacheEntry>;
    byEmail: Record<string, QuotaCacheEntry>;
}
/**
 * Get the absolute filesystem path to the quota-cache.json file.
 *
 * The resolved path points to quota-cache.json inside the Codex multi-auth directory.
 * Callers must observe normal filesystem concurrency semantics (no internal locking is provided),
 * and handle platform-specific path behavior (for example, on Windows the file may reside under %APPDATA%).
 * The file can contain sensitive values; redact tokens or secrets before logging or exposing its contents.
 *
 * @returns The absolute path to the quota-cache.json file
 */
export declare function getQuotaCachePath(): string;
/**
 * Loads and returns the normalized quota cache from disk.
 *
 * Reads the JSON cache at the configured quota-cache path, validates and normalizes entries,
 * and returns maps keyed by account ID and email. If the file is missing, invalid, or an I/O
 * error occurs, returns empty maps and logs a warning.
 *
 * Notes:
 * - Concurrency: callers should expect concurrent readers and writers; the function performs
 *   a best-effort read and does not perform file locking.
 * - Windows: uses standard UTF-8 file reads; caller should ensure the quota-cache path is
 *   compatible with Windows path semantics when used on that platform.
 * - Redaction: callers should avoid logging or exposing the file contents; any tokens or
 *   sensitive identifiers contained in the cache should be redacted before external reporting.
 *
 * @returns The quota cache as `{ byAccountId, byEmail }` with normalized entries; each map
 *          will be empty if the on-disk file is absent, malformed, or could not be read.
 */
export declare function loadQuotaCache(): Promise<QuotaCacheData>;
/**
 * Persist the quota cache to the on-disk JSON file used by the multi-auth runtime.
 *
 * Writes a versioned, pretty-printed JSON representation of `data` to the configured
 * quota cache path. Failures are logged and do not throw, so callers should handle
 * eventual consistency or retry as needed.
 *
 * Concurrency: concurrent writers may race and overwrite each other; callers should
 * serialize writes if strong consistency is required.
 *
 * Filesystem notes: Windows path length, permissions, or antivirus locks may cause
 * write failures; such errors are logged rather than thrown.
 *
 * Security: this function does not redact secrets or tokens — callers must ensure
 * `data` contains no sensitive plaintext tokens before calling.
 *
 * @param data - The quota cache data (byAccountId and byEmail maps) to persist; callers
 *               should pass normalized QuotaCacheData.
 */
export declare function saveQuotaCache(data: QuotaCacheData): Promise<void>;
//# sourceMappingURL=quota-cache.d.ts.map