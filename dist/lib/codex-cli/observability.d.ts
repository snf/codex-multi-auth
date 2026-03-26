export interface CodexCliMetrics {
    readAttempts: number;
    readSuccesses: number;
    readMisses: number;
    readFailures: number;
    legacySyncEnvUses: number;
    reconcileAttempts: number;
    reconcileChanges: number;
    reconcileNoops: number;
    reconcileFailures: number;
    writeAttempts: number;
    writeSuccesses: number;
    writeFailures: number;
}
export declare function incrementCodexCliMetric(key: keyof CodexCliMetrics, delta?: number): void;
export declare function getCodexCliMetricsSnapshot(): CodexCliMetrics;
export declare function resetCodexCliMetricsForTests(): void;
export declare function makeAccountFingerprint(input: {
    accountId?: string;
    email?: string;
}): string | undefined;
//# sourceMappingURL=observability.d.ts.map