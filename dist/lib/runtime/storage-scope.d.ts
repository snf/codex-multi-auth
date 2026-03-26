export declare function applyAccountStorageScopeFromConfig(pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>, deps: {
    getPerProjectAccounts: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => boolean;
    getStorageBackupEnabled: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => boolean;
    setStorageBackupEnabled: (enabled: boolean) => void;
    isCodexCliSyncEnabled: () => boolean;
    getWarningShown: () => boolean;
    setWarningShown: (shown: boolean) => void;
    logWarn: (message: string) => void;
    pluginName: string;
    setStoragePath: (path: string | null) => void;
    cwd: () => string;
}): void;
//# sourceMappingURL=storage-scope.d.ts.map