import { SessionAffinityStore } from "../session-affinity.js";
export declare function ensureRuntimeSessionAffinity<TConfig>(deps: {
    pluginConfig: TConfig;
    getSessionAffinity: (config: TConfig) => boolean;
    currentStore: SessionAffinityStore | null;
    currentConfigKey: string | null;
    getSessionAffinityTtlMs: (config: TConfig) => number;
    getSessionAffinityMaxEntries: (config: TConfig) => number;
}): {
    store: SessionAffinityStore | null;
    configKey: string | null;
};
//# sourceMappingURL=session-affinity.d.ts.map