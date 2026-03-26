export function ensureRefreshGuardianEntry(params) {
    return params.ensureRefreshGuardianState({
        enabled: params.getProactiveRefreshGuardian(params.pluginConfig),
        intervalMs: params.getProactiveRefreshIntervalMs(params.pluginConfig),
        bufferMs: params.getProactiveRefreshBufferMs(params.pluginConfig),
        currentGuardian: params.currentGuardian,
        currentConfigKey: params.currentConfigKey,
        createGuardian: params.createGuardian,
        registerCleanup: params.registerCleanup,
    });
}
//# sourceMappingURL=refresh-guardian-entry.js.map