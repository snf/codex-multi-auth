export interface NamedBackupExportDependencies {
    getStoragePath: () => string;
    exportAccounts: (filePath: string, force?: boolean, beforeCommit?: (resolvedPath: string) => Promise<void> | void) => Promise<void>;
}
/**
 * Validate and normalize a user-provided backup name into a safe `<name>.json` filename.
 *
 * Performs trimming, rejects path separators and traversal tokens, forbids rotation-style
 * substrings and temporary suffixes, and enforces that the base name contains only
 * letters, numbers, hyphens, and underscores. Checks that a resulting base name is non-empty
 * and returns the base name with a `.json` extension appended.
 *
 * Notes:
 * - Validation checks that are sensitive to case are performed using a lowercased form;
 *   this mirrors Windows case-insensitive filesystem behavior for prohibited patterns.
 * - The function is synchronous and safe for concurrent use (pure string validation/normalization).
 * - Token redaction: traversal tokens (`..`), path separators, rotation-style substrings,
 *   and temporary suffixes are rejected rather than sanitized.
 *
 * @param name - The user-provided filename or identifier (may include a `.json` extension)
 * @returns The validated filename with a `.json` extension appended
 * @throws Error if the name is empty, contains separators or traversal tokens, contains
 *         prohibited substrings, ends with an invalid temporary suffix, contains disallowed
 *         characters, or would result in an empty base name
 */
export declare function normalizeNamedBackupFileName(name: string): string;
/**
 * Compute the absolute path for the "backups" directory placed alongside the given storage path.
 *
 * This performs only path resolution and string manipulation; it does not access the filesystem and is insensitive to concurrent filesystem changes. It does not redact or sanitize tokens or sensitive substrings in `storagePath`. Note: other functions in this module handle Windows case-insensitive comparisons when validating paths.
 *
 * @param storagePath - Storage file or directory path (may be relative or absolute)
 * @returns The resolved path to the backups directory adjacent to `storagePath` (i.e. dirname(storagePath)/backups)
 */
export declare function getNamedBackupRoot(storagePath: string): string;
/**
 * Resolve and validate a safe backup file path for a named backup inside the storage path's backups directory.
 *
 * @param name - User-provided backup name; will be normalized and validated (disallows path separators, `..`, prohibited substrings, and invalid suffixes such as `.tmp`/`.wal`) and the canonical filename (`*.json`) will be produced.
 * @param storagePath - Base storage path used to locate the backups directory; path comparisons treat Windows paths case-insensitively.
 * @returns The absolute, validated path to the backup file within the backups directory.
 *
 * Concurrency: this function only computes and validates the path and does not create files or directories; callers must handle concurrent filesystem operations (e.g., directory creation or file writes).
 */
export declare function resolveNamedBackupPath(name: string, storagePath: string): string;
/**
 * Create a named backup file inside the storage path's backups directory and return its resolved path.
 *
 * The provided `name` is validated and normalized (suffix, allowed characters, and prohibited substrings) and the
 * backup root directory is created if missing. The export operation will be asked to write to the resolved path; a
 * safety check ensures the final resolved path stays within the backups root.
 * The delegated `beforeCommit` hook re-validates containment immediately before
 * the storage layer commits the final rename, but callers should still serialize
 * backup-root mutations rather than relying on path checks alone.
 *
 * Concurrency: callers should avoid concurrent exports that target the same `name` as behavior is unspecified.
 * Windows behavior: file-name/path comparisons are case-insensitive and names are normalized to lowercase.
 * Token rules: input `name` is checked to prevent path traversal, separators, rotation-style substrings, and certain
 * invalid suffixes (e.g., `.tmp`, `.wal`); the final returned path always includes the `.json` extension.
 *
 * @param name - The desired backup file name (validated and normalized).
 * @param dependencies - Object providing storage path resolution and the exportAccounts implementation.
 * @param options.force - When true, request overwriting an existing backup.
 * @returns The absolute path to the created backup file (including `.json`).
 */
export declare function exportNamedBackupFile(name: string, dependencies: NamedBackupExportDependencies, options?: {
    force?: boolean;
}): Promise<string>;
//# sourceMappingURL=named-backup-export.d.ts.map