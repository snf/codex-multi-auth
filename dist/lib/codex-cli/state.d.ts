export interface CodexCliTokenCacheEntry {
    accessToken: string;
    expiresAt?: number;
    refreshToken?: string;
    accountId?: string;
}
export interface CodexCliAccountSnapshot extends CodexCliTokenCacheEntry {
    email?: string;
    isActive?: boolean;
}
export interface CodexCliState {
    path: string;
    accounts: CodexCliAccountSnapshot[];
    activeAccountId?: string;
    activeEmail?: string;
    syncVersion?: number;
    sourceUpdatedAtMs?: number;
}
/**
 * Determines whether Codex CLI sync is enabled based on environment variables.
 *
 * Checks CODEX_MULTI_AUTH_SYNC_CODEX_CLI first (explicit "1" enables, "0" disables),
 * then falls back to the legacy CODEX_AUTH_SYNC_CODEX_CLI (also "1"/"0"). If the
 * legacy variable is used, a single warning is emitted and a metric is incremented.
 *
 * Concurrency: the function may perform a one-time side effect (emitting a legacy-use
 * warning and incrementing a metric); that side effect is guarded to run at most once
 * per process and is safe to call from concurrent contexts.
 *
 * Filesystem and tokens: this function does not access the filesystem and does not
 * read or log any tokens (no token redaction is required here).
 *
 * @returns `true` if sync is enabled, `false` otherwise.
 */
export declare function isCodexCliSyncEnabled(): boolean;
/**
 * Resolves the filesystem path to the Codex CLI accounts file.
 *
 * If the environment variable CODEX_CLI_ACCOUNTS_PATH is set to a non-empty value it will be returned; otherwise the default is "$HOME/.codex/accounts.json".
 *
 * Concurrency: callers should treat the returned path as a location that may be concurrently read or written by other processes.
 * Windows: returns a path using the platform path separators (may contain backslashes on Windows).
 * Token redaction: this function only returns the file path; it does not read or expose token contents and callers must redact sensitive fields when logging the file contents.
 *
 * @returns The resolved path to the accounts JSON file, either the overridden value from CODEX_CLI_ACCOUNTS_PATH or the platform-specific "$HOME/.codex/accounts.json".
 */
export declare function getCodexCliAccountsPath(): string;
/**
 * Resolve the filesystem path for the Codex CLI auth JSON file, allowing an environment override.
 *
 * If the environment variable `CODEX_CLI_AUTH_PATH` is set to a non-empty value (after trimming) that value is returned;
 * otherwise the default path is homedir/.codex/auth.json. The returned path may reference a file containing authentication tokens—
 * treat it as sensitive (avoid logging full paths or file contents without redaction). The function returns a platform-native path
 * (path separators follow the current OS); callers should handle concurrent access to the file when reading or writing.
 *
 * @returns The resolved path to the Codex CLI `auth.json` file.
 */
export declare function getCodexCliAuthPath(): string;
/**
 * Resolve the filesystem path for the Codex CLI config TOML file, allowing an environment override.
 *
 * If `CODEX_CLI_CONFIG_PATH` is set to a non-empty value (after trimming), that path is returned.
 * Otherwise, defaults to `$HOME/.codex/config.toml`.
 *
 * @returns The resolved path to Codex CLI `config.toml`.
 */
export declare function getCodexCliConfigPath(): string;
/**
 * Loads Codex CLI authentication state from disk, with an in-memory TTL cache and optional force refresh.
 *
 * Reads either the accounts JSON or the legacy auth JSON (whichever is present) and returns a normalized
 * CodexCliState including tokens, active account, optional sync version, and source file modification time.
 * Uses an in-memory cache valid for CACHE_TTL_MS; if `forceRefresh` is true the cache is bypassed.
 *
 * Concurrency: callers may race to read/update the in-memory cache; this function performs best-effort caching
 * and does not provide external synchronization primitives.
 *
 * Windows filesystem notes: file modification timestamps (sourceUpdatedAtMs) are derived from fs.stat().mtimeMs
 * and may have coarser resolution on some Windows filesystems.
 *
 * Token redaction: returned state may contain token values (accessToken, refreshToken); consumers should treat
 * these values as sensitive and redact or avoid logging them.
 *
 * @param options - Optional settings.
 * @param options.forceRefresh - If true, bypass the in-memory TTL cache and re-read files from disk.
 * @returns The parsed CodexCliState when a valid accounts/auth payload is found, or `null` if sync is disabled,
 * no valid payload exists, or a read/parse error occurred.
 */
export declare function loadCodexCliState(options?: {
    forceRefresh?: boolean;
}): Promise<CodexCliState | null>;
export declare function lookupCodexCliTokensByEmail(email: string | undefined): Promise<CodexCliTokenCacheEntry | null>;
export declare function clearCodexCliStateCache(): void;
export declare function __resetCodexCliWarningCacheForTests(): void;
//# sourceMappingURL=state.d.ts.map