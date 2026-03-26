/**
 * Rotation Strategy Module
 *
 * Implements health-based account selection with token bucket rate limiting.
 * Ported from antigravity-auth rotation logic for optimal account rotation
 * when rate limits are encountered.
 */
import { createLogger } from "./logger.js";
const log = createLogger("rotation");
export const DEFAULT_HEALTH_SCORE_CONFIG = {
    successDelta: 1,
    rateLimitDelta: -10,
    failureDelta: -20,
    maxScore: 100,
    minScore: 0,
    passiveRecoveryPerHour: 2,
};
/**
 * Tracks health scores for accounts to prioritize healthy accounts.
 * Accounts with higher health scores are preferred for selection.
 */
export class HealthScoreTracker {
    entries = new Map();
    config;
    constructor(config = {}) {
        this.config = { ...DEFAULT_HEALTH_SCORE_CONFIG, ...config };
    }
    getKey(accountIndex, quotaKey) {
        return quotaKey ? `${accountIndex}:${quotaKey}` : `${accountIndex}`;
    }
    applyPassiveRecovery(entry) {
        const now = Date.now();
        const hoursSinceUpdate = (now - entry.lastUpdated) / (1000 * 60 * 60);
        const recovery = hoursSinceUpdate * this.config.passiveRecoveryPerHour;
        return Math.min(entry.score + recovery, this.config.maxScore);
    }
    getScore(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.entries.get(key);
        if (!entry)
            return this.config.maxScore;
        return this.applyPassiveRecovery(entry);
    }
    getConsecutiveFailures(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.entries.get(key);
        return entry?.consecutiveFailures ?? 0;
    }
    recordSuccess(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.entries.get(key);
        const baseScore = entry ? this.applyPassiveRecovery(entry) : this.config.maxScore;
        const newScore = Math.min(baseScore + this.config.successDelta, this.config.maxScore);
        this.entries.set(key, {
            score: newScore,
            lastUpdated: Date.now(),
            consecutiveFailures: 0,
        });
    }
    recordRateLimit(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.entries.get(key);
        const baseScore = entry ? this.applyPassiveRecovery(entry) : this.config.maxScore;
        const newScore = Math.max(baseScore + this.config.rateLimitDelta, this.config.minScore);
        this.entries.set(key, {
            score: newScore,
            lastUpdated: Date.now(),
            consecutiveFailures: (entry?.consecutiveFailures ?? 0) + 1,
        });
    }
    recordFailure(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.entries.get(key);
        const baseScore = entry ? this.applyPassiveRecovery(entry) : this.config.maxScore;
        const newScore = Math.max(baseScore + this.config.failureDelta, this.config.minScore);
        this.entries.set(key, {
            score: newScore,
            lastUpdated: Date.now(),
            consecutiveFailures: (entry?.consecutiveFailures ?? 0) + 1,
        });
    }
    reset(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        this.entries.delete(key);
    }
    clear() {
        this.entries.clear();
    }
}
export const DEFAULT_TOKEN_BUCKET_CONFIG = {
    maxTokens: 50,
    tokensPerMinute: 6,
};
const TOKEN_REFUND_WINDOW_MS = 30_000;
/**
 * Client-side token bucket for rate limiting requests per account.
 * Prevents sending requests to accounts that are likely to be rate-limited.
 */
