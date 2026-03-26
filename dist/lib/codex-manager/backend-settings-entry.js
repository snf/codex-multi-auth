export async function configureBackendSettingsEntry(currentConfig, deps) {
    return deps.configureBackendSettingsController(currentConfig, {
        cloneBackendPluginConfig: deps.cloneBackendPluginConfig,
        loadPluginConfig: deps.loadPluginConfig,
        promptBackendSettings: deps.promptBackendSettings,
        backendSettingsEqual: deps.backendSettingsEqual,
        persistBackendConfigSelection: deps.persistBackendConfigSelection,
        isInteractive: deps.isInteractive,
        writeLine: deps.writeLine,
    });
}
//# sourceMappingURL=backend-settings-entry.js.map