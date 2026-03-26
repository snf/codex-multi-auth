import type { AccountStorageV3 } from "../storage.js";
export declare function parseAndNormalizeStorage(data: unknown, normalizeAccountStorage: (data: unknown) => AccountStorageV3 | null, isRecord: (value: unknown) => value is Record<string, unknown>): {
    normalized: AccountStorageV3 | null;
    storedVersion: unknown;
    schemaErrors: string[];
};
export declare function loadAccountsFromPath(path: string, deps: {
    normalizeAccountStorage: (data: unknown) => AccountStorageV3 | null;
    isRecord: (value: unknown) => value is Record<string, unknown>;
}): Promise<{
    normalized: AccountStorageV3 | null;
    storedVersion: unknown;
    schemaErrors: string[];
}>;
//# sourceMappingURL=storage-parser.d.ts.map