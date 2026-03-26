export async function configureUnifiedSettingsEntry(initialSettings, deps) {
    return deps.configureUnifiedSettingsController(initialSettings, {
        cloneDashboardSettings: deps.cloneDashboardSettings,
        cloneBackendPluginConfig: deps.cloneBackendPluginConfig,
        loadDashboardDisplaySettings: deps.loadDashboardDisplaySettings,
        loadPluginConfig: deps.loadPluginConfig,
        applyUiThemeFromDashboardSettings: deps.applyUiThemeFromDashboardSettings,
        promptSettingsHub: deps.promptSettingsHub,
        configureDashboardDisplaySettings: deps.configureDashboardDisplaySettings,
        configureStatuslineSettings: deps.configureStatuslineSettings,
        promptStartupSettings: deps.promptStartupSettings,
        promptBehaviorSettings: deps.promptBehaviorSettings,
        promptThemeSettings: deps.promptThemeSettings,
        dashboardSettingsEqual: deps.dashboardSettingsEqual,
        persistDashboardSettingsSelection: deps.persistDashboardSettingsSelection,
        promptExperimentalSettings: deps.promptExperimentalSettings,
        backendSettingsEqual: deps.backendSettingsEqual,
        persistBackendConfigSelection: deps.persistBackendConfigSelection,
        configureBackendSettings: deps.configureBackendSettings,
        STARTUP_PANEL_KEYS: deps.STARTUP_PANEL_KEYS,
        BEHAVIOR_PANEL_KEYS: deps.BEHAVIOR_PANEL_KEYS,
        THEME_PANEL_KEYS: deps.THEME_PANEL_KEYS,
    });
}
//# sourceMappingURL=unified-settings-entry.js.map