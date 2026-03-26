export function invalidateRuntimeAccountManagerCache(deps) {
    deps.setCachedAccountManager(null);
    deps.setAccountManagerPromise(null);
}
export function invalidateAccountManagerCacheState() {
    return {
        cachedAccountManager: null,
        accountManagerPromise: null,
    };
}
export function reloadRuntimeAccountManager(deps) {
    // The caller must pass a fresh snapshot of the shared in-flight promise.
    // Dedup only holds if setReloadInFlight runs before any awaited work below.
    if (deps.currentReloadInFlight) {
        return deps.currentReloadInFlight;
    }
    const reloadInFlight = (async () => {
        const reloaded = await deps.loadFromDisk(deps.authFallback);
        deps.setCachedAccountManager(reloaded);
        deps.setAccountManagerPromise(Promise.resolve(reloaded));
        return reloaded;
    })().finally(() => {
        deps.setReloadInFlight(null);
    });
    deps.setReloadInFlight(reloadInFlight);
    return reloadInFlight;
}
export async function reloadAccountManagerFromDiskState(params) {
    if (params.currentReloadInFlight) {
        return params.currentReloadInFlight;
    }
    const inFlight = (async () => {
        const reloaded = await params.loadFromDisk(params.authFallback);
        params.onLoaded(reloaded);
        return reloaded;
    })();
    try {
        return await inFlight;
    }
    finally {
        params.onSettled();
    }
}
//# sourceMappingURL=account-manager-cache.js.map