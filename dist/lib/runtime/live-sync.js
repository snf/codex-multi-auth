export async function ensureRuntimeLiveAccountSync(deps) {
    if (!deps.getLiveAccountSync(deps.pluginConfig)) {
        deps.currentSync?.stop();
        deps.commitState({
            sync: null,
            path: null,
            cleanupRegistered: deps.currentCleanupRegistered,
        });
        return {
            sync: null,
            path: null,
            cleanupRegistered: deps.currentCleanupRegistered,
        };
    }
    const targetPath = deps.getStoragePath();
    let sync = deps.currentSync;
    let cleanupRegistered = deps.currentCleanupRegistered;
    let nextPath = deps.currentPath;
    const commitState = () => {
        deps.commitState({
            sync,
            path: nextPath,
            cleanupRegistered,
        });
    };
    if (!sync) {
        sync = deps.createSync(async () => {
            await deps.reloadAccountManagerFromDisk(deps.authFallback);
        }, {
            debounceMs: deps.getLiveAccountSyncDebounceMs(deps.pluginConfig),
            pollIntervalMs: deps.getLiveAccountSyncPollMs(deps.pluginConfig),
        });
        commitState();
        if (!cleanupRegistered) {
            deps.registerCleanup(() => {
                deps.getCurrentSync()?.stop();
            });
            cleanupRegistered = true;
            commitState();
        }
    }
    if (nextPath !== targetPath) {
        let switched = false;
        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                await sync.syncToPath(targetPath);
                nextPath = targetPath;
                commitState();
                switched = true;
                break;
            }
            catch (error) {
                const code = error?.code;
                if (code !== "EBUSY" && code !== "EPERM")
                    throw error;
                await new Promise((resolve) => setTimeout(resolve, 25 * 2 ** attempt));
            }
        }
        if (!switched) {
            deps.logWarn(`[${deps.pluginName}] Live account sync path switch failed due to transient filesystem locks; keeping previous watcher.`);
        }
    }
    return { sync, path: nextPath, cleanupRegistered };
}
//# sourceMappingURL=live-sync.js.map