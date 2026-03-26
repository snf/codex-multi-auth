import type { DashboardDisplaySettings } from "../dashboard-settings.js";
export declare function configureDashboardSettingsEntry(currentSettings: DashboardDisplaySettings | undefined, deps: {
    configureDashboardSettingsController: (currentSettings: DashboardDisplaySettings | undefined, deps: {
        loadDashboardDisplaySettings: () => Promise<DashboardDisplaySettings>;
        promptSettings: (settings: DashboardDisplaySettings) => Promise<DashboardDisplaySettings | null>;
        settingsEqual: (left: DashboardDisplaySettings, right: DashboardDisplaySettings) => boolean;
        persistSelection: (selected: DashboardDisplaySettings) => Promise<DashboardDisplaySettings>;
        applyUiThemeFromDashboardSettings: (settings: DashboardDisplaySettings) => void;
        isInteractive: () => boolean;
        getDashboardSettingsPath: () => string;
        writeLine: (message: string) => void;
    }) => Promise<DashboardDisplaySettings>;
    loadDashboardDisplaySettings: () => Promise<DashboardDisplaySettings>;
    promptSettings: (settings: DashboardDisplaySettings) => Promise<DashboardDisplaySettings | null>;
    settingsEqual: (left: DashboardDisplaySettings, right: DashboardDisplaySettings) => boolean;
    persistSelection: (selected: DashboardDisplaySettings) => Promise<DashboardDisplaySettings>;
    applyUiThemeFromDashboardSettings: (settings: DashboardDisplaySettings) => void;
    isInteractive: () => boolean;
    getDashboardSettingsPath: () => string;
    writeLine: (message: string) => void;
}): Promise<DashboardDisplaySettings>;
//# sourceMappingURL=dashboard-settings-entry.d.ts.map