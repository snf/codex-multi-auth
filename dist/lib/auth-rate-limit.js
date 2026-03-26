const DEFAULT_CONFIG = {
    maxAttempts: 5,
    windowMs: 60_000,
};
const attemptsByAccount = new Map();
let config = { ...DEFAULT_CONFIG };
export function configureAuthRateLimit(newConfig) {
    config = { ...config, ...newConfig };
}
export function getAuthRateLimitConfig() {
    return { ...config };
}
function getAccountKey(accountId) {
    return accountId.toLowerCase().trim();
}
function pruneOldAttempts(record, now) {
    const cutoff = now - config.windowMs;
    record.timestamps = record.timestamps.filter((ts) => ts > cutoff);
}
export function canAttemptAuth(accountId) {
    const key = getAccountKey(accountId);
    const record = attemptsByAccount.get(key);
    if (!record) {
        return true;
    }
    const now = Date.now();
    pruneOldAttempts(record, now);
    return record.timestamps.length < config.maxAttempts;
}
export function recordAuthAttempt(accountId) {
    const key = getAccountKey(accountId);
    const now = Date.now();
    let record = attemptsByAccount.get(key);
    if (!record) {
        record = { timestamps: [] };
        attemptsByAccount.set(key, record);
    }
    pruneOldAttempts(record, now);
    record.timestamps.push(now);
}
export function getAttemptsRemaining(accountId) {
    const key = getAccountKey(accountId);
    const record = attemptsByAccount.get(key);
    if (!record) {
        return config.maxAttempts;
    }
    const now = Date.now();
    pruneOldAttempts(record, now);
    return Math.max(0, config.maxAttempts - record.timestamps.length);
}
export function getTimeUntilReset(accountId) {
    const key = getAccountKey(accountId);
    const record = attemptsByAccount.get(key);
    if (!record || record.timestamps.length === 0) {
        return 0;
    }
    const now = Date.now();
    pruneOldAttempts(record, now);
    if (record.timestamps.length === 0) {
        return 0;
    }
    const oldestAttempt = Math.min(...record.timestamps);
    const resetTime = oldestAttempt + config.windowMs;
    return Math.max(0, resetTime - now);
}
export function resetAuthRateLimit(accountId) {
    const key = getAccountKey(accountId);
    attemptsByAccount.delete(key);
}
export function resetAllAuthRateLimits() {
    attemptsByAccount.clear();
}
export class AuthRateLimitError extends Error {
    accountId;
    attemptsRemaining;
    resetAfterMs;
    constructor(accountId, attemptsRemaining, resetAfterMs) {
        const resetSeconds = Math.ceil(resetAfterMs / 1000);
        super(`Auth rate limit exceeded for account. Retry after ${resetSeconds}s`);
        this.accountId = accountId;
        this.attemptsRemaining = attemptsRemaining;
        this.resetAfterMs = resetAfterMs;
        this.name = "AuthRateLimitError";
    }
}
export function checkAuthRateLimit(accountId) {
    if (!canAttemptAuth(accountId)) {
        throw new AuthRateLimitError(accountId, getAttemptsRemaining(accountId), getTimeUntilReset(accountId));
    }
}
//# sourceMappingURL=auth-rate-limit.js.map