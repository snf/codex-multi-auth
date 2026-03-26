import { type DashboardDisplaySettings, type DashboardStatuslineField } from "../dashboard-settings.js";
import { detectOcChatgptMultiAuthTarget } from "../oc-chatgpt-target-detection.js";
import type { PluginConfig } from "../types.js";
import { getUiRuntimeOptions } from "../ui/runtime.js";
import { clampBackendNumberForTests } from "./backend-settings-helpers.js";
import { type DashboardDisplaySettingKey } from "./dashboard-display-panel.js";
import { formatMenuLayoutMode } from "./dashboard-formatters.js";
import { mapExperimentalMenuHotkey, mapExperimentalStatusHotkey } from "./experimental-settings-schema.js";
import { reorderStatuslineField } from "./settings-panels.js";
import { normalizeStatuslineFields } from "./settings-preview.js";
declare function cloneDashboardSettings(settings: DashboardDisplaySettings): DashboardDisplaySettings;
declare function buildSummaryPreviewText(settings: DashboardDisplaySettings, ui: ReturnType<typeof getUiRuntimeOptions>, focus?: DashboardDisplaySettingKey | DashboardStatuslineField | "menuSortMode" | "menuLayoutMode" | null): string;
declare function buildAccountListPreview(settings: DashboardDisplaySettings, ui: ReturnType<typeof getUiRuntimeOptions>, focus?: DashboardDisplaySettingKey | DashboardStatuslineField | "menuSortMode" | "menuLayoutMode" | null): {
    label: string;
    hint: string;
};
declare function applyUiThemeFromDashboardSettings(settings: DashboardDisplaySettings): void;
declare function resolveMenuLayoutMode(settings: DashboardDisplaySettings): "compact-details" | "expanded-rows";
declare function withQueuedRetryForTests<T>(pathKey: string, task: () => Promise<T>): Promise<T>;
declare function persistDashboardSettingsSelectionForTests(selected: DashboardDisplaySettings, keys: ReadonlyArray<keyof DashboardDisplaySettings>, scope: string): Promise<DashboardDisplaySettings>;
declare function persistBackendConfigSelectionForTests(selected: PluginConfig, scope: string): Promise<PluginConfig>;
declare const __testOnly: {
    clampBackendNumber: typeof clampBackendNumberForTests;
    formatMenuLayoutMode: typeof formatMenuLayoutMode;
    cloneDashboardSettings: typeof cloneDashboardSettings;
    withQueuedRetry: typeof withQueuedRetryForTests;
    loadExperimentalSyncTarget: typeof loadExperimentalSyncTarget;
    mapExperimentalMenuHotkey: typeof mapExperimentalMenuHotkey;
    mapExperimentalStatusHotkey: typeof mapExperimentalStatusHotkey;
    promptExperimentalSettings: typeof promptExperimentalSettings;
    persistDashboardSettingsSelection: typeof persistDashboardSettingsSelectionForTests;
    persistBackendConfigSelection: typeof persistBackendConfigSelectionForTests;
    buildAccountListPreview: typeof buildAccountListPreview;
    buildSummaryPreviewText: typeof buildSummaryPreviewText;
    normalizeStatuslineFields: typeof normalizeStatuslineFields;
    reorderField: typeof reorderStatuslineField;
    promptDashboardDisplaySettings: typeof promptDashboardDisplaySettings;
    promptStatuslineSettings: typeof promptStatuslineSettings;
    promptStartupSettings: typeof promptStartupSettings;
    promptBehaviorSettings: typeof promptBehaviorSettings;
    promptThemeSettings: typeof promptThemeSettings;
    promptBackendSettings: typeof promptBackendSettings;
};
declare function promptDashboardDisplaySettings(initial: DashboardDisplaySettings): Promise<DashboardDisplaySettings | null>;
declare function promptStatuslineSettings(initial: DashboardDisplaySettings): Promise<DashboardDisplaySettings | null>;
declare function promptStartupSettings(initial: DashboardDisplaySettings): Promise<DashboardDisplaySettings | null>;
declare function promptBehaviorSettings(initial: DashboardDisplaySettings): Promise<DashboardDisplaySettings | null>;
declare function promptThemeSettings(initial: DashboardDisplaySettings): Promise<DashboardDisplaySettings | null>;
declare function promptBackendSettings(initial: PluginConfig): Promise<PluginConfig | null>;
declare function loadExperimentalSyncTarget(): Promise<{
    kind: "blocked-ambiguous";
    detection: ReturnType<typeof detectOcChatgptMultiAuthTarget>;
} | {
    kind: "blocked-none";
    detection: ReturnType<typeof detectOcChatgptMultiAuthTarget>;
} | {
    kind: "error";
    message: string;
} | {
    kind: "target";
    detection: ReturnType<typeof detectOcChatgptMultiAuthTarget>;
    destination: import("../storage.js").AccountStorageV3 | null;
}>;
declare function promptExperimentalSettings(initialConfig: PluginConfig): Promise<PluginConfig | null>;
declare function configureUnifiedSettings(initialSettings?: DashboardDisplaySettings): Promise<DashboardDisplaySettings>;
export { configureUnifiedSettings, applyUiThemeFromDashboardSettings, resolveMenuLayoutMode, __testOnly, };
//# sourceMappingURL=settings-hub.d.ts.map