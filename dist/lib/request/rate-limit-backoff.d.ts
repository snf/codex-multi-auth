import type { RateLimitReason } from "../accounts.js";
export interface RateLimitBackoffResult {
    attempt: number;
    delayMs: number;
    isDuplicate: boolean;
    reason?: RateLimitReason;
}
export declare const RATE_LIMIT_SHORT_RETRY_THRESHOLD_MS = 5000;
/**
 * Compute rate-limit backoff for an account+quota key.
 */
export declare function getRateLimitBackoff(accountIndex: number, quotaKey: string, serverRetryAfterMs: number | null | undefined): RateLimitBackoffResult;
export declare function resetRateLimitBackoff(accountIndex: number, quotaKey: string): void;
export declare function clearRateLimitBackoffState(): void;
export declare function calculateBackoffMs(baseDelayMs: number, attempt: number, reason?: RateLimitReason): number;
export interface RateLimitBackoffWithReasonParams {
    accountIndex: number;
    quotaKey: string;
    serverRetryAfterMs: number | null | undefined;
    reason?: RateLimitReason;
}
export declare function getRateLimitBackoffWithReason(params: RateLimitBackoffWithReasonParams): RateLimitBackoffResult;
export declare function getRateLimitBackoffWithReason(accountIndex: number, quotaKey: string, serverRetryAfterMs: number | null | undefined, reason?: RateLimitReason): RateLimitBackoffResult;
//# sourceMappingURL=rate-limit-backoff.d.ts.map