import type { FlaggedAccountStorageV1 } from "../storage.js";
export declare function normalizeFlaggedStorage(data: unknown, deps: {
    isRecord: (value: unknown) => value is Record<string, unknown>;
    now: () => number;
}): FlaggedAccountStorageV1;
//# sourceMappingURL=flagged-storage.d.ts.map