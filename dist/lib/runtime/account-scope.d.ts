export declare function applyAccountStorageScope<TConfig>(pluginConfig: TConfig, deps: {
    getPerProjectAccounts: (config: TConfig) => boolean;
    getStorageBackupEnabled: (config: TConfig) => boolean;
    isCodexCliSyncEnabled: () => boolean;
    setStorageBackupEnabled: (enabled: boolean) => void;
    setStoragePath: (path: string | null) => void;
    getCwd: () => string;
    warnPerProjectSyncConflict: () => void;
}): void;
//# sourceMappingURL=account-scope.d.ts.map