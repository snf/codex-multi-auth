export async function promptBackendCategorySettingsEntry(params) {
    return params.promptBackendCategorySettingsMenu({
        initial: params.initial,
        category: params.category,
        initialFocus: params.initialFocus,
        ui: params.ui,
        cloneBackendPluginConfig: params.cloneBackendPluginConfig,
        buildBackendSettingsPreview: params.buildBackendSettingsPreview,
        highlightPreviewToken: params.highlightPreviewToken,
        resolveFocusedBackendNumberKey: params.resolveFocusedBackendNumberKey,
        clampBackendNumber: params.clampBackendNumber,
        formatBackendNumberValue: params.formatBackendNumberValue,
        formatDashboardSettingState: params.formatDashboardSettingState,
        applyBackendCategoryDefaults: params.applyBackendCategoryDefaults,
        getBackendCategoryInitialFocus: params.getBackendCategoryInitialFocus,
        backendDefaults: params.backendDefaults,
        toggleOptionByKey: params.toggleOptionByKey,
        numberOptionByKey: params.numberOptionByKey,
        select: params.select,
        copy: params.copy,
    });
}
//# sourceMappingURL=backend-category-entry.js.map