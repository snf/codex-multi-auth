type LoginMenuAccount = {
    accountId?: string;
    accountLabel?: string;
    email?: string;
    index: number;
    addedAt?: number;
    lastUsed?: number;
    status: "active" | "ok" | "rate-limited" | "cooldown" | "disabled";
    isCurrentAccount: boolean;
    enabled: boolean;
};
export declare function buildLoginMenuAccounts(accounts: Array<{
    accountId?: string;
    accountLabel?: string;
    email?: string;
    addedAt?: number;
    lastUsed?: number;
    enabled?: boolean;
    coolingDownUntil?: number;
    rateLimitResetTimes?: Record<string, number | undefined>;
}>, deps: {
    now: number;
    activeIndex: number;
    formatRateLimitEntry: (account: {
        rateLimitResetTimes?: Record<string, number | undefined>;
    }, now: number) => string | null;
}): LoginMenuAccount[];
export {};
//# sourceMappingURL=login-menu-accounts.d.ts.map