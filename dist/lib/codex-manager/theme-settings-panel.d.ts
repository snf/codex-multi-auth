import type { DashboardAccentColor, DashboardDisplaySettings, DashboardThemePreset } from "../dashboard-settings.js";
import type { UI_COPY } from "../ui/copy.js";
export type ThemeConfigAction = {
    type: "set-palette";
    palette: DashboardThemePreset;
} | {
    type: "set-accent";
    accent: DashboardAccentColor;
} | {
    type: "reset";
} | {
    type: "save";
} | {
    type: "cancel";
};
export interface ThemeSettingsPanelDeps {
    cloneDashboardSettings: (settings: DashboardDisplaySettings) => DashboardDisplaySettings;
    applyDashboardDefaultsForKeys: (draft: DashboardDisplaySettings, keys: readonly (keyof DashboardDisplaySettings)[]) => DashboardDisplaySettings;
    applyUiThemeFromDashboardSettings: (settings: DashboardDisplaySettings) => void;
    THEME_PRESET_OPTIONS: readonly DashboardThemePreset[];
    ACCENT_COLOR_OPTIONS: readonly DashboardAccentColor[];
    THEME_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    UI_COPY: typeof UI_COPY;
}
export declare function promptThemeSettingsPanel(initial: DashboardDisplaySettings, deps: ThemeSettingsPanelDeps): Promise<DashboardDisplaySettings | null>;
//# sourceMappingURL=theme-settings-panel.d.ts.map