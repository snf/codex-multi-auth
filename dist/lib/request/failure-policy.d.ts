import type { CooldownReason } from "../storage.js";
export type FailureKind = "auth-refresh" | "network" | "server" | "rate-limit" | "empty-response";
export type FailoverMode = "aggressive" | "balanced" | "conservative";
export interface FailurePolicyInput {
    kind: FailureKind;
    consecutiveAuthFailures?: number;
    maxAuthFailuresBeforeRemoval?: number;
    serverRetryAfterMs?: number;
    failoverMode?: FailoverMode;
}
export interface FailurePolicyDecision {
    rotateAccount: boolean;
    refundToken: boolean;
    recordFailure: boolean;
    markRateLimited: boolean;
    removeAccount: boolean;
    cooldownMs?: number;
    cooldownReason?: CooldownReason;
    retrySameAccount: boolean;
    retryDelayMs?: number;
    handoffStrategy: "soft" | "hard";
}
/**
 * Compute a FailurePolicyDecision that specifies how to handle a failure described by `input`.
 *
 * Evaluates the provided failure kind and related hints to decide whether to rotate or remove an account,
 * refund a token, record or mark the failure, apply a cooldown, retry on the same account (and with what delay),
 * and choose a handoff strategy.
 *
 * Concurrency assumptions: this function is pure and safe to call concurrently from multiple threads/processes.
 * Filesystem notes: no filesystem access is performed (no Windows-specific behavior).
 * Token redaction: decisions may set `refundToken` to true/false but this function does not log or expose token values.
 *
 * @param input - Configuration and hints for the failure policy (must include `kind`; may include `consecutiveAuthFailures`, `maxAuthFailuresBeforeRemoval`, `serverRetryAfterMs`, and `failoverMode`).
 * @param overrides - Optional environment overrides: `networkCooldownMs` and `serverCooldownMs` adjust fallback cooldown values.
 * @returns A FailurePolicyDecision object describing rotation, refund, recording, rate-limit marking, removal, cooldown and retry behavior, and the chosen handoff strategy.
 */
export declare function evaluateFailurePolicy(input: FailurePolicyInput, overrides?: {
    networkCooldownMs?: number;
    serverCooldownMs?: number;
}): FailurePolicyDecision;
//# sourceMappingURL=failure-policy.d.ts.map