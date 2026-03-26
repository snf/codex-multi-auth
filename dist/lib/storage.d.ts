import { type BackupMetadataSection, type BackupSnapshotMetadata } from "./storage/backup-metadata.js";
export { StorageError } from "./errors.js";
export { formatStorageErrorHint, toStorageError } from "./storage/error-hints.js";
export { getAccountIdentityKey, normalizeEmailKey, } from "./storage/identity.js";
import { type AccountMetadataV1, type AccountMetadataV3, type AccountStorageV1, type AccountStorageV3, type CooldownReason, type RateLimitStateV3 } from "./storage/migrations.js";
import { type NamedBackupSummary } from "./storage/named-backups.js";
export type { CooldownReason, RateLimitStateV3, AccountMetadataV1, AccountStorageV1, AccountMetadataV3, AccountStorageV3, NamedBackupSummary, };
export interface FlaggedAccountMetadataV1 extends AccountMetadataV3 {
    flaggedAt: number;
    flaggedReason?: string;
    lastError?: string;
}
export interface FlaggedAccountStorageV1 {
    version: 1;
    accounts: FlaggedAccountMetadataV1[];
}
type RestoreReason = "empty-storage" | "intentional-reset" | "missing-storage";
export type BackupMetadata = {
    accounts: BackupMetadataSection;
    flaggedAccounts: BackupMetadataSection;
};
export type RestoreAssessment = {
    storagePath: string;
    restoreEligible: boolean;
    restoreReason?: RestoreReason;
    latestSnapshot?: BackupSnapshotMetadata;
    backupMetadata: BackupMetadata;
};
type AccountLike = {
    accountId?: string;
    email?: string;
    refreshToken?: string;
    addedAt?: number;
    lastUsed?: number;
};
export declare function setStorageBackupEnabled(enabled: boolean): void;
export declare function getLastAccountsSaveTimestamp(): number;
export declare function setStoragePath(projectPath: string | null): void;
export declare function setStoragePathDirect(path: string | null): void;
/**
 * Returns the file path for the account storage JSON file.
 * @returns Absolute path to the accounts.json file
 */
export declare function getStoragePath(): string;
export declare function buildNamedBackupPath(name: string): string;
export declare function getNamedBackups(): Promise<NamedBackupSummary[]>;
export declare function restoreAccountsFromBackup(path: string, options?: {
    persist?: boolean;
}): Promise<AccountStorageV3>;
export declare function exportNamedBackup(name: string, options?: {
    force?: boolean;
}): Promise<string>;
export declare function getFlaggedAccountsPath(): string;
type AccountMatchOptions = {
    allowUniqueAccountIdFallbackWithoutEmail?: boolean;
};
export declare function findMatchingAccountIndex<T extends Pick<AccountLike, "accountId" | "email" | "refreshToken">>(accounts: readonly T[], candidate: Pick<AccountLike, "accountId" | "email" | "refreshToken">, options?: AccountMatchOptions): number | undefined;
export declare function resolveAccountSelectionIndex<T extends Pick<AccountLike, "accountId" | "email" | "refreshToken">>(accounts: readonly T[], candidate: Pick<AccountLike, "accountId" | "email" | "refreshToken">, fallbackIndex?: number): number;
/**
 * Removes duplicate accounts, keeping the most recently used entry for each
 * safely matched identity.
 */
export declare function deduplicateAccounts<T extends {
    accountId?: string;
    email?: string;
    refreshToken?: string;
    lastUsed?: number;
    addedAt?: number;
}>(accounts: T[]): T[];
export declare function deduplicateAccountsByEmail<T extends {
    accountId?: string;
    email?: string;
    refreshToken?: string;
    lastUsed?: number;
    addedAt?: number;
}>(accounts: T[]): T[];
/**
 * Normalizes and validates account storage data, migrating from v1 to v3 if needed.
 * Handles deduplication, index clamping, and per-family active index mapping.
 * @param data - Raw storage data (unknown format)
 * @returns Normalized AccountStorageV3 or null if invalid
 */
export declare function normalizeAccountStorage(data: unknown): AccountStorageV3 | null;
/**
 * Loads OAuth accounts from disk storage.
 * Automatically migrates v1 storage to v3 format if needed.
 * @returns AccountStorageV3 if file exists and is valid, null otherwise
 */
export declare function loadAccounts(): Promise<AccountStorageV3 | null>;
export declare function getBackupMetadata(): Promise<BackupMetadata>;
export declare function getRestoreAssessment(): Promise<RestoreAssessment>;
export declare function withAccountStorageTransaction<T>(handler: (current: AccountStorageV3 | null, persist: (storage: AccountStorageV3) => Promise<void>) => Promise<T>): Promise<T>;
export declare function withAccountAndFlaggedStorageTransaction<T>(handler: (current: AccountStorageV3 | null, persist: (accountStorage: AccountStorageV3, flaggedStorage: FlaggedAccountStorageV1) => Promise<void>, currentFlagged: FlaggedAccountStorageV1) => Promise<T>): Promise<T>;
export declare function withFlaggedStorageTransaction<T>(handler: (current: FlaggedAccountStorageV1, persist: (storage: FlaggedAccountStorageV1) => Promise<void>) => Promise<T>): Promise<T>;
/**
 * Persists account storage to disk using atomic write (temp file + rename).
 * Creates the Codex multi-auth storage directory if it doesn't exist.
 * Verifies file was written correctly and provides detailed error messages.
 * @param storage - Account storage data to save
 * @throws StorageError with platform-aware hints on failure
 */
export declare function saveAccounts(storage: AccountStorageV3): Promise<void>;
/**
 * Deletes the account storage file from disk.
 * Silently ignores if file doesn't exist.
 */
export declare function clearAccounts(): Promise<void>;
export declare function loadFlaggedAccounts(): Promise<FlaggedAccountStorageV1>;
export declare function saveFlaggedAccounts(storage: FlaggedAccountStorageV1): Promise<void>;
export declare function clearFlaggedAccounts(): Promise<void>;
/**
 * Exports current accounts to a JSON file for backup/migration.
 * @param filePath - Destination file path
 * @param force - If true, overwrite existing file (default: true)
 * @throws Error if file exists and force is false, or if no accounts to export
 */
export declare function exportAccounts(filePath: string, force?: boolean, beforeCommit?: (resolvedPath: string) => Promise<void> | void): Promise<void>;
/**
 * Imports accounts from a JSON file, merging with existing accounts.
 * Deduplicates by safe account identity, preserving most recently used entries.
 * @param filePath - Source file path
 * @throws Error if file is invalid or would exceed MAX_ACCOUNTS
 */
export declare function importAccounts(filePath: string): Promise<{
    imported: number;
    total: number;
    skipped: number;
}>;
//# sourceMappingURL=storage.d.ts.map