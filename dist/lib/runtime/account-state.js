import { formatWaitTime } from "../accounts.js";
export function resolveActiveIndex(storage, family = "codex") {
    const total = storage.accounts.length;
    if (total === 0)
        return 0;
    const rawCandidate = storage.activeIndexByFamily?.[family] ?? storage.activeIndex;
    const raw = Number.isFinite(rawCandidate) ? rawCandidate : 0;
    return Math.max(0, Math.min(raw, total - 1));
}
export function getRateLimitResetTimeForFamily(account, now, family) {
    const times = account.rateLimitResetTimes;
    if (!times)
        return null;
    let minReset = null;
    const prefix = `${family}:`;
    for (const [key, value] of Object.entries(times)) {
        if (typeof value !== "number")
            continue;
        if (value <= now)
            continue;
        if (key !== family && !key.startsWith(prefix))
            continue;
        if (minReset === null || value < minReset) {
            minReset = value;
        }
    }
    return minReset;
}
export function formatRateLimitEntry(account, now, family = "codex") {
    const resetAt = getRateLimitResetTimeForFamily(account, now, family);
    if (typeof resetAt !== "number")
        return null;
    const remaining = resetAt - now;
    if (remaining <= 0)
        return null;
    return `resets in ${formatWaitTime(remaining)}`;
}
//# sourceMappingURL=account-state.js.map