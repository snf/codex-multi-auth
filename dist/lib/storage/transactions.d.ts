import type { AccountStorageV3, FlaggedAccountStorageV1 } from "../storage.js";
export type TransactionSnapshotState = {
    snapshot: AccountStorageV3 | null;
    storagePath: string;
    active: boolean;
};
export declare function getTransactionSnapshotState(): TransactionSnapshotState | undefined;
export declare function runInTransactionSnapshotContext<T>(state: TransactionSnapshotState, fn: () => Promise<T>): Promise<T>;
export declare function withStorageLock<T>(fn: () => Promise<T>): Promise<T>;
export declare function withAccountStorageTransaction<T>(handler: (current: AccountStorageV3 | null, persist: (storage: AccountStorageV3) => Promise<void>) => Promise<T>, deps: {
    getStoragePath: () => string;
    loadCurrent: () => Promise<AccountStorageV3 | null>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
}): Promise<T>;
export declare function withAccountAndFlaggedStorageTransaction<T>(handler: (current: AccountStorageV3 | null, persist: (accountStorage: AccountStorageV3, flaggedStorage: FlaggedAccountStorageV1) => Promise<void>) => Promise<T>, deps: {
    getStoragePath: () => string;
    loadCurrent: () => Promise<AccountStorageV3 | null>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    saveFlaggedAccounts: (storage: FlaggedAccountStorageV1) => Promise<void>;
    cloneAccountStorageForPersistence: (storage: AccountStorageV3 | null | undefined) => AccountStorageV3;
    logRollbackError: (error: unknown, rollbackError: unknown) => void;
}): Promise<T>;
//# sourceMappingURL=transactions.d.ts.map