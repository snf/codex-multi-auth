export async function ensureLiveAccountSyncEntry(params) {
    return params.ensureLiveAccountSyncState({
        enabled: params.getLiveAccountSync(params.pluginConfig),
        targetPath: params.getStoragePath(),
        currentSync: params.currentSync,
        currentPath: params.currentPath,
        authFallback: params.authFallback,
        createSync: params.createSync,
        registerCleanup: params.registerCleanup,
        logWarn: params.logWarn,
        pluginName: params.pluginName,
    });
}
//# sourceMappingURL=live-sync-entry.js.map