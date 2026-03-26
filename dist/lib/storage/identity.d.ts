type AccountLike = {
    accountId?: string;
    email?: string;
    refreshToken?: string;
};
export type AccountIdentityRef = {
    accountId?: string;
    emailKey?: string;
    refreshToken?: string;
};
export declare function normalizeEmailKey(email: string | undefined): string | undefined;
export declare function toAccountIdentityRef(account: Pick<AccountLike, "accountId" | "email" | "refreshToken"> | null | undefined): AccountIdentityRef;
export declare function getAccountIdentityKey(account: Pick<AccountLike, "accountId" | "email" | "refreshToken">): string | undefined;
export {};
//# sourceMappingURL=identity.d.ts.map