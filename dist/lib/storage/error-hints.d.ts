import { StorageError } from "../errors.js";
/**
 * Format a user-facing hint for storage persistence failures based on errno code.
 */
export declare function formatStorageErrorHint(error: unknown, path: string): string;
/**
 * Wrap an arbitrary storage failure in a StorageError with a derived hint.
 */
export declare function toStorageError(message: string, error: unknown, path: string): StorageError;
//# sourceMappingURL=error-hints.d.ts.map