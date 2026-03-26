import type { FlaggedAccountStorageV1 } from "../storage.js";
export declare function loadFlaggedAccountsState(params: {
    path: string;
    legacyPath: string;
    resetMarkerPath: string;
    normalizeFlaggedStorage: (data: unknown) => FlaggedAccountStorageV1;
    saveFlaggedAccounts: (storage: FlaggedAccountStorageV1) => Promise<void>;
    logError: (message: string, details: Record<string, unknown>) => void;
    logInfo: (message: string, details: Record<string, unknown>) => void;
}): Promise<FlaggedAccountStorageV1>;
export declare function saveFlaggedAccountsUnlockedToDisk(storage: FlaggedAccountStorageV1, params: {
    path: string;
    markerPath: string;
    normalizeFlaggedStorage: (data: unknown) => FlaggedAccountStorageV1;
    copyFileWithRetry: (source: string, destination: string, options?: {
        allowMissingSource?: boolean;
    }) => Promise<void>;
    renameFileWithRetry: (source: string, destination: string) => Promise<void>;
    logWarn: (message: string, details: Record<string, unknown>) => void;
    logError: (message: string, details: Record<string, unknown>) => void;
}): Promise<void>;
export declare function clearFlaggedAccountsOnDisk(params: {
    path: string;
    markerPath: string;
    backupPaths: string[];
    logError: (message: string, details: Record<string, unknown>) => void;
}): Promise<void>;
//# sourceMappingURL=flagged-storage-io.d.ts.map