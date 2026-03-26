export interface AuthRateLimitConfig {
    maxAttempts: number;
    windowMs: number;
}
export declare function configureAuthRateLimit(newConfig: Partial<AuthRateLimitConfig>): void;
export declare function getAuthRateLimitConfig(): AuthRateLimitConfig;
export declare function canAttemptAuth(accountId: string): boolean;
export declare function recordAuthAttempt(accountId: string): void;
export declare function getAttemptsRemaining(accountId: string): number;
export declare function getTimeUntilReset(accountId: string): number;
export declare function resetAuthRateLimit(accountId: string): void;
export declare function resetAllAuthRateLimits(): void;
export declare class AuthRateLimitError extends Error {
    readonly accountId: string;
    readonly attemptsRemaining: number;
    readonly resetAfterMs: number;
    constructor(accountId: string, attemptsRemaining: number, resetAfterMs: number);
}
export declare function checkAuthRateLimit(accountId: string): void;
//# sourceMappingURL=auth-rate-limit.d.ts.map