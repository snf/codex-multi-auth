export async function configureBackendSettingsController(currentConfig, deps) {
    const current = deps.cloneBackendPluginConfig(currentConfig ?? deps.loadPluginConfig());
    if (!deps.isInteractive()) {
        deps.writeLine("Settings require interactive mode.");
        return current;
    }
    const selected = await deps.promptBackendSettings(current);
    if (!selected)
        return current;
    if (deps.backendSettingsEqual(current, selected))
        return current;
    return deps.persistBackendConfigSelection(selected, "backend");
}
//# sourceMappingURL=backend-settings-controller.js.map