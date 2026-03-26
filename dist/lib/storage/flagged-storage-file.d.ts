import type { FlaggedAccountStorageV1 } from "../storage.js";
export declare function loadFlaggedAccountsFromFile(path: string, deps: {
    readFile: typeof import("node:fs").promises.readFile;
    normalizeFlaggedStorage: (data: unknown) => FlaggedAccountStorageV1;
    sleep?: (ms: number) => Promise<void>;
}): Promise<FlaggedAccountStorageV1>;
//# sourceMappingURL=flagged-storage-file.d.ts.map