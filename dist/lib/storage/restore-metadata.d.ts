import type { AccountStorageV3 } from "../storage.js";
type RestoreReason = "empty-storage" | "intentional-reset" | "missing-storage";
type AccountStorageWithMetadata = AccountStorageV3 & {
    restoreEligible?: boolean;
    restoreReason?: RestoreReason;
};
export declare function createEmptyStorageWithRestoreMetadata(restoreEligible: boolean, restoreReason: RestoreReason): AccountStorageWithMetadata;
export declare function withRestoreMetadata(storage: AccountStorageV3, restoreEligible: boolean, restoreReason: RestoreReason): AccountStorageWithMetadata;
export {};
//# sourceMappingURL=restore-metadata.d.ts.map