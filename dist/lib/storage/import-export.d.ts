import type { AccountStorageV3 } from "../storage.js";
export declare function exportAccountsToFile(params: {
    resolvedPath: string;
    force: boolean;
    storage: AccountStorageV3 | null;
    beforeCommit?: (resolvedPath: string) => Promise<void> | void;
    logInfo: (message: string, details: Record<string, unknown>) => void;
}): Promise<void>;
export declare function readImportFile(params: {
    resolvedPath: string;
    normalizeAccountStorage: (value: unknown) => AccountStorageV3 | null;
}): Promise<AccountStorageV3>;
export declare function mergeImportedAccounts(params: {
    existing: AccountStorageV3 | null;
    imported: AccountStorageV3;
    maxAccounts: number;
    deduplicateAccounts: (accounts: AccountStorageV3["accounts"]) => AccountStorageV3["accounts"];
}): {
    newStorage: AccountStorageV3;
    imported: number;
    total: number;
    skipped: number;
};
//# sourceMappingURL=import-export.d.ts.map