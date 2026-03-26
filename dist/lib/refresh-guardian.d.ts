import type { AccountManager } from "./accounts.js";
export interface RefreshGuardianOptions {
    intervalMs?: number;
    bufferMs?: number;
}
export interface RefreshGuardianStats {
    runs: number;
    refreshed: number;
    failed: number;
    notNeeded: number;
    noRefreshToken: number;
    rateLimited: number;
    networkFailed: number;
    authFailed: number;
    lastRunAt: number | null;
}
export declare class RefreshGuardian {
    private readonly getAccountManager;
    private readonly intervalMs;
    private readonly bufferMs;
    private timer;
    private running;
    private stats;
    constructor(getAccountManager: () => AccountManager | null, options?: RefreshGuardianOptions);
    start(): void;
    stop(): void;
    getStats(): RefreshGuardianStats;
    private classifyFailureReason;
    tick(): Promise<void>;
}
//# sourceMappingURL=refresh-guardian.d.ts.map