/**
 * Resolve the Codex home directory path used by the CLI, honoring an environment override or a sensible default.
 *
 * This function is safe to call concurrently and returns a filesystem path string as-is; on Windows the underlying filesystem is case-insensitive so callers should avoid relying on case for equality. The returned path may contain sensitive identifiers; redact or avoid logging it in plaintext.
 *
 * @returns The resolved Codex home directory path: the value of `CODEX_HOME` when set and non-empty, otherwise the user's home directory joined with `.codex`.
 */
export declare function getCodexHomeDir(): string;
/**
 * Determine the directory to use for Codex multi-auth data, preferring an explicit override
 * or existing storage locations and falling back to the primary Codex location.
 *
 * @returns The resolved multi-auth directory path.
 *
 * @remarks
 * Concurrency: safe to call concurrently; the function only inspects filesystem state and does not create or mutate directories.
 *
 * Windows: deduplication and existence checks treat paths case-insensitively on Windows; returned paths preserve platform-native casing.
 *
 * Security: returned paths may contain user-specific or sensitive data; callers should redact or avoid logging full paths.
 */
export declare function getCodexMultiAuthDir(): string;
/**
 * Resolves the Codex cache directory used for storing cached multi-auth artifacts.
 *
 * The returned path is derived from the resolved multi-auth directory. Callers should avoid concurrent
 * mutations to the returned directory path (concurrent reads are safe). On Windows, path comparison
 * is case-insensitive elsewhere in this module; the returned path itself preserves platform casing.
 *
 * Token or secret redaction is not performed on the path; do not log paths that may contain secrets.
 *
 * @returns The filesystem path to the Codex cache directory.
 */
export declare function getCodexCacheDir(): string;
/**
 * Resolve the filesystem path for Codex log files.
 *
 * Returns the `logs` subdirectory within the resolved multi-auth directory.
 * Concurrency: safe to call concurrently; this function performs no I/O or directory creation.
 * Windows: path comparisons elsewhere are case-insensitive on Windows; this function returns a path using the platform separator.
 * Security: the returned path may contain sensitive artifacts (tokens/credentials); redact before logging or diagnostics.
 *
 * @returns The path to the Codex `logs` directory (i.e., `<multi-auth-dir>/logs`)
 */
export declare function getCodexLogDir(): string;
/**
 * Resolve the legacy host home directory path.
 *
 * The returned path points to the per-user legacy folder (typically `<home>/.codex`).
 *
 * Concurrency: no atomicity guarantees — callers must handle concurrent filesystem access.
 * Windows: path comparisons may be case-insensitive on Windows filesystems.
 * Security: do not embed or log secrets/tokens in this path; redact any tokens before logging or telemetry.
 *
 * @returns The filesystem path for the legacy directory (e.g. `/home/alice/.codex`).
 */
export declare function getLegacyCodexDir(): string;
//# sourceMappingURL=runtime-paths.d.ts.map