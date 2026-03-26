import type { OAuthAuthDetails } from "../types.js";
export declare function invalidateAccountManagerCacheEntry<TManager>(params: {
    invalidateAccountManagerCacheState: () => {
        cachedAccountManager: null;
        accountManagerPromise: null;
    };
    setCachedAccountManager: (manager: TManager | null) => void;
    setAccountManagerPromise: (promise: Promise<TManager> | null) => void;
}): void;
export declare function reloadAccountManagerFromDiskEntry<TManager>(params: {
    authFallback?: OAuthAuthDetails;
    currentReloadInFlight: Promise<TManager> | null;
    reloadAccountManagerFromDiskState: (args: {
        currentReloadInFlight: Promise<TManager> | null;
        loadFromDisk: (authFallback?: OAuthAuthDetails) => Promise<TManager>;
        authFallback?: OAuthAuthDetails;
        onLoaded: (manager: TManager) => void;
        onSettled: () => void;
    }) => Promise<TManager>;
    loadFromDisk: (authFallback?: OAuthAuthDetails) => Promise<TManager>;
    onLoaded: (manager: TManager) => void;
    onSettled: () => void;
    setReloadInFlight: (promise: Promise<TManager>) => void;
}): Promise<TManager>;
//# sourceMappingURL=account-manager-cache-entry.d.ts.map