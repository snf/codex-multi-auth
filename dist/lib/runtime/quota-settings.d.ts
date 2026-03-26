export declare function applyPreemptiveQuotaSettingsFromConfig(pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>, deps: {
    configure: (options: {
        enabled: boolean;
        remainingPercentThresholdPrimary: number;
        remainingPercentThresholdSecondary: number;
        maxDeferralMs: number;
    }) => void;
    getPreemptiveQuotaEnabled: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => boolean;
    getPreemptiveQuotaRemainingPercent5h: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => number;
    getPreemptiveQuotaRemainingPercent7d: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => number;
    getPreemptiveQuotaMaxDeferralMs: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => number;
}): void;
export declare function resolveUiRuntimeFromConfig(loadPluginConfig: () => ReturnType<typeof import("../config.js").loadPluginConfig>, applyUiRuntimeFromConfig: (pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>) => ReturnType<typeof import("../ui/runtime.js").getUiRuntimeOptions>): ReturnType<typeof import("../ui/runtime.js").getUiRuntimeOptions>;
//# sourceMappingURL=quota-settings.d.ts.map