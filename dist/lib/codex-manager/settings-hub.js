import { stdin as input, stdout as output } from "node:process";
import { loadPluginConfig, savePluginConfig } from "../config.js";
import { DEFAULT_DASHBOARD_DISPLAY_SETTINGS, getDashboardSettingsPath, loadDashboardDisplaySettings, saveDashboardDisplaySettings, } from "../dashboard-settings.js";
import { applyOcChatgptSync, planOcChatgptSync, runNamedBackupExport, } from "../oc-chatgpt-orchestrator.js";
import { detectOcChatgptMultiAuthTarget } from "../oc-chatgpt-target-detection.js";
import { loadAccounts, normalizeAccountStorage } from "../storage.js";
import { UI_COPY } from "../ui/copy.js";
import { getUiRuntimeOptions, setUiRuntimeOptions } from "../ui/runtime.js";
import { select } from "../ui/select.js";
import { sleep } from "../utils.js";
import { promptBackendCategorySettingsEntry } from "./backend-category-entry.js";
import { applyBackendCategoryDefaults, getBackendCategory, getBackendCategoryInitialFocus, resolveFocusedBackendNumberKey, } from "./backend-category-helpers.js";
import { promptBackendCategorySettingsMenu } from "./backend-category-prompt.js";
import { configureBackendSettingsController } from "./backend-settings-controller.js";
import { configureBackendSettingsEntry } from "./backend-settings-entry.js";
import { backendSettingsEqual, buildBackendConfigPatch, buildBackendSettingsPreview, clampBackendNumberForTests, cloneBackendPluginConfig, formatBackendNumberValue, } from "./backend-settings-helpers.js";
import { promptBackendSettingsMenu } from "./backend-settings-prompt.js";
import { BACKEND_CATEGORY_OPTIONS, BACKEND_DEFAULTS, BACKEND_NUMBER_OPTION_BY_KEY, BACKEND_TOGGLE_OPTION_BY_KEY, } from "./backend-settings-schema.js";
import { promptBehaviorSettingsPanel } from "./behavior-settings-panel.js";
import { promptDashboardDisplayPanel, } from "./dashboard-display-panel.js";
import { formatDashboardSettingState, formatMenuLayoutMode, formatMenuQuotaTtl, formatMenuSortMode, } from "./dashboard-formatters.js";
import { configureDashboardSettingsController } from "./dashboard-settings-controller.js";
import { cloneDashboardSettingsData, dashboardSettingsDataEqual, } from "./dashboard-settings-data.js";
import { configureDashboardSettingsEntry } from "./dashboard-settings-entry.js";
import { promptExperimentalSettingsEntry } from "./experimental-settings-entry.js";
import { promptExperimentalSettingsMenu } from "./experimental-settings-prompt.js";
import { getExperimentalSelectOptions, mapExperimentalMenuHotkey, mapExperimentalStatusHotkey, } from "./experimental-settings-schema.js";
import { loadExperimentalSyncTargetState } from "./experimental-sync-target.js";
import { loadExperimentalSyncTargetEntry } from "./experimental-sync-target-entry.js";
import { promptSettingsHubEntry } from "./settings-hub-entry.js";
import { buildSettingsHubItems, findSettingsHubInitialCursor, } from "./settings-hub-menu.js";
import { promptSettingsHubMenu } from "./settings-hub-prompt.js";
import { promptBehaviorSettingsPanelEntry, promptDashboardDisplaySettingsPanelEntry, promptStatuslineSettingsPanelEntry, promptStartupSettingsPanelEntry, promptThemeSettingsPanelEntry, reorderStatuslineField, } from "./settings-panels.js";
import { readFileWithRetry, resolvePluginConfigSavePathKey, warnPersistFailure, } from "./settings-persist-utils.js";
import { buildAccountListPreview as buildAccountListPreviewBase, buildSummaryPreviewText as buildSummaryPreviewTextBase, highlightPreviewToken, normalizeStatuslineFields, } from "./settings-preview.js";
import { withQueuedRetry } from "./settings-write-queue.js";
import { promptStatuslineSettingsPanel } from "./statusline-settings-panel.js";
import { promptStartupSettingsPanel } from "./startup-settings-panel.js";
import { promptThemeSettingsPanel } from "./theme-settings-panel.js";
import { configureUnifiedSettingsController, } from "./unified-settings-controller.js";
import { configureUnifiedSettingsEntry } from "./unified-settings-entry.js";
const DASHBOARD_DISPLAY_OPTIONS = [
    {
        key: "menuShowStatusBadge",
        label: "Show Status Badges",
        description: "Show [ok], [active], and similar badges.",
    },
    {
        key: "menuShowCurrentBadge",
        label: "Show [current]",
        description: "Mark the account active in Codex.",
    },
    {
        key: "menuShowLastUsed",
        label: "Show Last Used",
        description: "Show relative usage like 'today'.",
    },
    {
        key: "menuShowQuotaSummary",
        label: "Show Limits (5h / 7d)",
        description: "Show limit bars in each row.",
    },
    {
        key: "menuShowQuotaCooldown",
        label: "Show Limit Cooldowns",
        description: "Show reset timers next to 5h/7d bars.",
    },
    {
        key: "menuShowFetchStatus",
        label: "Show Fetch Status",
        description: "Show background limit refresh status in the menu subtitle.",
    },
    {
        key: "menuHighlightCurrentRow",
        label: "Highlight Current Row",
        description: "Use stronger color on the current row.",
    },
    {
        key: "menuSortEnabled",
        label: "Enable Smart Sort",
        description: "Sort accounts by readiness (view only).",
    },
    {
        key: "menuSortPinCurrent",
        label: "Pin [current] when tied",
        description: "Keep current at top only when it is equally ready.",
    },
    {
        key: "menuSortQuickSwitchVisibleRow",
        label: "Quick Switch Uses Visible Rows",
        description: "Number keys (1-9) follow what you see in the list.",
    },
];
const STATUSLINE_FIELD_OPTIONS = [
    {
        key: "last-used",
        label: "Show Last Used",
        description: "Example: 'today' or '2d ago'.",
    },
    {
        key: "limits",
        label: "Show Limits (5h / 7d)",
        description: "Uses cached limit data from checks.",
    },
    {
        key: "status",
        label: "Show Status Text",
        description: "Visible when badges are hidden.",
    },
];
const AUTO_RETURN_OPTIONS_MS = [1_000, 2_000, 4_000];
const MENU_QUOTA_TTL_OPTIONS_MS = [60_000, 5 * 60_000, 10 * 60_000];
const THEME_PRESET_OPTIONS = ["green", "blue"];
const ACCENT_COLOR_OPTIONS = [
    "green",
    "cyan",
    "blue",
    "yellow",
];
const ACCOUNT_LIST_PANEL_KEYS = [
    "menuShowStatusBadge",
    "menuShowCurrentBadge",
    "menuShowLastUsed",
    "menuShowQuotaSummary",
    "menuShowQuotaCooldown",
    "menuShowFetchStatus",
    "menuShowDetailsForUnselectedRows",
    "menuHighlightCurrentRow",
    "menuSortEnabled",
    "menuSortMode",
    "menuSortPinCurrent",
    "menuSortQuickSwitchVisibleRow",
    "menuLayoutMode",
];
const STATUSLINE_PANEL_KEYS = [
    "menuStatuslineFields",
];
const STARTUP_PANEL_KEYS = [
    "autoPickBestAccountOnLaunch",
];
const BEHAVIOR_PANEL_KEYS = [
    "actionAutoReturnMs",
    "actionPauseOnKey",
    "menuAutoFetchLimits",
    "menuShowFetchStatus",
    "menuQuotaTtlMs",
];
const THEME_PANEL_KEYS = [
    "uiThemePreset",
    "uiAccentColor",
];
function copyDashboardSettingValue(target, source, key) {
    const value = source[key];
    target[key] = Array.isArray(value)
        ? [...value]
        : value;
}
function applyDashboardDefaultsForKeys(draft, keys) {
    const next = cloneDashboardSettings(draft);
    const defaults = cloneDashboardSettings(DEFAULT_DASHBOARD_DISPLAY_SETTINGS);
    for (const key of keys) {
        copyDashboardSettingValue(next, defaults, key);
    }
    return next;
}
function mergeDashboardSettingsForKeys(base, selected, keys) {
    const next = cloneDashboardSettings(base);
    for (const key of keys) {
        copyDashboardSettingValue(next, selected, key);
    }
    return cloneDashboardSettings(next);
}
async function persistDashboardSettingsSelection(selected, keys, scope) {
    const fallback = cloneDashboardSettings(selected);
    try {
        return await withQueuedRetry(getDashboardSettingsPath(), async () => {
            const latest = cloneDashboardSettings(await loadDashboardDisplaySettings());
            const merged = mergeDashboardSettingsForKeys(latest, selected, keys);
            await saveDashboardDisplaySettings(merged);
            return merged;
        }, { sleep });
    }
    catch (error) {
        warnPersistFailure(scope, error);
        return fallback;
    }
}
async function persistBackendConfigSelection(selected, scope) {
    const fallback = cloneBackendPluginConfig(selected);
    try {
        await withQueuedRetry(resolvePluginConfigSavePathKey(), async () => {
            await savePluginConfig(buildBackendConfigPatch(selected));
        }, { sleep });
        return fallback;
    }
    catch (error) {
        warnPersistFailure(scope, error);
        return fallback;
    }
}
function cloneDashboardSettings(settings) {
    return cloneDashboardSettingsData(settings, {
        resolveMenuLayoutMode,
        normalizeStatuslineFields,
    });
}
function dashboardSettingsEqual(left, right) {
    return dashboardSettingsDataEqual(left, right, {
        resolveMenuLayoutMode,
        normalizeStatuslineFields,
    });
}
function buildSummaryPreviewText(settings, ui, focus = null) {
    return buildSummaryPreviewTextBase(settings, ui, resolveMenuLayoutMode, focus);
}
function buildAccountListPreview(settings, ui, focus = null) {
    return buildAccountListPreviewBase(settings, ui, resolveMenuLayoutMode, focus);
}
function clampBackendNumber(option, value) {
    return Math.max(option.min, Math.min(option.max, Math.round(value)));
}
function applyUiThemeFromDashboardSettings(settings) {
    const current = getUiRuntimeOptions();
    setUiRuntimeOptions({
        v2Enabled: current.v2Enabled,
        colorProfile: current.colorProfile,
        glyphMode: current.glyphMode,
        palette: settings.uiThemePreset ?? "green",
        accent: settings.uiAccentColor ?? "green",
    });
}
function resolveMenuLayoutMode(settings) {
    if (settings.menuLayoutMode === "expanded-rows") {
        return "expanded-rows";
    }
    if (settings.menuLayoutMode === "compact-details") {
        return "compact-details";
    }
    return settings.menuShowDetailsForUnselectedRows === true
        ? "expanded-rows"
        : "compact-details";
}
async function withQueuedRetryForTests(pathKey, task) {
    return withQueuedRetry(pathKey, task, { sleep });
}
async function persistDashboardSettingsSelectionForTests(selected, keys, scope) {
    return persistDashboardSettingsSelection(selected, keys, scope);
}
async function persistBackendConfigSelectionForTests(selected, scope) {
    return persistBackendConfigSelection(selected, scope);
}
const __testOnly = {
    clampBackendNumber: clampBackendNumberForTests,
    formatMenuLayoutMode,
    cloneDashboardSettings,
    withQueuedRetry: withQueuedRetryForTests,
    loadExperimentalSyncTarget,
    mapExperimentalMenuHotkey,
    mapExperimentalStatusHotkey,
    promptExperimentalSettings,
    persistDashboardSettingsSelection: persistDashboardSettingsSelectionForTests,
    persistBackendConfigSelection: persistBackendConfigSelectionForTests,
    buildAccountListPreview,
    buildSummaryPreviewText,
    normalizeStatuslineFields,
    reorderField: reorderStatuslineField,
    promptDashboardDisplaySettings,
    promptStatuslineSettings,
    promptStartupSettings,
    promptBehaviorSettings,
    promptThemeSettings,
    promptBackendSettings,
};
/* c8 ignore start - interactive prompt flows are covered by integration tests */
async function promptDashboardDisplaySettings(initial) {
    return promptDashboardDisplaySettingsPanelEntry({
        initial,
        promptDashboardDisplayPanel,
        cloneDashboardSettings,
        buildAccountListPreview,
        formatDashboardSettingState,
        formatMenuSortMode,
        resolveMenuLayoutMode: (settings = DEFAULT_DASHBOARD_DISPLAY_SETTINGS) => resolveMenuLayoutMode(settings),
        formatMenuLayoutMode,
        applyDashboardDefaultsForKeys,
        DASHBOARD_DISPLAY_OPTIONS,
        ACCOUNT_LIST_PANEL_KEYS,
        UI_COPY,
    });
}
async function configureDashboardDisplaySettings(currentSettings) {
    return configureDashboardSettingsEntry(currentSettings, {
        configureDashboardSettingsController,
        loadDashboardDisplaySettings,
        promptSettings: promptDashboardDisplaySettings,
        settingsEqual: dashboardSettingsEqual,
        persistSelection: (selected) => persistDashboardSettingsSelection(selected, ACCOUNT_LIST_PANEL_KEYS, "account-list"),
        applyUiThemeFromDashboardSettings,
        isInteractive: () => input.isTTY && output.isTTY,
        getDashboardSettingsPath,
        writeLine: (message) => {
            console.log(message);
        },
    });
}
async function promptStatuslineSettings(initial) {
    return promptStatuslineSettingsPanelEntry({
        initial,
        promptStatuslineSettingsPanel,
        cloneDashboardSettings,
        buildAccountListPreview,
        normalizeStatuslineFields,
        formatDashboardSettingState,
        applyDashboardDefaultsForKeys,
        STATUSLINE_FIELD_OPTIONS,
        STATUSLINE_PANEL_KEYS,
        UI_COPY,
    });
}
async function promptStartupSettings(initial) {
    return promptStartupSettingsPanelEntry({
        initial,
        promptStartupSettingsPanel,
        cloneDashboardSettings,
        applyDashboardDefaultsForKeys,
        STARTUP_PANEL_KEYS,
        UI_COPY,
    });
}
async function configureStatuslineSettings(currentSettings) {
    return configureDashboardSettingsEntry(currentSettings, {
        configureDashboardSettingsController,
        loadDashboardDisplaySettings,
        promptSettings: promptStatuslineSettings,
        settingsEqual: dashboardSettingsEqual,
        persistSelection: (selected) => persistDashboardSettingsSelection(selected, STATUSLINE_PANEL_KEYS, "summary-fields"),
        applyUiThemeFromDashboardSettings,
        isInteractive: () => input.isTTY && output.isTTY,
        getDashboardSettingsPath,
        writeLine: (message) => {
            console.log(message);
        },
    });
}
async function promptBehaviorSettings(initial) {
    return promptBehaviorSettingsPanelEntry({
        initial,
        promptBehaviorSettingsPanel,
        cloneDashboardSettings,
        applyDashboardDefaultsForKeys,
        formatMenuQuotaTtl,
        AUTO_RETURN_OPTIONS_MS,
        MENU_QUOTA_TTL_OPTIONS_MS,
        BEHAVIOR_PANEL_KEYS,
        UI_COPY,
    });
}
async function promptThemeSettings(initial) {
    return promptThemeSettingsPanelEntry({
        initial,
        promptThemeSettingsPanel,
        cloneDashboardSettings,
        applyDashboardDefaultsForKeys,
        applyUiThemeFromDashboardSettings,
        THEME_PRESET_OPTIONS,
        ACCENT_COLOR_OPTIONS,
        THEME_PANEL_KEYS,
        UI_COPY,
    });
}
async function promptBackendCategorySettings(initial, category, initialFocus) {
    return promptBackendCategorySettingsEntry({
        initial,
        category,
        initialFocus,
        promptBackendCategorySettingsMenu,
        ui: getUiRuntimeOptions(),
        cloneBackendPluginConfig,
        buildBackendSettingsPreview,
        highlightPreviewToken,
        resolveFocusedBackendNumberKey,
        clampBackendNumber,
        formatBackendNumberValue,
        formatDashboardSettingState,
        applyBackendCategoryDefaults: (config, selectedCategory) => applyBackendCategoryDefaults(config, selectedCategory, {
            backendDefaults: BACKEND_DEFAULTS,
            numberOptionByKey: BACKEND_NUMBER_OPTION_BY_KEY,
        }),
        getBackendCategoryInitialFocus,
        backendDefaults: BACKEND_DEFAULTS,
        toggleOptionByKey: BACKEND_TOGGLE_OPTION_BY_KEY,
        numberOptionByKey: BACKEND_NUMBER_OPTION_BY_KEY,
        select,
        copy: UI_COPY.settings,
    });
}
async function promptBackendSettings(initial) {
    const interactive = input.isTTY && output.isTTY;
    if (!interactive) {
        return null;
    }
    return promptBackendSettingsMenu({
        initial,
        isInteractive: () => interactive,
        ui: getUiRuntimeOptions(),
        cloneBackendPluginConfig,
        backendCategoryOptions: BACKEND_CATEGORY_OPTIONS,
        getBackendCategoryInitialFocus,
        buildBackendSettingsPreview,
        highlightPreviewToken,
        select,
        getBackendCategory,
        promptBackendCategorySettings,
        backendDefaults: BACKEND_DEFAULTS,
        copy: UI_COPY.settings,
    });
}
async function loadExperimentalSyncTarget() {
    return loadExperimentalSyncTargetEntry({
        loadExperimentalSyncTargetState,
        detectTarget: detectOcChatgptMultiAuthTarget,
        readFileWithRetry,
        normalizeAccountStorage,
        sleep,
    });
}
async function promptExperimentalSettings(initialConfig) {
    return promptExperimentalSettingsEntry({
        initialConfig,
        promptExperimentalSettingsMenu,
        isInteractive: () => input.isTTY && output.isTTY,
        ui: getUiRuntimeOptions(),
        cloneBackendPluginConfig,
        select,
        getExperimentalSelectOptions,
        mapExperimentalMenuHotkey,
        mapExperimentalStatusHotkey,
        formatDashboardSettingState,
        copy: UI_COPY.settings,
        input,
        output,
        runNamedBackupExport,
        loadAccounts,
        loadExperimentalSyncTarget,
        planOcChatgptSync,
        applyOcChatgptSync,
        getTargetKind: (targetState) => targetState.kind,
        getTargetDestination: (targetState) => targetState.destination ?? null,
        getTargetDetection: (targetState) => targetState.detection,
        getTargetErrorMessage: (targetState) => targetState.kind === "error"
            ? (targetState.message ?? "Unknown error")
            : null,
        getPlanKind: (plan) => plan.kind,
        getPlanBlockedReason: (plan) => {
            const candidate = plan;
            return candidate.kind === "blocked-ambiguous"
                ? `Sync blocked: ${candidate.detection?.reason ?? "unknown"}`
                : `Sync unavailable: ${candidate.detection?.reason ?? "unknown"}`;
        },
        getPlanPreview: (plan) => plan.preview,
        getAppliedLabel: (applied) => {
            const candidate = applied;
            return {
                label: candidate.kind === "applied"
                    ? `Applied sync to ${candidate.target?.accountPath ?? "target"}`
                    : candidate.kind === "error"
                        ? candidate.error instanceof Error
                            ? candidate.error.message
                            : String(candidate.error)
                        : "Sync did not apply",
                color: candidate.kind === "applied" ? "green" : "yellow",
            };
        },
    });
}
async function configureBackendSettings(currentConfig) {
    return configureBackendSettingsEntry(currentConfig, {
        configureBackendSettingsController,
        cloneBackendPluginConfig,
        loadPluginConfig,
        promptBackendSettings,
        backendSettingsEqual,
        persistBackendConfigSelection,
        isInteractive: () => input.isTTY && output.isTTY,
        writeLine: (message) => {
            console.log(message);
        },
    });
}
async function promptSettingsHub(initialFocus = "account-list") {
    return promptSettingsHubEntry({
        initialFocus,
        promptSettingsHubMenu,
        isInteractive: () => input.isTTY && output.isTTY,
        getUiRuntimeOptions,
        buildItems: () => buildSettingsHubItems(UI_COPY.settings),
        findInitialCursor: findSettingsHubInitialCursor,
        select,
        copy: {
            title: UI_COPY.settings.title,
            subtitle: UI_COPY.settings.subtitle,
            help: UI_COPY.settings.help,
        },
    });
}
/* c8 ignore stop */
async function configureUnifiedSettings(initialSettings) {
    return configureUnifiedSettingsEntry(initialSettings, {
        configureUnifiedSettingsController,
        cloneDashboardSettings,
        cloneBackendPluginConfig,
        loadDashboardDisplaySettings,
        loadPluginConfig,
        applyUiThemeFromDashboardSettings,
        promptSettingsHub: async (focus) => promptSettingsHub(focus),
        configureDashboardDisplaySettings,
        configureStatuslineSettings,
        promptStartupSettings,
        promptBehaviorSettings,
        promptThemeSettings,
        dashboardSettingsEqual,
        persistDashboardSettingsSelection,
        promptExperimentalSettings,
        backendSettingsEqual,
        persistBackendConfigSelection,
        configureBackendSettings,
        STARTUP_PANEL_KEYS,
        BEHAVIOR_PANEL_KEYS,
        THEME_PANEL_KEYS,
    });
}
export { configureUnifiedSettings, applyUiThemeFromDashboardSettings, resolveMenuLayoutMode, __testOnly, };
//# sourceMappingURL=settings-hub.js.map