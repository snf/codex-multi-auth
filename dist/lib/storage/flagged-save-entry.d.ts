import type { FlaggedAccountStorageV1 } from "../storage.js";
export declare function saveFlaggedAccountsEntry(params: {
    storage: FlaggedAccountStorageV1;
    withStorageLock: <T>(fn: () => Promise<T>) => Promise<T>;
    saveUnlocked: (storage: FlaggedAccountStorageV1) => Promise<void>;
}): Promise<void>;
//# sourceMappingURL=flagged-save-entry.d.ts.map