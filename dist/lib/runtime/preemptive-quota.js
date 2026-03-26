export function applyRuntimePreemptiveQuotaSettings(pluginConfig, deps) {
    deps.configure({
        enabled: deps.getPreemptiveQuotaEnabled(pluginConfig),
        remainingPercentThresholdPrimary: deps.getPreemptiveQuotaRemainingPercent5h(pluginConfig),
        remainingPercentThresholdSecondary: deps.getPreemptiveQuotaRemainingPercent7d(pluginConfig),
        maxDeferralMs: deps.getPreemptiveQuotaMaxDeferralMs(pluginConfig),
    });
}
//# sourceMappingURL=preemptive-quota.js.map