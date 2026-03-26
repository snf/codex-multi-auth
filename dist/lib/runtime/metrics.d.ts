import type { FailoverMode } from "../request/failure-policy.js";
export declare const MAX_RETRY_HINT_MS: number;
export type RuntimeMetrics = {
    startedAt: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    rateLimitedResponses: number;
    serverErrors: number;
    networkErrors: number;
    userAborts: number;
    authRefreshFailures: number;
    emptyResponseRetries: number;
    accountRotations: number;
    sameAccountRetries: number;
    streamFailoverAttempts: number;
    streamFailoverRecoveries: number;
    streamFailoverCrossAccountRecoveries: number;
    cumulativeLatencyMs: number;
    lastRequestAt: number | null;
    lastError: string | null;
};
export declare function createRuntimeMetrics(now?: number): RuntimeMetrics;
export declare function parseFailoverMode(value: string | undefined): FailoverMode;
export declare function parseEnvInt(value: string | undefined): number | undefined;
export declare function clampRetryHintMs(value: number): number | null;
export declare function parseRetryAfterHintMs(headers: Headers, now?: number): number | null;
export declare function sanitizeResponseHeadersForLog(headers: Headers): Record<string, string>;
//# sourceMappingURL=metrics.d.ts.map