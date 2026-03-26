export declare function applyRuntimePreemptiveQuotaSettings<TConfig>(pluginConfig: TConfig, deps: {
    configure: (options: {
        enabled: boolean;
        remainingPercentThresholdPrimary: number;
        remainingPercentThresholdSecondary: number;
        maxDeferralMs: number;
    }) => void;
    getPreemptiveQuotaEnabled: (config: TConfig) => boolean;
    getPreemptiveQuotaRemainingPercent5h: (config: TConfig) => number;
    getPreemptiveQuotaRemainingPercent7d: (config: TConfig) => number;
    getPreemptiveQuotaMaxDeferralMs: (config: TConfig) => number;
}): void;
//# sourceMappingURL=preemptive-quota.d.ts.map