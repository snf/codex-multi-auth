import type { Workspace } from "../accounts.js";
import type { AccountIdSource } from "../types.js";
export type TokenSuccessWithAccount<T extends {
    access: string;
    idToken?: string;
}> = T & {
    accountIdOverride?: string;
    accountIdSource?: AccountIdSource;
    accountLabel?: string;
    workspaces?: Workspace[];
};
type AccountCandidate = {
    accountId: string;
    label: string;
    isDefault?: boolean;
    source: AccountIdSource;
};
export declare function resolveAccountSelection<T extends {
    access: string;
    idToken?: string;
}>(tokens: T, deps: {
    envAccountId?: string;
    logInfo: (message: string) => void;
    getAccountIdCandidates: (accessToken: string, idToken?: string) => AccountCandidate[];
    selectBestAccountCandidate: (candidates: AccountCandidate[]) => AccountCandidate | null | undefined;
}): TokenSuccessWithAccount<T>;
export {};
//# sourceMappingURL=account-selection.d.ts.map