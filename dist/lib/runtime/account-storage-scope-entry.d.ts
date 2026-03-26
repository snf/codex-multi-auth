export declare function applyAccountStorageScopeEntry(params: {
    pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>;
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
    applyAccountStorageScopeFromConfig: (pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>, deps: {
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
    }) => void;
}): void;
//# sourceMappingURL=account-storage-scope-entry.d.ts.map