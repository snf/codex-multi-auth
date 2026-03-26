import { type DashboardDisplaySettings, type DashboardStatuslineField } from "../dashboard-settings.js";
import type { BehaviorSettingsPanelDeps } from "./behavior-settings-panel.js";
import type { DashboardDisplayPanelDeps } from "./dashboard-display-panel.js";
import type { StartupSettingsPanelDeps } from "./startup-settings-panel.js";
import type { StatuslineSettingsPanelDeps } from "./statusline-settings-panel.js";
import type { ThemeSettingsPanelDeps } from "./theme-settings-panel.js";
export declare function promptDashboardDisplaySettingsPanelEntry(params: {
    initial: DashboardDisplaySettings;
    promptDashboardDisplayPanel: (initial: DashboardDisplaySettings, deps: DashboardDisplayPanelDeps) => Promise<DashboardDisplaySettings | null>;
    cloneDashboardSettings: DashboardDisplayPanelDeps["cloneDashboardSettings"];
    buildAccountListPreview: DashboardDisplayPanelDeps["buildAccountListPreview"];
    formatDashboardSettingState: DashboardDisplayPanelDeps["formatDashboardSettingState"];
    formatMenuSortMode: DashboardDisplayPanelDeps["formatMenuSortMode"];
    resolveMenuLayoutMode: (settings?: DashboardDisplaySettings) => NonNullable<DashboardDisplaySettings["menuLayoutMode"]>;
    formatMenuLayoutMode: DashboardDisplayPanelDeps["formatMenuLayoutMode"];
    applyDashboardDefaultsForKeys: DashboardDisplayPanelDeps["applyDashboardDefaultsForKeys"];
    DASHBOARD_DISPLAY_OPTIONS: DashboardDisplayPanelDeps["DASHBOARD_DISPLAY_OPTIONS"];
    ACCOUNT_LIST_PANEL_KEYS: DashboardDisplayPanelDeps["ACCOUNT_LIST_PANEL_KEYS"];
    UI_COPY: DashboardDisplayPanelDeps["UI_COPY"];
}): Promise<DashboardDisplaySettings | null>;
export declare function reorderStatuslineField(fields: DashboardStatuslineField[], key: DashboardStatuslineField, direction: -1 | 1): DashboardStatuslineField[];
export declare function promptStatuslineSettingsPanelEntry(params: {
    initial: DashboardDisplaySettings;
    promptStatuslineSettingsPanel: (initial: DashboardDisplaySettings, deps: StatuslineSettingsPanelDeps) => Promise<DashboardDisplaySettings | null>;
    cloneDashboardSettings: StatuslineSettingsPanelDeps["cloneDashboardSettings"];
    buildAccountListPreview: StatuslineSettingsPanelDeps["buildAccountListPreview"];
    normalizeStatuslineFields: StatuslineSettingsPanelDeps["normalizeStatuslineFields"];
    formatDashboardSettingState: StatuslineSettingsPanelDeps["formatDashboardSettingState"];
    applyDashboardDefaultsForKeys: StatuslineSettingsPanelDeps["applyDashboardDefaultsForKeys"];
    STATUSLINE_FIELD_OPTIONS: StatuslineSettingsPanelDeps["STATUSLINE_FIELD_OPTIONS"];
    STATUSLINE_PANEL_KEYS: StatuslineSettingsPanelDeps["STATUSLINE_PANEL_KEYS"];
    UI_COPY: StatuslineSettingsPanelDeps["UI_COPY"];
}): Promise<DashboardDisplaySettings | null>;
export declare function formatAutoReturnDelayLabel(delayMs: number): string;
export declare function promptBehaviorSettingsPanelEntry(params: {
    initial: DashboardDisplaySettings;
    promptBehaviorSettingsPanel: (initial: DashboardDisplaySettings, deps: BehaviorSettingsPanelDeps) => Promise<DashboardDisplaySettings | null>;
    cloneDashboardSettings: BehaviorSettingsPanelDeps["cloneDashboardSettings"];
    applyDashboardDefaultsForKeys: BehaviorSettingsPanelDeps["applyDashboardDefaultsForKeys"];
    formatMenuQuotaTtl: BehaviorSettingsPanelDeps["formatMenuQuotaTtl"];
    AUTO_RETURN_OPTIONS_MS: BehaviorSettingsPanelDeps["AUTO_RETURN_OPTIONS_MS"];
    MENU_QUOTA_TTL_OPTIONS_MS: BehaviorSettingsPanelDeps["MENU_QUOTA_TTL_OPTIONS_MS"];
    BEHAVIOR_PANEL_KEYS: BehaviorSettingsPanelDeps["BEHAVIOR_PANEL_KEYS"];
    UI_COPY: BehaviorSettingsPanelDeps["UI_COPY"];
}): Promise<DashboardDisplaySettings | null>;
export declare function promptStartupSettingsPanelEntry(params: {
    initial: DashboardDisplaySettings;
    promptStartupSettingsPanel: (initial: DashboardDisplaySettings, deps: StartupSettingsPanelDeps) => Promise<DashboardDisplaySettings | null>;
    cloneDashboardSettings: StartupSettingsPanelDeps["cloneDashboardSettings"];
    applyDashboardDefaultsForKeys: StartupSettingsPanelDeps["applyDashboardDefaultsForKeys"];
    STARTUP_PANEL_KEYS: StartupSettingsPanelDeps["STARTUP_PANEL_KEYS"];
    UI_COPY: StartupSettingsPanelDeps["UI_COPY"];
}): Promise<DashboardDisplaySettings | null>;
export declare function promptThemeSettingsPanelEntry(params: {
    initial: DashboardDisplaySettings;
    promptThemeSettingsPanel: (initial: DashboardDisplaySettings, deps: ThemeSettingsPanelDeps) => Promise<DashboardDisplaySettings | null>;
    cloneDashboardSettings: ThemeSettingsPanelDeps["cloneDashboardSettings"];
    applyDashboardDefaultsForKeys: ThemeSettingsPanelDeps["applyDashboardDefaultsForKeys"];
    applyUiThemeFromDashboardSettings: ThemeSettingsPanelDeps["applyUiThemeFromDashboardSettings"];
    THEME_PRESET_OPTIONS: ThemeSettingsPanelDeps["THEME_PRESET_OPTIONS"];
    ACCENT_COLOR_OPTIONS: ThemeSettingsPanelDeps["ACCENT_COLOR_OPTIONS"];
    THEME_PANEL_KEYS: ThemeSettingsPanelDeps["THEME_PANEL_KEYS"];
    UI_COPY: ThemeSettingsPanelDeps["UI_COPY"];
}): Promise<DashboardDisplaySettings | null>;
//# sourceMappingURL=settings-panels.d.ts.map