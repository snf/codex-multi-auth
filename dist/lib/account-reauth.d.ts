export declare const ACCOUNT_REAUTH_REASONS: readonly ["access-token-invalidated", "refresh-token-reused", "refresh-token-invalid", "refresh-failed"];
export type AccountReauthReason = (typeof ACCOUNT_REAUTH_REASONS)[number];
export type AccountReauthMetadata = {
    requiresReauth?: boolean;
    reauthReason?: AccountReauthReason;
    reauthMessage?: string;
    reauthDetectedAt?: number;
};
type TokenFailureLike = {
    reason?: string;
    statusCode?: number;
    message?: string;
};
export type AccountReauthRequirement = {
    reason: AccountReauthReason;
    message: string;
};
export declare function classifyRefreshFailureForReauth(failure: TokenFailureLike, options?: {
    sessionUsable?: boolean;
}): AccountReauthRequirement | null;
export declare function classifyAccessTokenFailureForReauth(failure: TokenFailureLike): AccountReauthRequirement | null;
export declare function markAccountReauthRequired(account: AccountReauthMetadata, requirement: AccountReauthRequirement, now: number): boolean;
export declare function clearAccountReauthRequired(account: AccountReauthMetadata): boolean;
export {};
//# sourceMappingURL=account-reauth.d.ts.map