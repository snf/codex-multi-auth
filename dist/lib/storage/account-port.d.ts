import type { AccountStorageV3 } from "../storage.js";
export declare function exportAccountsSnapshot(params: {
    resolvedPath: string;
    force: boolean;
    currentStoragePath: string;
    transactionState: {
        active: boolean;
        storagePath: string;
        snapshot: AccountStorageV3 | null;
    } | undefined;
    readCurrentStorageUnlocked: () => Promise<AccountStorageV3 | null>;
    readCurrentStorage: () => Promise<AccountStorageV3 | null>;
    exportAccountsToFile: (args: {
        resolvedPath: string;
        force: boolean;
        storage: AccountStorageV3 | null;
        beforeCommit?: (resolvedPath: string) => Promise<void> | void;
        logInfo: (message: string, details: Record<string, unknown>) => void;
    }) => Promise<void>;
    beforeCommit?: (resolvedPath: string) => Promise<void> | void;
    logInfo: (message: string, details: Record<string, unknown>) => void;
}): Promise<void>;
export declare function importAccountsSnapshot(params: {
    resolvedPath: string;
    readImportFile: (args: {
        resolvedPath: string;
        normalizeAccountStorage: (value: unknown) => AccountStorageV3 | null;
    }) => Promise<AccountStorageV3>;
    normalizeAccountStorage: (value: unknown) => AccountStorageV3 | null;
    withAccountStorageTransaction: <T>(handler: (current: AccountStorageV3 | null, persist: (storage: AccountStorageV3) => Promise<void>) => Promise<T>) => Promise<T>;
    mergeImportedAccounts: (args: {
        existing: AccountStorageV3 | null;
        imported: AccountStorageV3;
        maxAccounts: number;
        deduplicateAccounts: (accounts: AccountStorageV3["accounts"]) => AccountStorageV3["accounts"];
    }) => {
        newStorage: AccountStorageV3;
        imported: number;
        total: number;
        skipped: number;
    };
    maxAccounts: number;
    deduplicateAccounts: (accounts: AccountStorageV3["accounts"]) => AccountStorageV3["accounts"];
    logInfo: (message: string, details: Record<string, unknown>) => void;
}): Promise<{
    imported: number;
    total: number;
    skipped: number;
}>;
//# sourceMappingURL=account-port.d.ts.map