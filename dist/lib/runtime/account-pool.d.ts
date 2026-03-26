import type { Workspace } from "../accounts.js";
import type { ModelFamily } from "../prompts/codex.js";
import type { AccountStorageV3 } from "../storage.js";
import type { AccountIdSource, TokenResult } from "../types.js";
export type TokenSuccessWithAccount = Extract<TokenResult, {
    type: "success";
}> & {
    accountIdOverride?: string;
    accountIdSource?: AccountIdSource;
    accountLabel?: string;
    workspaces?: Workspace[];
};
export declare function persistAccountPoolResults(params: {
    results: TokenSuccessWithAccount[];
    replaceAll?: boolean;
    modelFamilies: readonly ModelFamily[];
    withAccountStorageTransaction: <T>(handler: (loadedStorage: AccountStorageV3 | null, persist: (storage: AccountStorageV3) => Promise<void>) => Promise<T>) => Promise<T>;
    findMatchingAccountIndex: typeof import("../storage.js").findMatchingAccountIndex;
    extractAccountId: (accessToken: string) => string | undefined;
    extractAccountEmail: (accessToken: string, idToken?: string) => string | undefined;
    sanitizeEmail: (email: string | undefined) => string | undefined;
}): Promise<void>;
//# sourceMappingURL=account-pool.d.ts.map