import type { UiRuntimeOptions } from "../ui/runtime.js";
export declare function resolveUiRuntimeEntry(params: {
    loadPluginConfig: () => ReturnType<typeof import("../config.js").loadPluginConfig>;
    resolveUiRuntimeFromConfig: (loadPluginConfig: () => ReturnType<typeof import("../config.js").loadPluginConfig>, applyUiRuntimeFromConfig: (pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>) => UiRuntimeOptions) => UiRuntimeOptions;
    applyUiRuntimeFromConfig: (pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>) => UiRuntimeOptions;
}): UiRuntimeOptions;
//# sourceMappingURL=ui-runtime-entry.d.ts.map