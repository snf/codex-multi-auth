/**
 * Rate limiting utilities for account management.
 * Extracted from accounts.ts to reduce module size and improve cohesion.
 */
import type { ModelFamily } from "../prompts/codex.js";
export type BaseQuotaKey = ModelFamily;
export type QuotaKey = BaseQuotaKey | `${BaseQuotaKey}:${string}`;
export type RateLimitReason = "quota" | "tokens" | "concurrent" | "unknown";
export declare function parseRateLimitReason(code: string | undefined): RateLimitReason;
export declare function getQuotaKey(family: ModelFamily, model?: string | null): QuotaKey;
export declare function clampNonNegativeInt(value: unknown, fallback: number): number;
export interface RateLimitState {
    [key: string]: number | undefined;
}
export interface RateLimitedEntity {
    rateLimitResetTimes: RateLimitState;
}
export declare function clearExpiredRateLimits(entity: RateLimitedEntity): void;
export declare function isRateLimitedForQuotaKey(entity: RateLimitedEntity, key: QuotaKey): boolean;
export declare function isRateLimitedForFamily(entity: RateLimitedEntity, family: ModelFamily, model?: string | null): boolean;
export declare function formatWaitTime(ms: number): string;
//# sourceMappingURL=rate-limits.d.ts.map