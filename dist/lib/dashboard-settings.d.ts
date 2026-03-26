export type DashboardThemePreset = "green" | "blue";
export type DashboardAccentColor = "green" | "cyan" | "blue" | "yellow";
export type DashboardAccountSortMode = "manual" | "ready-first";
export type DashboardLayoutMode = "compact-details" | "expanded-rows";
export type DashboardFocusStyle = "row-invert";
export interface DashboardDisplaySettings {
    showPerAccountRows: boolean;
    showQuotaDetails: boolean;
    showForecastReasons: boolean;
    showRecommendations: boolean;
    showLiveProbeNotes: boolean;
    actionAutoReturnMs?: number;
    actionPauseOnKey?: boolean;
    autoPickBestAccountOnLaunch?: boolean;
    menuAutoFetchLimits?: boolean;
    menuSortEnabled?: boolean;
    menuSortMode?: DashboardAccountSortMode;
    menuSortPinCurrent?: boolean;
    menuSortQuickSwitchVisibleRow?: boolean;
    uiThemePreset?: DashboardThemePreset;
    uiAccentColor?: DashboardAccentColor;
    menuShowStatusBadge?: boolean;
    menuShowCurrentBadge?: boolean;
    menuShowLastUsed?: boolean;
    menuShowQuotaSummary?: boolean;
    menuShowQuotaCooldown?: boolean;
    menuShowFetchStatus?: boolean;
    menuShowDetailsForUnselectedRows?: boolean;
    menuLayoutMode?: DashboardLayoutMode;
    menuQuotaTtlMs?: number;
    menuFocusStyle?: DashboardFocusStyle;
    menuHighlightCurrentRow?: boolean;
    menuStatuslineFields?: DashboardStatuslineField[];
}
export type DashboardStatuslineField = "last-used" | "limits" | "status";
export declare const DASHBOARD_DISPLAY_SETTINGS_VERSION: 1;
export declare const DEFAULT_DASHBOARD_DISPLAY_SETTINGS: DashboardDisplaySettings;
/**
 * Filesystem path to the unified dashboard settings file.
 *
 * This path is the canonical location used by the load/save helpers. Callers should assume the file may be concurrently modified by other processes and use atomic write strategies when persisting. On Windows the returned path may contain backslashes; redact any sensitive tokens before logging or external reporting.
 *
 * @returns The absolute path to the unified dashboard settings file.
 */
export declare function getDashboardSettingsPath(): string;
/**
 * Normalize an untrusted value into a complete, validated DashboardDisplaySettings object.
 *
 * Produces a settings object where missing or invalid fields are replaced with sensible defaults,
 * layout-derived fields are resolved, numeric values are clamped to allowed ranges, and enumerations
 * are coerced to allowed values.
 *
 * Concurrency: pure and deterministic; safe to call concurrently. This function performs no I/O,
 * so Windows filesystem semantics do not apply. It does not perform token redaction or any
 * sensitive-data filtering.
 *
 * @param value - The input to normalize (may be any type, typically parsed JSON or a partial settings record)
 * @returns A DashboardDisplaySettings object with all fields validated and defaulted
 */
export declare function normalizeDashboardDisplaySettings(value: unknown): DashboardDisplaySettings;
/**
 * Load and return the normalized dashboard display settings, migrating legacy settings when present.
 *
 * Attempts to read unified settings first; if absent, loads legacy dashboard-settings.json, normalizes
 * its contents, and tries to migrate the normalized result to the unified settings store. On any read,
 * parse, or validation error, or if no settings are found, returns the built-in defaults.
 *
 * @returns The normalized DashboardDisplaySettings to apply.
 *
 * @remarks
 * - Concurrency: callers may race with other processes performing migration or writes; callers should
 *   not assume exclusive access and should tolerate eventual consistency.
 * - Filesystem (Windows): legacy-path checks use case-insensitive filesystem semantics implicitly; ensure
 *   any external tooling accounts for that when placing or removing legacy files.
 * - Token handling: persisted settings are stored as-is; remove or redact any sensitive tokens from
 *   settings before calling this function if they must not be written unmodified to persistent stores.
 */
export declare function loadDashboardDisplaySettings(): Promise<DashboardDisplaySettings>;
/**
 * Persist normalized dashboard display settings to the unified settings store.
 *
 * Normalizes `settings` and writes the resulting record via the unified settings API.
 * Concurrent callers may race and overwrite each other; callers should serialize updates
 * when strong write ordering is required. On Windows, underlying filesystem writes may
 * not be atomic across processes. Any sensitive tokens or secrets present in settings
 * are written as provided; callers must remove or redact sensitive values before saving.
 *
 * @param settings - The dashboard display settings to normalize and save
 */
export declare function saveDashboardDisplaySettings(settings: DashboardDisplaySettings): Promise<void>;
//# sourceMappingURL=dashboard-settings.d.ts.map