export function applyAccountStorageScope(pluginConfig, deps) {
    const perProjectAccounts = deps.getPerProjectAccounts(pluginConfig);
    deps.setStorageBackupEnabled(deps.getStorageBackupEnabled(pluginConfig));
    if (deps.isCodexCliSyncEnabled()) {
        if (perProjectAccounts) {
            deps.warnPerProjectSyncConflict();
        }
        deps.setStoragePath(null);
        return;
    }
    deps.setStoragePath(perProjectAccounts ? deps.getCwd() : null);
}
//# sourceMappingURL=account-scope.js.map