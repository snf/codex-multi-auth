export function applyAccountStorageScopeEntry(params) {
    params.applyAccountStorageScopeFromConfig(params.pluginConfig, {
        getPerProjectAccounts: params.getPerProjectAccounts,
        getStorageBackupEnabled: params.getStorageBackupEnabled,
        setStorageBackupEnabled: params.setStorageBackupEnabled,
        isCodexCliSyncEnabled: params.isCodexCliSyncEnabled,
        getWarningShown: params.getWarningShown,
        setWarningShown: params.setWarningShown,
        logWarn: params.logWarn,
        pluginName: params.pluginName,
        setStoragePath: params.setStoragePath,
        cwd: params.cwd,
    });
}
//# sourceMappingURL=account-storage-scope-entry.js.map