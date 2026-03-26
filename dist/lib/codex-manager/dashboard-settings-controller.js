export async function configureDashboardSettingsController(currentSettings, deps) {
    const current = currentSettings ?? (await deps.loadDashboardDisplaySettings());
    if (!deps.isInteractive()) {
        deps.writeLine("Settings require interactive mode.");
        deps.writeLine(`Settings file: ${deps.getDashboardSettingsPath()}`);
        return current;
    }
    const selected = await deps.promptSettings(current);
    if (!selected)
        return current;
    if (deps.settingsEqual(current, selected))
        return current;
    const merged = await deps.persistSelection(selected);
    deps.applyUiThemeFromDashboardSettings(merged);
    return merged;
}
//# sourceMappingURL=dashboard-settings-controller.js.map