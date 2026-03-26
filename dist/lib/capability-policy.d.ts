export interface CapabilityPolicySnapshot {
    successes: number;
    failures: number;
    unsupported: number;
    lastSuccessAt?: number;
    lastFailureAt?: number;
}
export declare class CapabilityPolicyStore {
    private readonly entries;
    recordSuccess(accountKey: string, model: string, now?: number): void;
    recordFailure(accountKey: string, model: string, now?: number): void;
    recordUnsupported(accountKey: string, model: string, now?: number): void;
    getBoost(accountKey: string, model: string, now?: number): number;
    getSnapshot(accountKey: string, model: string): CapabilityPolicySnapshot | null;
    clearAccount(accountKey: string): number;
    private evictIfNeeded;
}
//# sourceMappingURL=capability-policy.d.ts.map