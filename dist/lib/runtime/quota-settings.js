export function applyPreemptiveQuotaSettingsFromConfig(pluginConfig, deps) {
    deps.configure({
        enabled: deps.getPreemptiveQuotaEnabled(pluginConfig),
        remainingPercentThresholdPrimary: deps.getPreemptiveQuotaRemainingPercent5h(pluginConfig),
        remainingPercentThresholdSecondary: deps.getPreemptiveQuotaRemainingPercent7d(pluginConfig),
        maxDeferralMs: deps.getPreemptiveQuotaMaxDeferralMs(pluginConfig),
    });
}
export function resolveUiRuntimeFromConfig(loadPluginConfig, applyUiRuntimeFromConfig) {
    return applyUiRuntimeFromConfig(loadPluginConfig());
}
//# sourceMappingURL=quota-settings.js.map