export async function configureDashboardSettingsEntry(currentSettings, deps) {
    return deps.configureDashboardSettingsController(currentSettings, {
        loadDashboardDisplaySettings: deps.loadDashboardDisplaySettings,
        promptSettings: deps.promptSettings,
        settingsEqual: deps.settingsEqual,
        persistSelection: deps.persistSelection,
        applyUiThemeFromDashboardSettings: deps.applyUiThemeFromDashboardSettings,
        isInteractive: deps.isInteractive,
        getDashboardSettingsPath: deps.getDashboardSettingsPath,
        writeLine: deps.writeLine,
    });
}
//# sourceMappingURL=dashboard-settings-entry.js.map