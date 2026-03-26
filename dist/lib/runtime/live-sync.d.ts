import type { OAuthAuthDetails } from "../types.js";
export interface LiveSyncController {
    stop(): void;
    syncToPath(path: string): Promise<void>;
}
export declare function ensureRuntimeLiveAccountSync<TConfig, TSync extends LiveSyncController>(deps: {
    pluginConfig: TConfig;
    authFallback?: OAuthAuthDetails;
    getLiveAccountSync: (config: TConfig) => boolean;
    getStoragePath: () => string;
    currentSync: TSync | null;
    currentPath: string | null;
    currentCleanupRegistered: boolean;
    getCurrentSync: () => TSync | null;
    createSync: (onChange: () => Promise<void>, options: {
        debounceMs: number;
        pollIntervalMs: number;
    }) => TSync;
    reloadAccountManagerFromDisk: (authFallback?: OAuthAuthDetails) => Promise<unknown>;
    getLiveAccountSyncDebounceMs: (config: TConfig) => number;
    getLiveAccountSyncPollMs: (config: TConfig) => number;
    commitState: (state: {
        sync: TSync | null;
        path: string | null;
        cleanupRegistered: boolean;
    }) => void;
    registerCleanup: (cleanup: () => void) => void;
    logWarn: (message: string) => void;
    pluginName: string;
}): Promise<{
    sync: TSync | null;
    path: string | null;
    cleanupRegistered: boolean;
}>;
//# sourceMappingURL=live-sync.d.ts.map