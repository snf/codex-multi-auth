export function applyAccountStorageScopeFromConfig(pluginConfig, deps) {
    const perProjectAccounts = deps.getPerProjectAccounts(pluginConfig);
    deps.setStorageBackupEnabled(deps.getStorageBackupEnabled(pluginConfig));
    if (deps.isCodexCliSyncEnabled()) {
        if (perProjectAccounts && !deps.getWarningShown()) {
            deps.setWarningShown(true);
            deps.logWarn(`[${deps.pluginName}] CODEX_AUTH_PER_PROJECT_ACCOUNTS is ignored while Codex CLI sync is enabled. Using global account storage.`);
        }
        deps.setStoragePath(null);
        return;
    }
    deps.setStoragePath(perProjectAccounts ? deps.cwd() : null);
}
//# sourceMappingURL=storage-scope.js.map