export class TokenBucketTracker {
    buckets = new Map();
    config;
    constructor(config = {}) {
        this.config = { ...DEFAULT_TOKEN_BUCKET_CONFIG, ...config };
    }
    getKey(accountIndex, quotaKey) {
        return quotaKey ? `${accountIndex}:${quotaKey}` : `${accountIndex}`;
    }
    refillTokens(entry) {
        const now = Date.now();
        const minutesSinceRefill = (now - entry.lastRefill) / (1000 * 60);
        const tokensToAdd = minutesSinceRefill * this.config.tokensPerMinute;
        return Math.min(entry.tokens + tokensToAdd, this.config.maxTokens);
    }
    getTokens(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.buckets.get(key);
        if (!entry)
            return this.config.maxTokens;
        return this.refillTokens(entry);
    }
    /**
     * Attempt to consume a token. Returns true if successful, false if bucket is empty.
     */
    tryConsume(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.buckets.get(key);
        const currentTokens = entry ? this.refillTokens(entry) : this.config.maxTokens;
        if (currentTokens < 1) {
            return false;
        }
        const now = Date.now();
        const cutoff = now - TOKEN_REFUND_WINDOW_MS;
        const consumptions = (entry?.consumptions ?? []).filter((timestamp) => timestamp >= cutoff);
        consumptions.push(now);
        this.buckets.set(key, {
            tokens: currentTokens - 1,
            lastRefill: now,
            consumptions,
        });
        return true;
    }
    /**
     * Attempt to refund a token consumed within the refund window.
     * Use this when a request fails due to network errors (not rate limits).
     * @returns true if refund was successful, false if no valid consumption found
     */
    refundToken(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.buckets.get(key);
        if (!entry || entry.consumptions.length === 0)
            return false;
        const now = Date.now();
        const cutoff = now - TOKEN_REFUND_WINDOW_MS;
        const validIndex = entry.consumptions.findIndex((timestamp) => timestamp >= cutoff);
        if (validIndex === -1)
            return false;
        entry.consumptions.splice(validIndex, 1);
        const currentTokens = this.refillTokens(entry);
        this.buckets.set(key, {
            tokens: Math.min(currentTokens + 1, this.config.maxTokens),
            lastRefill: now,
            consumptions: entry.consumptions,
        });
        return true;
    }
    /**
     * Drain tokens on rate limit to prevent immediate retries.
     */
    drain(accountIndex, quotaKey, drainAmount = 10) {
        const key = this.getKey(accountIndex, quotaKey);
        const entry = this.buckets.get(key);
        const currentTokens = entry ? this.refillTokens(entry) : this.config.maxTokens;
        this.buckets.set(key, {
            tokens: Math.max(0, currentTokens - drainAmount),
            lastRefill: Date.now(),
            consumptions: entry?.consumptions ?? [],
        });
    }
    reset(accountIndex, quotaKey) {
        const key = this.getKey(accountIndex, quotaKey);
        this.buckets.delete(key);
    }
    clear() {
        this.buckets.clear();
    }
}
export const DEFAULT_HYBRID_SELECTION_CONFIG = {
    healthWeight: 2,
    tokenWeight: 5,
    freshnessWeight: 2.0,
};
export function selectHybridAccount(accountsOrParams, healthTracker, tokenTracker, quotaKey, config = {}, options = {}) {
    const namedParams = !Array.isArray(accountsOrParams) &&
        accountsOrParams !== null &&
        typeof accountsOrParams === "object"
        ? accountsOrParams
        : null;
    const resolvedAccounts = namedParams ? namedParams.accounts : accountsOrParams;
    const resolvedHealthTracker = namedParams ? namedParams.healthTracker : healthTracker;
    const resolvedTokenTracker = namedParams ? namedParams.tokenTracker : tokenTracker;
    const resolvedQuotaKey = namedParams ? namedParams.quotaKey : quotaKey;
    const resolvedConfig = namedParams ? (namedParams.config ?? {}) : config;
    const resolvedOptions = namedParams ? (namedParams.options ?? {}) : options;
    if (!Array.isArray(resolvedAccounts)) {
        throw new TypeError("selectHybridAccount requires accounts to be an array");
    }
    if (!resolvedHealthTracker || !resolvedTokenTracker) {
        throw new TypeError("selectHybridAccount requires healthTracker and tokenTracker");
    }
    const cfg = { ...DEFAULT_HYBRID_SELECTION_CONFIG, ...resolvedConfig };
    const available = resolvedAccounts.filter((a) => a.isAvailable);
    if (available.length === 0) {
        if (resolvedAccounts.length === 0)
            return null;
        let leastRecentlyUsed = null;
        let oldestTime = Infinity;
        for (const account of resolvedAccounts) {
            if (account.lastUsed < oldestTime) {
                oldestTime = account.lastUsed;
                leastRecentlyUsed = account;
            }
        }
        return leastRecentlyUsed;
    }
    // istanbul ignore next -- defensive: available[0] always exists when length === 1
    if (available.length === 1)
        return available[0] ?? null;
    const now = Date.now();
    let bestAccount = null;
    let bestScore = -Infinity;
    // PID offset: distribute account selection across parallel processes
    // Each process gets a small deterministic bonus based on its PID
    const pidBonus = resolvedOptions.pidOffsetEnabled ? (process.pid % 100) * 0.01 : 0;
    for (const account of available) {
        const health = resolvedHealthTracker.getScore(account.index, resolvedQuotaKey);
        const tokens = resolvedTokenTracker.getTokens(account.index, resolvedQuotaKey);
        const hoursSinceUsed = (now - account.lastUsed) / (1000 * 60 * 60);
        const capabilityBoost = typeof resolvedOptions.scoreBoostByAccount?.[account.index] === "number"
            ? resolvedOptions.scoreBoostByAccount[account.index] ?? 0
            : 0;
        const safeCapabilityBoost = Number.isFinite(capabilityBoost) ? capabilityBoost : 0;
        let score = health * cfg.healthWeight +
            tokens * cfg.tokenWeight +
            hoursSinceUsed * cfg.freshnessWeight +
            safeCapabilityBoost;
        // PID-based offset distributes selection across parallel agents
        if (resolvedOptions.pidOffsetEnabled) {
            score += ((account.index * 0.131 + pidBonus) % 1) * cfg.freshnessWeight * 0.1;
        }
        if (score > bestScore) {
            bestScore = score;
            bestAccount = account;
        }
    }
    if (bestAccount && available.length > 1) {
        const health = resolvedHealthTracker.getScore(bestAccount.index, resolvedQuotaKey);
        const tokens = resolvedTokenTracker.getTokens(bestAccount.index, resolvedQuotaKey);
        log.debug("Selected account", {
            index: bestAccount.index,
            health: Math.round(health),
            tokens: Math.round(tokens),
            score: Math.round(bestScore),
            candidateCount: available.length,
        });
    }
    return bestAccount;
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Adds random jitter to a delay value.
 * @param baseMs - Base delay in milliseconds
 * @param jitterFactor - Jitter factor (0-1), default 0.1 (10%)
 * @returns Delay with jitter applied
 */
export function addJitter(baseMs, jitterFactor = 0.1) {
    const jitter = baseMs * jitterFactor * (Math.random() * 2 - 1);
    return Math.max(0, Math.floor(baseMs + jitter));
}
/**
 * Returns a random delay within a range.
 * @param minMs - Minimum delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @returns Random delay within range
 */
export function randomDelay(minMs, maxMs) {
    return Math.floor(minMs + Math.random() * (maxMs - minMs));
}
export function exponentialBackoff(attemptOrOptions, baseMs = 1000, maxMs = 60000, jitterFactor = 0.1) {
    const useNamedParams = typeof attemptOrOptions === "object" && attemptOrOptions !== null;
    const normalizedAttempt = useNamedParams
        ? attemptOrOptions.attempt
        : attemptOrOptions;
    const normalizedBaseMs = useNamedParams
        ? (attemptOrOptions.baseMs ?? 1000)
        : baseMs;
    const normalizedMaxMs = useNamedParams
        ? (attemptOrOptions.maxMs ?? 60000)
        : maxMs;
    const normalizedJitterFactor = useNamedParams
        ? (attemptOrOptions.jitterFactor ?? 0.1)
        : jitterFactor;
    if (!Number.isInteger(normalizedAttempt) || normalizedAttempt < 1) {
        throw new TypeError("exponentialBackoff requires attempt to be a positive integer");
    }
    if (!Number.isFinite(normalizedBaseMs) || normalizedBaseMs < 0) {
        throw new TypeError("exponentialBackoff requires baseMs to be a finite non-negative number");
    }
    if (!Number.isFinite(normalizedMaxMs) || normalizedMaxMs < 0) {
        throw new TypeError("exponentialBackoff requires maxMs to be a finite non-negative number");
    }
    if (!Number.isFinite(normalizedJitterFactor) ||
        normalizedJitterFactor < 0 ||
        normalizedJitterFactor > 1) {
        throw new TypeError("exponentialBackoff requires jitterFactor to be between 0 and 1");
    }
    const delay = Math.min(normalizedBaseMs * Math.pow(2, normalizedAttempt - 1), normalizedMaxMs);
    return addJitter(delay, normalizedJitterFactor);
}
// ============================================================================
// Singleton Instances
// ============================================================================
let healthTrackerInstance = null;
let tokenTrackerInstance = null;
export function getHealthTracker(config) {
    if (!healthTrackerInstance) {
        healthTrackerInstance = new HealthScoreTracker(config);
    }
    return healthTrackerInstance;
}
export function getTokenTracker(config) {
    if (!tokenTrackerInstance) {
        tokenTrackerInstance = new TokenBucketTracker(config);
    }
    return tokenTrackerInstance;
}
export function resetTrackers() {
    healthTrackerInstance?.clear();
    tokenTrackerInstance?.clear();
}
//# sourceMappingURL=rotation.js.map