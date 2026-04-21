/**
 * Storage migration utilities for account data format upgrades.
 * Extracted from storage.ts to reduce module size.
 */
import { MODEL_FAMILIES } from "../prompts/codex.js";
function nowMs() {
    return Date.now();
}
export function migrateV1ToV3(v1) {
    const now = nowMs();
    return {
        version: 3,
        accounts: v1.accounts.map((account) => {
            const rateLimitResetTimes = {};
            if (typeof account.rateLimitResetTime === "number" && account.rateLimitResetTime > now) {
                for (const family of MODEL_FAMILIES) {
                    rateLimitResetTimes[family] = account.rateLimitResetTime;
                }
            }
            return {
                accountId: account.accountId,
                accountIdSource: account.accountIdSource,
                accountLabel: account.accountLabel,
                email: account.email,
                refreshToken: account.refreshToken,
                accessToken: account.accessToken,
                expiresAt: account.expiresAt,
                enabled: account.enabled,
                addedAt: account.addedAt,
                lastUsed: account.lastUsed,
                lastSwitchReason: account.lastSwitchReason,
                rateLimitResetTimes: Object.keys(rateLimitResetTimes).length > 0 ? rateLimitResetTimes : undefined,
                coolingDownUntil: account.coolingDownUntil,
                cooldownReason: account.cooldownReason,
                requiresReauth: account.requiresReauth,
                reauthReason: account.reauthReason,
                reauthMessage: account.reauthMessage,
                reauthDetectedAt: account.reauthDetectedAt,
            };
        }),
        activeIndex: v1.activeIndex,
        activeIndexByFamily: Object.fromEntries(MODEL_FAMILIES.map((family) => [family, v1.activeIndex])),
    };
}
//# sourceMappingURL=migrations.js.map