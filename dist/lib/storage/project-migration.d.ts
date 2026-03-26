import type { AccountStorageV3 } from "../storage.js";
export declare function loadNormalizedStorageFromPath(path: string, label: string, deps: {
    loadAccountsFromPath: (path: string) => Promise<{
        normalized: AccountStorageV3 | null;
        schemaErrors: string[];
    }>;
    logWarn: (message: string, details: Record<string, unknown>) => void;
}): Promise<AccountStorageV3 | null>;
export declare function mergeStorageForMigration(current: AccountStorageV3 | null, incoming: AccountStorageV3, normalizeAccountStorage: (value: unknown) => AccountStorageV3 | null): AccountStorageV3;
//# sourceMappingURL=project-migration.d.ts.map