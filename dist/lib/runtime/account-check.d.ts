import type { ModelFamily } from "../prompts/codex.js";
import type { AccountStorageV3, FlaggedAccountMetadataV1 } from "../storage.js";
import type { AccountIdSource, TokenResult } from "../types.js";
import type { AccountCheckWorkingState } from "./account-check-types.js";
import type { CodexQuotaSnapshot } from "./quota-headers.js";
export declare function runRuntimeAccountCheck(deepProbe: boolean, deps: {
    hydrateEmails: (storage: AccountStorageV3 | null) => Promise<AccountStorageV3 | null>;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    createEmptyStorage: () => AccountStorageV3;
    loadFlaggedAccounts: () => Promise<{
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }>;
    createAccountCheckWorkingState: (flaggedStorage: {
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }) => AccountCheckWorkingState;
    lookupCodexCliTokensByEmail: (email: string | undefined) => Promise<{
        refreshToken?: string;
        accessToken: string;
        expiresAt?: number;
    } | null | undefined>;
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    shouldUpdateAccountIdFromToken: (source: AccountIdSource | undefined, currentAccountId: string | undefined) => boolean;
    sanitizeEmail: (email: string | undefined) => string | undefined;
    extractAccountEmail: (accessToken: string | undefined, idToken?: string | undefined) => string | undefined;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    isRuntimeFlaggableFailure: (failure: Extract<TokenResult, {
        type: "failed";
    }>) => boolean;
    fetchCodexQuotaSnapshot: (params: {
        accountId: string;
        accessToken: string;
    }) => Promise<CodexQuotaSnapshot>;
    resolveRequestAccountId: (accountId: string | undefined, accountIdSource: AccountIdSource | undefined, tokenAccountId: string | undefined) => string | undefined;
    formatCodexQuotaLine: (snapshot: CodexQuotaSnapshot) => string;
    clampRuntimeActiveIndices: (storage: AccountStorageV3, modelFamilies: readonly ModelFamily[]) => void;
    MODEL_FAMILIES: readonly ModelFamily[];
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    invalidateAccountManagerCache: () => void;
    saveFlaggedAccounts: (storage: {
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }) => Promise<void>;
    now?: () => number;
    showLine: (message: string) => void;
}): Promise<void>;
//# sourceMappingURL=account-check.d.ts.map