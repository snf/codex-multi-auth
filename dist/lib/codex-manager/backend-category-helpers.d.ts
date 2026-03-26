import type { PluginConfig } from "../types.js";
import type { BackendCategoryKey, BackendCategoryOption, BackendNumberSettingKey, BackendNumberSettingOption, BackendSettingFocusKey } from "./backend-settings-schema.js";
export declare function resolveFocusedBackendNumberKey(focus: BackendSettingFocusKey, numberOptions: BackendNumberSettingOption[]): BackendNumberSettingKey;
export declare function getBackendCategory(key: BackendCategoryKey, categoryOptions: readonly BackendCategoryOption[]): BackendCategoryOption | null;
export declare function getBackendCategoryInitialFocus(category: BackendCategoryOption): BackendSettingFocusKey;
export declare function applyBackendCategoryDefaults(draft: PluginConfig, category: BackendCategoryOption, deps: {
    backendDefaults: PluginConfig;
    numberOptionByKey: ReadonlyMap<BackendNumberSettingKey, BackendNumberSettingOption>;
}): PluginConfig;
//# sourceMappingURL=backend-category-helpers.d.ts.map