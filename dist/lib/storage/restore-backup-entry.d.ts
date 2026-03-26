import type { AccountStorageV3 } from "../storage.js";
export declare function restoreAccountsFromBackupEntry(params: {
    path: string;
    options?: {
        persist?: boolean;
    };
    restoreAccountsFromBackupPath: (path: string, options: {
        persist?: boolean;
        backupRoot: string;
        realpath: (path: string) => Promise<string>;
        loadAccountsFromPath: (path: string) => Promise<{
            normalized: AccountStorageV3 | null;
        }>;
        saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    }) => Promise<AccountStorageV3>;
    getNamedBackupRoot: (storagePath: string) => string;
    getStoragePath: () => string;
    realpath: (path: string) => Promise<string>;
    loadAccountsFromPath: (path: string) => Promise<{
        normalized: AccountStorageV3 | null;
    }>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
}): Promise<AccountStorageV3>;
//# sourceMappingURL=restore-backup-entry.d.ts.map