import type { PluginConfig } from "../types.js";
import type { UiRuntimeOptions } from "../ui/runtime.js";
import type { MenuItem } from "../ui/select.js";
import type { BackendCategoryOption, BackendNumberSettingKey, BackendNumberSettingOption, BackendSettingFocusKey, BackendToggleSettingKey, BackendToggleSettingOption } from "./backend-settings-schema.js";
export declare function promptBackendCategorySettingsMenu(params: {
    initial: PluginConfig;
    category: BackendCategoryOption;
    initialFocus: BackendSettingFocusKey;
    ui: UiRuntimeOptions;
    cloneBackendPluginConfig: (config: PluginConfig) => PluginConfig;
    buildBackendSettingsPreview: (config: PluginConfig, ui: UiRuntimeOptions, focusKey: BackendSettingFocusKey, deps: {
        highlightPreviewToken: (text: string, ui: UiRuntimeOptions) => string;
    }) => {
        label: string;
        hint: string;
    };
    highlightPreviewToken: (text: string, ui: UiRuntimeOptions) => string;
    resolveFocusedBackendNumberKey: (focus: BackendSettingFocusKey, numberOptions: BackendNumberSettingOption[]) => BackendNumberSettingKey;
    clampBackendNumber: (option: BackendNumberSettingOption, value: number) => number;
    formatBackendNumberValue: (option: BackendNumberSettingOption, value: number) => string;
    formatDashboardSettingState: (enabled: boolean) => string;
    applyBackendCategoryDefaults: (config: PluginConfig, category: BackendCategoryOption) => PluginConfig;
    getBackendCategoryInitialFocus: (category: BackendCategoryOption) => BackendSettingFocusKey;
    backendDefaults: PluginConfig;
    toggleOptionByKey: ReadonlyMap<BackendToggleSettingKey, BackendToggleSettingOption>;
    numberOptionByKey: ReadonlyMap<BackendNumberSettingKey, BackendNumberSettingOption>;
    select: <T>(items: MenuItem<T>[], options: {
        message: string;
        subtitle: string;
        help: string;
        clearScreen: boolean;
        theme: UiRuntimeOptions["theme"];
        selectedEmphasis: "minimal";
        initialCursor?: number;
        onCursorChange: (event: {
            cursor: number;
        }) => void;
        onInput: (raw: string) => T | undefined;
    }) => Promise<T | null>;
    copy: {
        previewHeading: string;
        backendToggleHeading: string;
        backendNumberHeading: string;
        backendDecrease: string;
        backendIncrease: string;
        backendResetCategory: string;
        backendBackToCategories: string;
        backendCategoryTitle: string;
        backendCategoryHelp: string;
    };
}): Promise<{
    draft: PluginConfig;
    focusKey: BackendSettingFocusKey;
}>;
//# sourceMappingURL=backend-category-prompt.d.ts.map