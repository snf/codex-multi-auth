export function invalidateAccountManagerCacheEntry(params) {
    const next = params.invalidateAccountManagerCacheState();
    params.setCachedAccountManager(next.cachedAccountManager);
    params.setAccountManagerPromise(next.accountManagerPromise);
}
export async function reloadAccountManagerFromDiskEntry(params) {
    const inFlight = params.reloadAccountManagerFromDiskState({
        currentReloadInFlight: params.currentReloadInFlight,
        loadFromDisk: params.loadFromDisk,
        authFallback: params.authFallback,
        onLoaded: params.onLoaded,
        onSettled: params.onSettled,
    });
    params.setReloadInFlight(inFlight);
    return inFlight;
}
//# sourceMappingURL=account-manager-cache-entry.js.map