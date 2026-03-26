import type { AccountStorageV3 } from "../storage.js";
export declare function saveAccountsEntry(params: {
    storage: AccountStorageV3;
    withStorageLock: <T>(fn: () => Promise<T>) => Promise<T>;
    saveUnlocked: (storage: AccountStorageV3) => Promise<void>;
}): Promise<void>;
//# sourceMappingURL=account-save-entry.d.ts.map