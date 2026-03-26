import type { PluginConfig } from "../types.js";
import type { UiRuntimeOptions } from "../ui/runtime.js";
import type { MenuItem } from "../ui/select.js";
import type { BackendCategoryKey, BackendCategoryOption, BackendSettingFocusKey } from "./backend-settings-schema.js";
export declare function promptBackendSettingsMenu(params: {
    initial: PluginConfig;
    isInteractive: () => boolean;
    ui: UiRuntimeOptions;
    cloneBackendPluginConfig: (config: PluginConfig) => PluginConfig;
    backendCategoryOptions: readonly BackendCategoryOption[];
    getBackendCategoryInitialFocus: (category: BackendCategoryOption) => BackendSettingFocusKey;
    buildBackendSettingsPreview: (config: PluginConfig, ui: UiRuntimeOptions, focus: BackendSettingFocusKey, deps: {
        highlightPreviewToken: (text: string, ui: UiRuntimeOptions) => string;
    }) => {
        label: string;
        hint: string;
    };
    highlightPreviewToken: (text: string, ui: UiRuntimeOptions) => string;
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
    getBackendCategory: (key: BackendCategoryKey, categories: readonly BackendCategoryOption[]) => BackendCategoryOption | null;
    promptBackendCategorySettings: (initial: PluginConfig, category: BackendCategoryOption, focus: BackendSettingFocusKey) => Promise<{
        draft: PluginConfig;
        focusKey: BackendSettingFocusKey;
    }>;
    backendDefaults: PluginConfig;
    copy: {
        previewHeading: string;
        backendCategoriesHeading: string;
        resetDefault: string;
        saveAndBack: string;
        backNoSave: string;
        backendTitle: string;
        backendSubtitle: string;
        backendHelp: string;
    };
}): Promise<PluginConfig | null>;
//# sourceMappingURL=backend-settings-prompt.d.ts.map