import type { FlaggedAccountStorageV1 } from "../storage.js";
export declare function loadFlaggedAccountsEntry(params: {
    getFlaggedAccountsPath: () => string;
    getLegacyFlaggedAccountsPath: () => string;
    getIntentionalResetMarkerPath: (path: string) => string;
    normalizeFlaggedStorage: (data: unknown) => FlaggedAccountStorageV1;
    saveFlaggedAccounts: (storage: FlaggedAccountStorageV1) => Promise<void>;
    loadFlaggedAccountsState: (args: {
        path: string;
        legacyPath: string;
        resetMarkerPath: string;
        normalizeFlaggedStorage: (data: unknown) => FlaggedAccountStorageV1;
        saveFlaggedAccounts: (storage: FlaggedAccountStorageV1) => Promise<void>;
        logError: (message: string, details: Record<string, unknown>) => void;
        logInfo: (message: string, details: Record<string, unknown>) => void;
    }) => Promise<FlaggedAccountStorageV1>;
    logError: (message: string, details: Record<string, unknown>) => void;
    logInfo: (message: string, details: Record<string, unknown>) => void;
}): Promise<FlaggedAccountStorageV1>;
//# sourceMappingURL=flagged-load-entry.d.ts.map