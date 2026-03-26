import type { OAuthAuthDetails } from "../types.js";
type LiveAccountSyncLike = {
    stop: () => void;
    syncToPath: (path: string) => Promise<void>;
};
export declare function ensureLiveAccountSyncEntry<TSync extends LiveAccountSyncLike>(params: {
    pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>;
    authFallback?: OAuthAuthDetails;
    currentSync: TSync | null;
    currentPath: string | null;
    getLiveAccountSync: (config: ReturnType<typeof import("../config.js").loadPluginConfig>) => boolean;
    getStoragePath: () => string;
    createSync: (authFallback?: OAuthAuthDetails) => TSync;
    registerCleanup: (cleanup: () => void) => void;
    logWarn: (message: string) => void;
    pluginName: string;
    ensureLiveAccountSyncState: (args: {
        enabled: boolean;
        targetPath: string;
        currentSync: TSync | null;
        currentPath: string | null;
        authFallback?: OAuthAuthDetails;
        createSync: (authFallback?: OAuthAuthDetails) => TSync;
        registerCleanup: (cleanup: () => void) => void;
        logWarn: (message: string) => void;
        pluginName: string;
    }) => Promise<{
        liveAccountSync: TSync | null;
        liveAccountSyncPath: string | null;
    }>;
}): Promise<{
    liveAccountSync: TSync | null;
    liveAccountSyncPath: string | null;
}>;
export {};
//# sourceMappingURL=live-sync-entry.d.ts.map