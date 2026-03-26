import type { FlaggedAccountMetadataV1 } from "../storage.js";
import type { TokenSuccessWithAccount } from "./account-selection.js";
type SuccessfulAccountTokens = {
    type: "success";
    access: string;
    refresh: string;
    expires: number;
    idToken?: string;
    multiAccount?: boolean;
};
export declare function verifyRuntimeFlaggedAccounts(deps: {
    loadFlaggedAccounts: () => Promise<{
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }>;
    lookupCodexCliTokensByEmail: (email: string | undefined) => Promise<{
        accessToken: string;
        refreshToken?: string;
        expiresAt?: number;
    } | null | undefined>;
    queuedRefresh: (refreshToken: string) => Promise<{
        type: "success";
        access: string;
        refresh: string;
        expires: number;
        idToken?: string;
    } | {
        type: "failed";
        message?: string;
        reason?: string;
    }>;
    resolveTokenSuccessAccount: (tokens: SuccessfulAccountTokens) => TokenSuccessWithAccount<SuccessfulAccountTokens>;
    persistAccounts: (results: Array<TokenSuccessWithAccount<SuccessfulAccountTokens>>, replaceAll?: boolean) => Promise<void>;
    invalidateAccountManagerCache: () => void;
    saveFlaggedAccounts: (storage: {
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }) => Promise<void>;
    logError?: (message: string) => void;
    showLine: (message: string) => void;
    now?: () => number;
}): Promise<void>;
export {};
//# sourceMappingURL=verify-flagged.d.ts.map