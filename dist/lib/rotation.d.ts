/**
 * Rotation Strategy Module
 *
 * Implements health-based account selection with token bucket rate limiting.
 * Ported from antigravity-auth rotation logic for optimal account rotation
 * when rate limits are encountered.
 */
export interface HealthScoreConfig {
    /** Points added on successful request */
    successDelta: number;
    /** Points deducted on rate limit (negative) */
    rateLimitDelta: number;
    /** Points deducted on other failures (negative) */
    failureDelta: number;
    /** Maximum health score */
    maxScore: number;
    /** Minimum health score */
    minScore: number;
    /** Points recovered per hour of inactivity */
    passiveRecoveryPerHour: number;
}
export declare const DEFAULT_HEALTH_SCORE_CONFIG: HealthScoreConfig;
/**
 * Tracks health scores for accounts to prioritize healthy accounts.
 * Accounts with higher health scores are preferred for selection.
 */
export declare class HealthScoreTracker {
    private entries;
    private config;
    constructor(config?: Partial<HealthScoreConfig>);
    private getKey;
    private applyPassiveRecovery;
    getScore(accountIndex: number, quotaKey?: string): number;
    getConsecutiveFailures(accountIndex: number, quotaKey?: string): number;
    recordSuccess(accountIndex: number, quotaKey?: string): void;
    recordRateLimit(accountIndex: number, quotaKey?: string): void;
    recordFailure(accountIndex: number, quotaKey?: string): void;
    reset(accountIndex: number, quotaKey?: string): void;
    clear(): void;
}
export interface TokenBucketConfig {
    /** Maximum tokens in bucket */
    maxTokens: number;
    /** Tokens regenerated per minute */
    tokensPerMinute: number;
}
export declare const DEFAULT_TOKEN_BUCKET_CONFIG: TokenBucketConfig;
/**
 * Client-side token bucket for rate limiting requests per account.
 * Prevents sending requests to accounts that are likely to be rate-limited.
 */
export declare class TokenBucketTracker {
    private buckets;
    private config;
    constructor(config?: Partial<TokenBucketConfig>);
    private getKey;
    private refillTokens;
    getTokens(accountIndex: number, quotaKey?: string): number;
    /**
     * Attempt to consume a token. Returns true if successful, false if bucket is empty.
     */
    tryConsume(accountIndex: number, quotaKey?: string): boolean;
    /**
     * Attempt to refund a token consumed within the refund window.
     * Use this when a request fails due to network errors (not rate limits).
     * @returns true if refund was successful, false if no valid consumption found
     */
    refundToken(accountIndex: number, quotaKey?: string): boolean;
    /**
     * Drain tokens on rate limit to prevent immediate retries.
     */
    drain(accountIndex: number, quotaKey?: string, drainAmount?: number): void;
    reset(accountIndex: number, quotaKey?: string): void;
    clear(): void;
}
export interface AccountWithMetrics {
    index: number;
    isAvailable: boolean;
    lastUsed: number;
}
export interface HybridSelectionConfig {
    /** Weight for health score (default: 2) */
    healthWeight: number;
    /** Weight for token count (default: 5) */
    tokenWeight: number;
    /** Weight for freshness/last used (default: 0.1) */
    freshnessWeight: number;
}
export declare const DEFAULT_HYBRID_SELECTION_CONFIG: HybridSelectionConfig;
/**
 * Selects the best account using a hybrid scoring strategy.
 *
 * Score = (health * healthWeight) + (tokens * tokenWeight) + (freshness * freshnessWeight)
 *
 * Where:
 * - health: Account health score (0-100)
 * - tokens: Available tokens in bucket (0-maxTokens)
 * - freshness: Hours since last used (higher = more fresh for rotation)
 */
export interface HybridSelectionOptions {
    pidOffsetEnabled?: boolean;
    scoreBoostByAccount?: Record<number, number>;
}
/**
 * Named-parameter alternative for selectHybridAccount to avoid brittle positional arguments.
 */
export interface SelectHybridAccountParams {
    accounts: AccountWithMetrics[];
    healthTracker: HealthScoreTracker;
    tokenTracker: TokenBucketTracker;
    quotaKey?: string;
    config?: Partial<HybridSelectionConfig>;
    options?: HybridSelectionOptions;
}
/**
 * Selects the best account from a set using a weighted hybrid score composed of health, token availability, and freshness.
 *
 * @param accounts - Candidate accounts with availability (`isAvailable`) and last-used timestamp (`lastUsed`); when none are available the least-recently-used account is returned.
 * @param healthTracker - Tracker used to obtain per-account health scores (scoped by `quotaKey` when provided).
 * @param tokenTracker - Tracker used to obtain per-account token counts (scoped by `quotaKey` when provided). Logged token values are rounded for telemetry and sensitive tokens are not emitted.
 * @param quotaKey - Optional quota key to scope health and token lookups.
 * @param config - Partial selection weights that override defaults (healthWeight, tokenWeight, freshnessWeight).
 * @param options - Selection options. `pidOffsetEnabled` adds a small PID-based deterministic offset to distribute selection across processes. `scoreBoostByAccount` is an optional per-account numeric boost keyed by account index.
 * @returns The chosen AccountWithMetrics for the next request, or `null` if no accounts exist.
 *
 * Concurrency & environment notes:
 * - Selection is deterministic given the same inputs except when `pidOffsetEnabled` is used to bias selection per-process.
 * - The function is purely in-memory and performs no filesystem operations (no Windows filesystem considerations).
 */
export declare function selectHybridAccount(params: SelectHybridAccountParams): AccountWithMetrics | null;
export declare function selectHybridAccount(accounts: AccountWithMetrics[], healthTracker: HealthScoreTracker, tokenTracker: TokenBucketTracker, quotaKey?: string, config?: Partial<HybridSelectionConfig>, options?: HybridSelectionOptions): AccountWithMetrics | null;
/**
 * Adds random jitter to a delay value.
 * @param baseMs - Base delay in milliseconds
 * @param jitterFactor - Jitter factor (0-1), default 0.1 (10%)
 * @returns Delay with jitter applied
 */
export declare function addJitter(baseMs: number, jitterFactor?: number): number;
/**
 * Returns a random delay within a range.
 * @param minMs - Minimum delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @returns Random delay within range
 */
export declare function randomDelay(minMs: number, maxMs: number): number;
export interface ExponentialBackoffOptions {
    attempt: number;
    baseMs?: number;
    maxMs?: number;
    jitterFactor?: number;
}
/**
 * Calculates exponential backoff with jitter.
 * @param attempt - Attempt number (1-based)
 * @param baseMs - Base delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @param jitterFactor - Jitter factor (0-1)
 * @returns Backoff delay with jitter
 */
export declare function exponentialBackoff(options: ExponentialBackoffOptions): number;
export declare function exponentialBackoff(attempt: number, baseMs?: number, maxMs?: number, jitterFactor?: number): number;
export declare function getHealthTracker(config?: Partial<HealthScoreConfig>): HealthScoreTracker;
export declare function getTokenTracker(config?: Partial<TokenBucketConfig>): TokenBucketTracker;
export declare function resetTrackers(): void;
//# sourceMappingURL=rotation.d.ts.map