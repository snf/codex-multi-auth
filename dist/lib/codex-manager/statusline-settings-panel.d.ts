import type { DashboardDisplaySettings, DashboardStatuslineField } from "../dashboard-settings.js";
import type { UI_COPY } from "../ui/copy.js";
import { getUiRuntimeOptions } from "../ui/runtime.js";
export type StatuslineConfigAction = {
    type: "toggle";
    key: DashboardStatuslineField;
} | {
    type: "move-up";
    key: DashboardStatuslineField;
} | {
    type: "move-down";
    key: DashboardStatuslineField;
} | {
    type: "reset";
} | {
    type: "save";
} | {
    type: "cancel";
};
export interface StatuslineFieldOption {
    key: DashboardStatuslineField;
    label: string;
    description: string;
}
export interface StatuslineSettingsPanelDeps {
    cloneDashboardSettings: (settings: DashboardDisplaySettings) => DashboardDisplaySettings;
    buildAccountListPreview: (settings: DashboardDisplaySettings, ui: ReturnType<typeof getUiRuntimeOptions>, focusKey: DashboardStatuslineField) => {
        label: string;
        hint?: string;
    };
    normalizeStatuslineFields: (fields: DashboardDisplaySettings["menuStatuslineFields"]) => DashboardStatuslineField[];
    formatDashboardSettingState: (enabled: boolean) => string;
    reorderField: (fields: DashboardStatuslineField[], key: DashboardStatuslineField, direction: -1 | 1) => DashboardStatuslineField[];
    applyDashboardDefaultsForKeys: (draft: DashboardDisplaySettings, keys: readonly (keyof DashboardDisplaySettings)[]) => DashboardDisplaySettings;
    STATUSLINE_FIELD_OPTIONS: readonly StatuslineFieldOption[];
    STATUSLINE_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
    UI_COPY: typeof UI_COPY;
}
export declare function promptStatuslineSettingsPanel(initial: DashboardDisplaySettings, deps: StatuslineSettingsPanelDeps): Promise<DashboardDisplaySettings | null>;
//# sourceMappingURL=statusline-settings-panel.d.ts.map