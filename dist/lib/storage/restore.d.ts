import type { AccountStorageV3 } from "../storage.js";
export interface RestoreAccountsFromBackupDeps {
    realpath: typeof import("node:fs").promises.realpath;
    getNamedBackupRoot: (storagePath: string) => string;
    getStoragePath: () => string;
    loadAccountsFromPath: (path: string) => Promise<{
        normalized: AccountStorageV3 | null;
    }>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
}
export declare function restoreAccountsFromBackupFile(path: string, deps: RestoreAccountsFromBackupDeps, options?: {
    persist?: boolean;
}): Promise<AccountStorageV3>;
//# sourceMappingURL=restore.d.ts.map