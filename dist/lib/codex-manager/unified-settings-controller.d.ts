import type { DashboardDisplaySettings } from "../dashboard-settings.js";
import type { PluginConfig } from "../types.js";
export type SettingsHubActionType = "account-list" | "summary-fields" | "startup" | "behavior" | "theme" | "experimental" | "backend" | "back";
export type UnifiedSettingsControllerDeps = {
    cloneDashboardSettings: (settings: DashboardDisplaySettings) => DashboardDisplaySettings;
    cloneBackendPluginConfig: (config: PluginConfig) => PluginConfig;
    loadDashboardDisplaySettings: () => Promise<DashboardDisplaySettings>;
    loadPluginConfig: () => PluginConfig;
    applyUiThemeFromDashboardSettings: (settings: DashboardDisplaySettings) => void;
    promptSettingsHub: (focus: SettingsHubActionType) => Promise<{
        type: SettingsHubActionType;
    } | null>;
    configureDashboardDisplaySettings: (current: DashboardDisplaySettings) => Promise<DashboardDisplaySettings>;
    configureStatuslineSettings: (current: DashboardDisplaySettings) => Promise<DashboardDisplaySettings>;
    promptStartupSettings: (current: DashboardDisplaySettings) => Promise<DashboardDisplaySettings | null>;
    promptBehaviorSettings: (current: DashboardDisplaySettings) => Promise<DashboardDisplaySettings | null>;
    promptThemeSettings: (current: DashboardDisplaySettings) => Promise<DashboardDisplaySettings | null>;
    dashboardSettingsEqual: (left: DashboardDisplaySettings, right: DashboardDisplaySettings) => boolean;
    persistDashboardSettingsSelection: (selected: DashboardDisplaySettings, keys: readonly (keyof DashboardDisplaySettings)[], scope: string) => Promise<DashboardDisplaySettings>;
    promptExperimentalSettings: (config: PluginConfig) => Promise<PluginConfig | null>;
    backendSettingsEqual: (left: PluginConfig, right: PluginConfig) => boolean;
    persistBackendConfigSelection: (config: PluginConfig, scope: string) => Promise<PluginConfig>;
    configureBackendSettings: (config: PluginConfig) => Promise<PluginConfig>;
    STARTUP_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    BEHAVIOR_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    THEME_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
};
export declare function configureUnifiedSettingsController(initialSettings: DashboardDisplaySettings | undefined, deps: UnifiedSettingsControllerDeps): Promise<DashboardDisplaySettings>;
//# sourceMappingURL=unified-settings-controller.d.ts.map