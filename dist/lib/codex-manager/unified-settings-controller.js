export async function configureUnifiedSettingsController(initialSettings, deps) {
    let current = deps.cloneDashboardSettings(initialSettings ?? (await deps.loadDashboardDisplaySettings()));
    let backendConfig = deps.cloneBackendPluginConfig(deps.loadPluginConfig());
    deps.applyUiThemeFromDashboardSettings(current);
    let hubFocus = "account-list";
    while (true) {
        const action = await deps.promptSettingsHub(hubFocus);
        if (!action || action.type === "back") {
            return current;
        }
        hubFocus = action.type;
        if (action.type === "account-list") {
            current = await deps.configureDashboardDisplaySettings(current);
            continue;
        }
        if (action.type === "summary-fields") {
            current = await deps.configureStatuslineSettings(current);
            continue;
        }
        if (action.type === "startup") {
            const selected = await deps.promptStartupSettings(current);
            if (selected && !deps.dashboardSettingsEqual(current, selected)) {
                current = await deps.persistDashboardSettingsSelection(selected, deps.STARTUP_PANEL_KEYS, "startup");
            }
            continue;
        }
        if (action.type === "behavior") {
            const selected = await deps.promptBehaviorSettings(current);
            if (selected && !deps.dashboardSettingsEqual(current, selected)) {
                current = await deps.persistDashboardSettingsSelection(selected, deps.BEHAVIOR_PANEL_KEYS, "behavior");
            }
            continue;
        }
        if (action.type === "theme") {
            const selected = await deps.promptThemeSettings(current);
            if (selected && !deps.dashboardSettingsEqual(current, selected)) {
                current = await deps.persistDashboardSettingsSelection(selected, deps.THEME_PANEL_KEYS, "theme");
                deps.applyUiThemeFromDashboardSettings(current);
            }
            continue;
        }
        if (action.type === "experimental") {
            const selected = await deps.promptExperimentalSettings(backendConfig);
            if (selected && !deps.backendSettingsEqual(backendConfig, selected)) {
                backendConfig = await deps.persistBackendConfigSelection(selected, "experimental");
            }
            else if (selected) {
                backendConfig = selected;
            }
            continue;
        }
        if (action.type === "backend") {
            backendConfig = await deps.configureBackendSettings(backendConfig);
        }
    }
}
//# sourceMappingURL=unified-settings-controller.js.map