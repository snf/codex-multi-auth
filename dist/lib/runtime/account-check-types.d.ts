import type { FlaggedAccountMetadataV1 } from "../storage.js";
export type AccountCheckWorkingState = {
    storageChanged: boolean;
    flaggedChanged: boolean;
    ok: number;
    errors: number;
    disabled: number;
    removeFromActive: Set<string>;
    flaggedStorage: {
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    };
};
export declare function createAccountCheckWorkingState(flaggedStorage: {
    version: 1;
    accounts: FlaggedAccountMetadataV1[];
}): AccountCheckWorkingState;
//# sourceMappingURL=account-check-types.d.ts.map