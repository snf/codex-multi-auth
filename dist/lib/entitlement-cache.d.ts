export interface EntitlementBlock {
    model: string;
    blockedUntil: number;
    reason: "unsupported-model" | "plan-entitlement";
    updatedAt: number;
}
export interface EntitlementCacheSnapshot {
    accounts: Record<string, EntitlementBlock[]>;
}
export interface EntitlementAccountRef {
    accountId?: string;
    email?: string;
    refreshToken?: string;
    index?: number;
}
/**
 * Derives a stable cache key for an entitlement account reference.
 *
 * Produces one of five deterministic keys:
 * - `account:<trimmed accountId>::email:<lowercased trimmed email>` when both are present,
 * - `email:<lowercased trimmed email>` when only `email` is present,
 * - `account:<trimmed accountId>::idx:<non-negative integer>` when `accountId` is present without email,
 * - `account:<trimmed accountId>` when only `accountId` is present and no index is available,
 * - `idx:<non-negative integer>` otherwise (index defaults to 0).
 *
 * This function is pure and concurrency-safe; it performs no I/O and is not affected by Windows filesystem semantics. It never serializes refresh tokens or other secrets into the returned key.
 *
 * @param ref - Reference identifying an account (may include `accountId`, `email`, or `index`)
 * @returns A deterministic string key prefixed with `account:`, `email:`, or `idx:` as described above
 */
export declare function resolveEntitlementAccountKey(ref: EntitlementAccountRef): string;
export declare class EntitlementCache {
    private readonly blocksByAccount;
    markBlocked(accountKey: string, model: string, reason: EntitlementBlock["reason"], ttlMs?: number, now?: number): void;
    clear(accountKey: string, model?: string): void;
    isBlocked(accountKey: string, model: string, now?: number): {
        blocked: boolean;
        waitMs: number;
        reason?: EntitlementBlock["reason"];
    };
    prune(now?: number): number;
    snapshot(now?: number): EntitlementCacheSnapshot;
}
//# sourceMappingURL=entitlement-cache.d.ts.map