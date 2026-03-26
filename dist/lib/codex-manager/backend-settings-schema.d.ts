import type { PluginConfig } from "../types.js";
export type BackendToggleSettingKey = "liveAccountSync" | "sessionAffinity" | "proactiveRefreshGuardian" | "retryAllAccountsRateLimited" | "parallelProbing" | "storageBackupEnabled" | "preemptiveQuotaEnabled" | "fastSession" | "sessionRecovery" | "autoResume" | "perProjectAccounts";
export type BackendNumberSettingKey = "liveAccountSyncDebounceMs" | "liveAccountSyncPollMs" | "sessionAffinityTtlMs" | "sessionAffinityMaxEntries" | "proactiveRefreshIntervalMs" | "proactiveRefreshBufferMs" | "parallelProbingMaxConcurrency" | "fastSessionMaxInputItems" | "networkErrorCooldownMs" | "serverErrorCooldownMs" | "fetchTimeoutMs" | "streamStallTimeoutMs" | "tokenRefreshSkewMs" | "preemptiveQuotaRemainingPercent5h" | "preemptiveQuotaRemainingPercent7d" | "preemptiveQuotaMaxDeferralMs";
export type BackendSettingFocusKey = BackendToggleSettingKey | BackendNumberSettingKey | null;
export interface BackendToggleSettingOption {
    key: BackendToggleSettingKey;
    label: string;
    description: string;
}
export interface BackendNumberSettingOption {
    key: BackendNumberSettingKey;
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    unit: "ms" | "percent" | "count";
}
export type BackendCategoryKey = "session-sync" | "rotation-quota" | "refresh-recovery" | "performance-timeouts";
export interface BackendCategoryOption {
    key: BackendCategoryKey;
    label: string;
    description: string;
    toggleKeys: BackendToggleSettingKey[];
    numberKeys: BackendNumberSettingKey[];
}
export type BackendCategoryConfigAction = {
    type: "toggle";
    key: BackendToggleSettingKey;
} | {
    type: "bump";
    key: BackendNumberSettingKey;
    direction: -1 | 1;
} | {
    type: "reset-category";
} | {
    type: "back";
};
export type BackendSettingsHubAction = {
    type: "open-category";
    key: BackendCategoryKey;
} | {
    type: "reset";
} | {
    type: "save";
} | {
    type: "cancel";
};
export declare const BACKEND_TOGGLE_OPTIONS: BackendToggleSettingOption[];
export declare const BACKEND_NUMBER_OPTIONS: BackendNumberSettingOption[];
export declare const BACKEND_CATEGORY_OPTIONS: BackendCategoryOption[];
export declare const BACKEND_DEFAULTS: PluginConfig;
export declare const BACKEND_TOGGLE_OPTION_BY_KEY: Map<BackendToggleSettingKey, BackendToggleSettingOption>;
export declare const BACKEND_NUMBER_OPTION_BY_KEY: Map<BackendNumberSettingKey, BackendNumberSettingOption>;
//# sourceMappingURL=backend-settings-schema.d.ts.map