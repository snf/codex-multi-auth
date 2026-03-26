import type { DashboardDisplaySettings } from "../dashboard-settings.js";
import type { UI_COPY } from "../ui/copy.js";
export type StartupConfigAction = {
    type: "toggle-auto-pick-best-account-on-launch";
} | {
    type: "reset";
} | {
    type: "save";
} | {
    type: "cancel";
};
export interface StartupSettingsPanelDeps {
    cloneDashboardSettings: (settings: DashboardDisplaySettings) => DashboardDisplaySettings;
    applyDashboardDefaultsForKeys: (draft: DashboardDisplaySettings, keys: readonly (keyof DashboardDisplaySettings)[]) => DashboardDisplaySettings;
    STARTUP_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    UI_COPY: typeof UI_COPY;
}
export declare function promptStartupSettingsPanel(initial: DashboardDisplaySettings, deps: StartupSettingsPanelDeps): Promise<DashboardDisplaySettings | null>;
//# sourceMappingURL=startup-settings-panel.d.ts.map