/**
 * Path resolution utilities for account storage.
 * Extracted from storage.ts to reduce module size.
 */
/**
 * Gets the path to the global Codex multi-auth configuration directory.
 *
 * The returned path is platform-specific (may use Windows separators and casing). The directory is intended for concurrent use by multiple processes; callers should treat its contents as sensitive (redact tokens/credentials when logging).
 *
 * @returns The absolute filesystem path to the Codex multi-auth configuration directory.
 */
export declare function getConfigDir(): string;
/**
 * Get the per-project .codex directory path inside the given project path.
 *
 * This function is pure and safe for concurrent use. The returned path uses the platform's native separators; on Windows, casing and separators follow OS semantics and callers should normalize if needed. The returned value may contain sensitive segments derived from `projectPath`; callers should redact secrets before logging.
 *
 * @param projectPath - Project directory path (absolute or relative)
 * @returns The path to the project's ".codex" configuration directory
 */
export declare function getProjectConfigDir(projectPath: string): string;
/**
 * Create a deterministic, filesystem-safe storage key for a project path.
 *
 * The key is "<sanitized-name>-<truncated-hex>" where the sanitized name is derived from the project's basename (disallowed characters replaced, trimmed, and truncated to 40 characters) and the hex segment is the first 12 characters of a SHA-256 hash of the normalized path. On Windows the path is normalized to lowercase before hashing to ensure case-insensitive equivalence. The function is pure and safe for concurrent use; it produces the same output for equivalent paths and does not perform I/O. The key does not include the raw project path, so tokens or secrets embedded in the original path are not directly exposed.
 *
 * @param projectPath - Project path in any form; it will be normalized (expanded, resolved, and platform-normalized) before key generation
 * @returns A filesystem-safe storage key string composed of a sanitized project name (up to 40 chars), a dash, and a 12-character hex hash
 */
export declare function getProjectStorageKey(projectPath: string): string;
/**
 * Compute the global per-project storage directory path under the Codex multi-auth projects directory.
 *
 * The returned path is grounded in the global Codex multi-auth config directory and is namespaced
 * by a filesystem-friendly project storage key derived from `projectPath` (sanitized and hashed to
 * avoid embedding sensitive tokens or raw paths).
 *
 * Concurrency: the resulting directory may be accessed by multiple processes; callers are responsible
 * for any required concurrency-safe operations when creating or mutating files within it.
 *
 * Windows: storage key derivation normalizes path separators and casing to produce stable keys on
 * Windows hosts.
 *
 * @param projectPath - The project filesystem path used to derive the per-project storage key.
 * @returns The absolute path to the project's storage directory under the global Codex multi-auth projects directory.
 */
export declare function getProjectGlobalConfigDir(projectPath: string): string;
/**
 * Resolve a stable project identity root for account storage keying.
 *
 * For standard repositories, this returns `projectRoot` unchanged.
 * For linked Git worktrees, this resolves to the shared repository root so
 * multiple worktrees use the same per-project account key.
 *
 * @param projectRoot - Detected project root path (typically from findProjectRoot)
 * @returns Identity root used for per-project storage key generation
 */
export declare function resolveProjectStorageIdentityRoot(projectRoot: string): string;
export declare function isProjectDirectory(dir: string): boolean;
export declare function findProjectRoot(startDir: string): string | null;
export declare function resolvePath(filePath: string): string;
//# sourceMappingURL=paths.d.ts.map