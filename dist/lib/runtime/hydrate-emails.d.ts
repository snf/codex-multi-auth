import type { AccountStorageV3 } from "../storage.js";
import type { AccountIdSource, TokenResult } from "../types.js";
export declare function hydrateRuntimeEmails(storage: AccountStorageV3 | null, deps: {
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    sanitizeEmail: (email: string | undefined) => string | undefined;
    extractAccountEmail: (accessToken: string | undefined, idToken?: string | undefined) => string | undefined;
    shouldUpdateAccountIdFromToken: (accountIdSource: AccountIdSource | undefined, accountId: string | undefined) => boolean;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    logWarn: (message: string) => void;
    pluginName: string;
}): Promise<AccountStorageV3 | null>;
//# sourceMappingURL=hydrate-emails.d.ts.map