import { DEFAULT_DASHBOARD_DISPLAY_SETTINGS, } from "../dashboard-settings.js";
export async function promptDashboardDisplaySettingsPanelEntry(params) {
    return params.promptDashboardDisplayPanel(params.initial, {
        cloneDashboardSettings: params.cloneDashboardSettings,
        buildAccountListPreview: params.buildAccountListPreview,
        formatDashboardSettingState: params.formatDashboardSettingState,
        formatMenuSortMode: params.formatMenuSortMode,
        resolveMenuLayoutMode: (settings) => params.resolveMenuLayoutMode(settings ?? DEFAULT_DASHBOARD_DISPLAY_SETTINGS) ?? "compact-details",
        formatMenuLayoutMode: params.formatMenuLayoutMode,
        applyDashboardDefaultsForKeys: params.applyDashboardDefaultsForKeys,
        DASHBOARD_DISPLAY_OPTIONS: params.DASHBOARD_DISPLAY_OPTIONS,
        ACCOUNT_LIST_PANEL_KEYS: params.ACCOUNT_LIST_PANEL_KEYS,
        UI_COPY: params.UI_COPY,
    });
}
export function reorderStatuslineField(fields, key, direction) {
    const index = fields.indexOf(key);
    if (index < 0)
        return fields;
    const target = index + direction;
    if (target < 0 || target >= fields.length)
        return fields;
    const next = [...fields];
    const current = next[index];
    const swap = next[target];
    if (!current || !swap)
        return fields;
    next[index] = swap;
    next[target] = current;
    return next;
}
export async function promptStatuslineSettingsPanelEntry(params) {
    return params.promptStatuslineSettingsPanel(params.initial, {
        cloneDashboardSettings: params.cloneDashboardSettings,
        buildAccountListPreview: params.buildAccountListPreview,
        normalizeStatuslineFields: params.normalizeStatuslineFields,
        formatDashboardSettingState: params.formatDashboardSettingState,
        reorderField: reorderStatuslineField,
        applyDashboardDefaultsForKeys: params.applyDashboardDefaultsForKeys,
        STATUSLINE_FIELD_OPTIONS: params.STATUSLINE_FIELD_OPTIONS,
        STATUSLINE_PANEL_KEYS: params.STATUSLINE_PANEL_KEYS,
        UI_COPY: params.UI_COPY,
    });
}
export function formatAutoReturnDelayLabel(delayMs) {
    return delayMs <= 0
        ? "Instant return"
        : `${Math.round(delayMs / 1000)}s auto-return`;
}
export async function promptBehaviorSettingsPanelEntry(params) {
    return params.promptBehaviorSettingsPanel(params.initial, {
        cloneDashboardSettings: params.cloneDashboardSettings,
        applyDashboardDefaultsForKeys: params.applyDashboardDefaultsForKeys,
        formatDelayLabel: formatAutoReturnDelayLabel,
        formatMenuQuotaTtl: params.formatMenuQuotaTtl,
        AUTO_RETURN_OPTIONS_MS: params.AUTO_RETURN_OPTIONS_MS,
        MENU_QUOTA_TTL_OPTIONS_MS: params.MENU_QUOTA_TTL_OPTIONS_MS,
        BEHAVIOR_PANEL_KEYS: params.BEHAVIOR_PANEL_KEYS,
        UI_COPY: params.UI_COPY,
    });
}
export async function promptThemeSettingsPanelEntry(params) {
    return params.promptThemeSettingsPanel(params.initial, {
        cloneDashboardSettings: params.cloneDashboardSettings,
        applyDashboardDefaultsForKeys: params.applyDashboardDefaultsForKeys,
        applyUiThemeFromDashboardSettings: params.applyUiThemeFromDashboardSettings,
        THEME_PRESET_OPTIONS: params.THEME_PRESET_OPTIONS,
        ACCENT_COLOR_OPTIONS: params.ACCENT_COLOR_OPTIONS,
        THEME_PANEL_KEYS: params.THEME_PANEL_KEYS,
        UI_COPY: params.UI_COPY,
    });
}
//# sourceMappingURL=settings-panels.js.map