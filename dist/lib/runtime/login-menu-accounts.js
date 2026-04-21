export function buildLoginMenuAccounts(accounts, deps) {
    return accounts.map((account, index) => {
        let status;
        if (account.enabled === false) {
            status = "disabled";
        }
        else if (account.requiresReauth === true) {
            status = "reauth";
        }
        else if (typeof account.coolingDownUntil === "number" &&
            account.coolingDownUntil > deps.now) {
            status = "cooldown";
        }
        else if (deps.formatRateLimitEntry(account, deps.now)) {
            status = "rate-limited";
        }
        else if (index === deps.activeIndex) {
            status = "active";
        }
        else {
            status = "ok";
        }
        return {
            accountId: account.accountId,
            accountLabel: account.accountLabel,
            email: account.email,
            index,
            addedAt: account.addedAt,
            lastUsed: account.lastUsed,
            status,
            isCurrentAccount: index === deps.activeIndex,
            enabled: account.enabled !== false,
        };
    });
}
//# sourceMappingURL=login-menu-accounts.js.map