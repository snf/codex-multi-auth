import type { PluginConfig } from "../types.js";
export declare function configureBackendSettingsController(currentConfig: PluginConfig | undefined, deps: {
    cloneBackendPluginConfig: (config: PluginConfig) => PluginConfig;
    loadPluginConfig: () => PluginConfig;
    promptBackendSettings: (config: PluginConfig) => Promise<PluginConfig | null>;
    backendSettingsEqual: (left: PluginConfig, right: PluginConfig) => boolean;
    persistBackendConfigSelection: (config: PluginConfig, scope: string) => Promise<PluginConfig>;
    isInteractive: () => boolean;
    writeLine: (message: string) => void;
}): Promise<PluginConfig>;
//# sourceMappingURL=backend-settings-controller.d.ts.map