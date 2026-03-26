export interface QuotaSchedulerWindow {
    usedPercent?: number;
    resetAtMs?: number;
}
export interface QuotaSchedulerSnapshot {
    status: number;
    primary: QuotaSchedulerWindow;
    secondary: QuotaSchedulerWindow;
    updatedAt: number;
}
export interface QuotaDeferralDecision {
    defer: boolean;
    waitMs: number;
    reason?: "rate-limit" | "quota-near-exhaustion";
}
export interface QuotaSchedulerOptions {
    enabled?: boolean;
    remainingPercentThresholdPrimary?: number;
    remainingPercentThresholdSecondary?: number;
    usedPercentThreshold?: number;
    maxDeferralMs?: number;
}
/**
 * Create a quota snapshot from HTTP headers when quota signals are present.
 *
 * Parses primary and secondary used-percent and reset timestamps and produces a snapshot; returns `null` if no quota signals are present.
 *
 * Concurrency: pure and safe for concurrent calls.
 * Filesystem: does not access the filesystem (no Windows-specific behavior).
 * Token handling: does not log or persist header values; callers should redact sensitive headers before logging or storing.
 *
 * @param headers - HTTP headers to read quota signals from; may contain sensitive values
 * @param status - HTTP status code associated with the snapshot
 * @param now - Millisecond epoch used as the snapshot's `updatedAt` timestamp
 * @returns A QuotaSchedulerSnapshot built from available header values, or `null` when no signals are present
 */
export declare function readQuotaSchedulerSnapshot(headers: Headers, status: number, now?: number): QuotaSchedulerSnapshot | null;
export declare class PreemptiveQuotaScheduler {
    private readonly snapshots;
    private enabled;
    private primaryRemainingPercentThreshold;
    private secondaryRemainingPercentThreshold;
    private maxDeferralMs;
    private lastPruneAt;
    constructor(options?: QuotaSchedulerOptions);
    configure(options?: QuotaSchedulerOptions): void;
    private maybePrune;
    update(key: string, snapshot: QuotaSchedulerSnapshot): void;
    markRateLimited(key: string, retryAfterMs: number, now?: number): void;
    getDeferral(key: string, now?: number): QuotaDeferralDecision;
    prune(now?: number): number;
}
//# sourceMappingURL=preemptive-quota-scheduler.d.ts.map