import type { OAuthAuthDetails } from "../types.js";
export declare function invalidateRuntimeAccountManagerCache(deps: {
    setCachedAccountManager: (value: unknown) => void;
    setAccountManagerPromise: (value: Promise<unknown> | null) => void;
}): void;
export declare function invalidateAccountManagerCacheState(): {
    cachedAccountManager: null;
    accountManagerPromise: null;
};
export declare function reloadRuntimeAccountManager<TAccountManager>(deps: {
    currentReloadInFlight: Promise<TAccountManager> | null;
    loadFromDisk: (authFallback?: OAuthAuthDetails) => Promise<TAccountManager>;
    setCachedAccountManager: (value: TAccountManager) => void;
    setAccountManagerPromise: (value: Promise<TAccountManager> | null) => void;
    setReloadInFlight: (value: Promise<TAccountManager> | null) => void;
    authFallback?: OAuthAuthDetails;
}): Promise<TAccountManager>;
export declare function reloadAccountManagerFromDiskState<TManager>(params: {
    currentReloadInFlight: Promise<TManager> | null;
    loadFromDisk: (authFallback?: OAuthAuthDetails) => Promise<TManager>;
    authFallback?: OAuthAuthDetails;
    onLoaded: (manager: TManager) => void;
    onSettled: () => void;
}): Promise<TManager>;
//# sourceMappingURL=account-manager-cache.d.ts.map