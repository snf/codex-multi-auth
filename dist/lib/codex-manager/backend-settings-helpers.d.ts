import type { PluginConfig } from "../types.js";
import { type BackendNumberSettingOption, type BackendSettingFocusKey } from "./backend-settings-schema.js";
export declare function cloneBackendPluginConfig(config: PluginConfig): PluginConfig;
export declare function backendSettingsSnapshot(config: PluginConfig): Record<string, unknown>;
export declare function backendSettingsEqual(left: PluginConfig, right: PluginConfig): boolean;
export declare function formatBackendNumberValue(option: BackendNumberSettingOption, value: number): string;
export declare function clampBackendNumber(option: BackendNumberSettingOption, value: number): number;
export declare function buildBackendSettingsPreview(config: PluginConfig, ui: ReturnType<typeof import("../ui/runtime.js").getUiRuntimeOptions>, focus: BackendSettingFocusKey, deps: {
    highlightPreviewToken: (text: string, ui: ReturnType<typeof import("../ui/runtime.js").getUiRuntimeOptions>) => string;
}): {
    label: string;
    hint: string;
};
export declare function buildBackendConfigPatch(config: PluginConfig): Partial<PluginConfig>;
export declare function clampBackendNumberForTests(settingKey: string, value: number): number;
//# sourceMappingURL=backend-settings-helpers.d.ts.map