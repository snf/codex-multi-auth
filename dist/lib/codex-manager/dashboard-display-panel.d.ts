import { type DashboardAccountSortMode, type DashboardDisplaySettings } from "../dashboard-settings.js";
import type { UI_COPY } from "../ui/copy.js";
import { getUiRuntimeOptions } from "../ui/runtime.js";
export type DashboardDisplaySettingKey = "menuShowStatusBadge" | "menuShowCurrentBadge" | "menuShowLastUsed" | "menuShowQuotaSummary" | "menuShowQuotaCooldown" | "menuShowDetailsForUnselectedRows" | "menuShowFetchStatus" | "menuHighlightCurrentRow" | "menuSortEnabled" | "menuSortPinCurrent" | "menuSortQuickSwitchVisibleRow";
export interface DashboardDisplaySettingOption {
    key: DashboardDisplaySettingKey;
    label: string;
    description: string;
}
export type DashboardConfigAction = {
    type: "toggle";
    key: DashboardDisplaySettingKey;
} | {
    type: "cycle-sort-mode";
} | {
    type: "cycle-layout-mode";
} | {
    type: "reset";
} | {
    type: "save";
} | {
    type: "cancel";
};
export interface DashboardDisplayPanelDeps {
    cloneDashboardSettings: (settings: DashboardDisplaySettings) => DashboardDisplaySettings;
    buildAccountListPreview: (settings: DashboardDisplaySettings, ui: ReturnType<typeof getUiRuntimeOptions>, focusKey: DashboardDisplaySettingKey | "menuSortMode" | "menuLayoutMode") => {
        label: string;
        hint?: string;
    };
    formatDashboardSettingState: (enabled: boolean) => string;
    formatMenuSortMode: (mode: DashboardAccountSortMode) => string;
    resolveMenuLayoutMode: (settings: DashboardDisplaySettings) => "compact-details" | "expanded-rows";
    formatMenuLayoutMode: (mode: "compact-details" | "expanded-rows") => string;
    applyDashboardDefaultsForKeys: (draft: DashboardDisplaySettings, keys: readonly (keyof DashboardDisplaySettings)[]) => DashboardDisplaySettings;
    DASHBOARD_DISPLAY_OPTIONS: readonly DashboardDisplaySettingOption[];
    ACCOUNT_LIST_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    UI_COPY: typeof UI_COPY;
}
export declare function promptDashboardDisplayPanel(initial: DashboardDisplaySettings, deps: DashboardDisplayPanelDeps): Promise<DashboardDisplaySettings | null>;
//# sourceMappingURL=dashboard-display-panel.d.ts.map