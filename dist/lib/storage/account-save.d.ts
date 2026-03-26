import type { AccountStorageV3 } from "../storage.js";
export declare function saveAccountsToDisk(storage: AccountStorageV3, params: {
    path: string;
    resetMarkerPath: string;
    walPath: string;
    storageBackupEnabled: boolean;
    ensureDirectory: () => Promise<void>;
    ensureGitignore: () => Promise<void>;
    looksLikeSyntheticFixtureStorage: (storage: AccountStorageV3 | null) => boolean;
    loadExistingStorage: () => Promise<AccountStorageV3 | null>;
    createSyntheticFixtureError: () => Error;
    createRotatingAccountsBackup: (path: string) => Promise<void>;
    computeSha256: (value: string) => string;
    writeJournal: (content: string, path: string) => Promise<void>;
    writeTemp: (tempPath: string, content: string) => Promise<void>;
    statTemp: (tempPath: string) => Promise<{
        size: number;
    }>;
    renameTempToPath: (tempPath: string) => Promise<void>;
    cleanupResetMarker: () => Promise<void>;
    cleanupWal: () => Promise<void>;
    cleanupTemp: (tempPath: string) => Promise<void>;
    onSaved: () => void;
    logWarn: (message: string, details: Record<string, unknown>) => void;
    logError: (message: string, details: Record<string, unknown>) => void;
    createStorageError: (error: unknown) => Error;
    backupPath: string;
    createTempPath: () => string;
}): Promise<void>;
//# sourceMappingURL=account-save.d.ts.map