import { ensureRuntimeRefreshGuardian } from "./refresh-guardian.js";
export async function ensureLiveAccountSyncState(params) {
    let liveAccountSync = params.currentSync;
    let liveAccountSyncPath = params.currentPath;
    if (!params.enabled) {
        if (liveAccountSync) {
            liveAccountSync.stop();
            liveAccountSync = null;
            liveAccountSyncPath = null;
        }
        return { liveAccountSync, liveAccountSyncPath };
    }
    if (!liveAccountSync) {
        liveAccountSync = params.createSync(params.authFallback);
        params.registerCleanup(() => {
            liveAccountSync?.stop();
        });
    }
    if (liveAccountSyncPath !== params.targetPath) {
        let switched = false;
        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                await liveAccountSync.syncToPath(params.targetPath);
                liveAccountSyncPath = params.targetPath;
                switched = true;
                break;
            }
            catch (error) {
                const code = error?.code;
                if (code !== "EBUSY" && code !== "EPERM") {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, 25 * 2 ** attempt));
            }
        }
        if (!switched) {
            params.logWarn(`[${params.pluginName}] Live account sync path switch failed due to transient filesystem locks; keeping previous watcher.`);
        }
    }
    return { liveAccountSync, liveAccountSyncPath };
}
export function ensureRefreshGuardianState(params) {
    const ensured = ensureRuntimeRefreshGuardian({
        pluginConfig: {
            enabled: params.enabled,
            intervalMs: params.intervalMs,
            bufferMs: params.bufferMs,
        },
        getProactiveRefreshGuardian: (config) => config.enabled,
        currentGuardian: params.currentGuardian,
        currentConfigKey: params.currentConfigKey,
        currentCleanupRegistered: params.currentCleanupRegistered ?? false,
        getCurrentGuardian: params.getCurrentGuardian ?? (() => params.currentGuardian),
        getProactiveRefreshIntervalMs: (config) => config.intervalMs,
        getProactiveRefreshBufferMs: (config) => config.bufferMs,
        createGuardian: params.createGuardian,
        registerCleanup: params.registerCleanup,
    });
    return {
        refreshGuardian: ensured.guardian,
        refreshGuardianConfigKey: ensured.configKey,
        refreshGuardianCleanupRegistered: ensured.cleanupRegistered,
    };
}
export function ensureSessionAffinityState(params) {
    if (!params.enabled) {
        return {
            sessionAffinityStore: null,
            sessionAffinityConfigKey: null,
        };
    }
    const configKey = `${params.ttlMs}:${params.maxEntries}`;
    if (params.currentStore && params.currentConfigKey === configKey) {
        return {
            sessionAffinityStore: params.currentStore,
            sessionAffinityConfigKey: params.currentConfigKey,
        };
    }
    return {
        sessionAffinityStore: params.createStore({
            ttlMs: params.ttlMs,
            maxEntries: params.maxEntries,
        }),
        sessionAffinityConfigKey: configKey,
    };
}
//# sourceMappingURL=runtime-services.js.map