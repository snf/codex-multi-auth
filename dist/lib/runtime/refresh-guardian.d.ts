export interface RefreshGuardianController {
    stop(): void;
    start(): void;
}
export declare function ensureRuntimeRefreshGuardian<TConfig, TGuardian extends RefreshGuardianController>(deps: {
    pluginConfig: TConfig;
    getProactiveRefreshGuardian: (config: TConfig) => boolean;
    currentGuardian: TGuardian | null;
    currentConfigKey: string | null;
    currentCleanupRegistered: boolean;
    getCurrentGuardian: () => TGuardian | null;
    getProactiveRefreshIntervalMs: (config: TConfig) => number;
    getProactiveRefreshBufferMs: (config: TConfig) => number;
    createGuardian: (options: {
        intervalMs: number;
        bufferMs: number;
    }) => TGuardian;
    registerCleanup: (cleanup: () => void) => void;
}): {
    guardian: TGuardian | null;
    configKey: string | null;
    cleanupRegistered: boolean;
};
//# sourceMappingURL=refresh-guardian.d.ts.map