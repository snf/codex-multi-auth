import type { OAuthAuthDetails } from "../types.js";
type LiveAccountSyncLike = {
    stop: () => void;
    syncToPath: (path: string) => Promise<void>;
};
type RefreshGuardianLike = {
    stop: () => void;
    start: () => void;
};
type SessionAffinityStoreLike = unknown;
export declare function ensureLiveAccountSyncState<TSync extends LiveAccountSyncLike>(params: {
    enabled: boolean;
    targetPath: string;
    currentSync: TSync | null;
    currentPath: string | null;
    authFallback?: OAuthAuthDetails;
    createSync: (authFallback?: OAuthAuthDetails) => TSync;
    registerCleanup: (cleanup: () => void) => void;
    logWarn: (message: string) => void;
    pluginName: string;
}): Promise<{
    liveAccountSync: TSync | null;
    liveAccountSyncPath: string | null;
}>;
export declare function ensureRefreshGuardianState<TGuardian extends RefreshGuardianLike>(params: {
    enabled: boolean;
    intervalMs: number;
    bufferMs: number;
    currentGuardian: TGuardian | null;
    currentConfigKey: string | null;
    currentCleanupRegistered?: boolean;
    getCurrentGuardian?: () => TGuardian | null;
    createGuardian: (options: {
        intervalMs: number;
        bufferMs: number;
    }) => TGuardian;
    registerCleanup: (cleanup: () => void) => void;
}): {
    refreshGuardian: TGuardian | null;
    refreshGuardianConfigKey: string | null;
    refreshGuardianCleanupRegistered: boolean;
};
export declare function ensureSessionAffinityState<TStore extends SessionAffinityStoreLike>(params: {
    enabled: boolean;
    ttlMs: number;
    maxEntries: number;
    currentStore: TStore | null;
    currentConfigKey: string | null;
    createStore: (options: {
        ttlMs: number;
        maxEntries: number;
    }) => TStore;
}): {
    sessionAffinityStore: TStore | null;
    sessionAffinityConfigKey: string | null;
};
export {};
//# sourceMappingURL=runtime-services.d.ts.map