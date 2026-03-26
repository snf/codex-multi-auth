import type { ApplyOcChatgptSyncOptions, OcChatgptSyncApplyResult, OcChatgptSyncPlanResult, PlanOcChatgptSyncOptions } from "../oc-chatgpt-orchestrator.js";
import type { AccountStorageV3 } from "../storage.js";
import type { PluginConfig } from "../types.js";
import type { MenuItem, select } from "../ui/select.js";
import type { UiRuntimeOptions } from "../ui/runtime.js";
import type { getExperimentalSelectOptions, mapExperimentalMenuHotkey, mapExperimentalStatusHotkey } from "./experimental-settings-schema.js";
export type ExperimentalSettingsCopy = {
    experimentalSync: string;
    experimentalBackup: string;
    experimentalRefreshGuard: string;
    experimentalRefreshInterval: string;
    experimentalDecreaseInterval: string;
    experimentalIncreaseInterval: string;
    saveAndBack: string;
    backNoSave: string;
    experimentalHelpMenu: string;
    experimentalBackupPrompt: string;
    back: string;
    experimentalHelpStatus: string;
    experimentalApplySync: string;
    experimentalHelpPreview: string;
};
export type ExperimentalSettingsPromptDeps<TTargetState> = {
    initialConfig: PluginConfig;
    isInteractive: () => boolean;
    ui: UiRuntimeOptions;
    cloneBackendPluginConfig: (config: PluginConfig) => PluginConfig;
    select: typeof select;
    getExperimentalSelectOptions: typeof getExperimentalSelectOptions;
    mapExperimentalMenuHotkey: typeof mapExperimentalMenuHotkey;
    mapExperimentalStatusHotkey: typeof mapExperimentalStatusHotkey;
    formatDashboardSettingState: (enabled: boolean) => string;
    copy: ExperimentalSettingsCopy;
    input: NodeJS.ReadStream;
    output: NodeJS.WriteStream;
    runNamedBackupExport: (args: {
        name: string;
    }) => Promise<{
        kind: string;
        path?: string;
        error?: unknown;
    }>;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    loadExperimentalSyncTarget: () => Promise<TTargetState>;
    planOcChatgptSync: (args: PlanOcChatgptSyncOptions) => Promise<OcChatgptSyncPlanResult>;
    applyOcChatgptSync: (args: ApplyOcChatgptSyncOptions) => Promise<OcChatgptSyncApplyResult>;
    getTargetKind: (targetState: TTargetState) => string;
    getTargetDestination: (targetState: TTargetState) => AccountStorageV3 | null;
    getTargetDetection: (targetState: TTargetState) => ReturnType<typeof import("../oc-chatgpt-target-detection.js").detectOcChatgptMultiAuthTarget>;
    getTargetErrorMessage: (targetState: TTargetState) => string | null;
    getPlanKind: (plan: OcChatgptSyncPlanResult) => string;
    getPlanBlockedReason: (plan: OcChatgptSyncPlanResult) => string;
    getPlanPreview: (plan: OcChatgptSyncPlanResult) => {
        toAdd: unknown[];
        toUpdate: unknown[];
        toSkip: unknown[];
        unchangedDestinationOnly: unknown[];
        activeSelectionBehavior: string;
    };
    getAppliedLabel: (applied: OcChatgptSyncApplyResult) => {
        label: string;
        color: MenuItem["color"];
    };
};
export declare function promptExperimentalSettingsMenu<TTargetState>(params: ExperimentalSettingsPromptDeps<TTargetState>): Promise<PluginConfig | null>;
//# sourceMappingURL=experimental-settings-prompt.d.ts.map