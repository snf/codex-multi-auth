/**
 * Rate limiting utilities for account management.
 * Extracted from accounts.ts to reduce module size and improve cohesion.
 */
import { nowMs } from "../utils.js";
export function parseRateLimitReason(code) {
    if (!code)
        return "unknown";
    const lc = code.toLowerCase();
    if (lc.includes("quota") || lc.includes("usage_limit"))
        return "quota";
    if (lc.includes("token") || lc.includes("tpm") || lc.includes("rpm"))
        return "tokens";
    if (lc.includes("concurrent") || lc.includes("parallel"))
        return "concurrent";
    return "unknown";
}
export function getQuotaKey(family, model) {
    if (model) {
        return `${family}:${model}`;
    }
    return family;
}
export function clampNonNegativeInt(value, fallback) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return fallback;
    }
    return value < 0 ? 0 : Math.floor(value);
}
export function clearExpiredRateLimits(entity) {
    const now = nowMs();
    const keys = Object.keys(entity.rateLimitResetTimes);
    for (const key of keys) {
        const resetTime = entity.rateLimitResetTimes[key];
        if (resetTime !== undefined && now >= resetTime) {
            delete entity.rateLimitResetTimes[key];
        }
    }
}
export function isRateLimitedForQuotaKey(entity, key) {
    const resetTime = entity.rateLimitResetTimes[key];
    return resetTime !== undefined && nowMs() < resetTime;
}
export function isRateLimitedForFamily(entity, family, model) {
    clearExpiredRateLimits(entity);
    if (model) {
        const modelKey = getQuotaKey(family, model);
        if (isRateLimitedForQuotaKey(entity, modelKey)) {
            return true;
        }
    }
    const baseKey = getQuotaKey(family);
    return isRateLimitedForQuotaKey(entity, baseKey);
}
export function formatWaitTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0)
        return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}
//# sourceMappingURL=rate-limits.js.map