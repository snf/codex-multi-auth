import type { DashboardDisplaySettings } from "../dashboard-settings.js";
import type { UI_COPY } from "../ui/copy.js";
export type BehaviorConfigAction = {
    type: "set-delay";
    delayMs: number;
} | {
    type: "toggle-pause";
} | {
    type: "toggle-auto-pick-best-account-on-launch";
} | {
    type: "toggle-menu-limit-fetch";
} | {
    type: "toggle-menu-fetch-status";
} | {
    type: "set-menu-quota-ttl";
    ttlMs: number;
} | {
    type: "reset";
} | {
    type: "save";
} | {
    type: "cancel";
};
export interface BehaviorSettingsPanelDeps {
    cloneDashboardSettings: (settings: DashboardDisplaySettings) => DashboardDisplaySettings;
    applyDashboardDefaultsForKeys: (draft: DashboardDisplaySettings, keys: readonly (keyof DashboardDisplaySettings)[]) => DashboardDisplaySettings;
    formatDelayLabel: (delayMs: number) => string;
    formatMenuQuotaTtl: (ttlMs: number) => string;
    AUTO_RETURN_OPTIONS_MS: readonly number[];
    MENU_QUOTA_TTL_OPTIONS_MS: readonly number[];
    BEHAVIOR_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    UI_COPY: typeof UI_COPY;
}
export declare function promptBehaviorSettingsPanel(initial: DashboardDisplaySettings, deps: BehaviorSettingsPanelDeps): Promise<DashboardDisplaySettings | null>;
//# sourceMappingURL=behavior-settings-panel.d.ts.map