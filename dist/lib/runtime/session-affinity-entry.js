export function ensureSessionAffinityEntry(params) {
    return params.ensureSessionAffinityState({
        enabled: params.getSessionAffinity(params.pluginConfig),
        ttlMs: params.getSessionAffinityTtlMs(params.pluginConfig),
        maxEntries: params.getSessionAffinityMaxEntries(params.pluginConfig),
        currentStore: params.currentStore,
        currentConfigKey: params.currentConfigKey,
        createStore: params.createStore,
    });
}
//# sourceMappingURL=session-affinity-entry.js.map