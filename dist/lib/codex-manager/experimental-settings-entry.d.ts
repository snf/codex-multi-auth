import type { PluginConfig } from "../types.js";
import type { ExperimentalSettingsPromptDeps } from "./experimental-settings-prompt.js";
export declare function promptExperimentalSettingsEntry<TTargetState>(params: {
    initialConfig: PluginConfig;
    promptExperimentalSettingsMenu: (args: ExperimentalSettingsPromptDeps<TTargetState>) => Promise<PluginConfig | null>;
} & ExperimentalSettingsPromptDeps<TTargetState>): Promise<PluginConfig | null>;
//# sourceMappingURL=experimental-settings-entry.d.ts.map