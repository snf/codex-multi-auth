import type { getUiRuntimeOptions } from "../ui/runtime.js";
import type { SelectOptions } from "../ui/select.js";
export type ExperimentalSettingsAction = {
    type: "sync";
} | {
    type: "backup";
} | {
    type: "toggle-refresh-guardian";
} | {
    type: "decrease-refresh-interval";
} | {
    type: "increase-refresh-interval";
} | {
    type: "apply";
} | {
    type: "save";
} | {
    type: "back";
};
export declare function getExperimentalSelectOptions(ui: ReturnType<typeof getUiRuntimeOptions>, help: string, onInput?: SelectOptions<ExperimentalSettingsAction>["onInput"]): SelectOptions<ExperimentalSettingsAction>;
export declare function mapExperimentalMenuHotkey(raw: string): ExperimentalSettingsAction | undefined;
export declare function mapExperimentalStatusHotkey(raw: string): ExperimentalSettingsAction | undefined;
//# sourceMappingURL=experimental-settings-schema.d.ts.map