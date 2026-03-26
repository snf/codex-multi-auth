import type { PluginConfig } from "./types.js";
export type UnsupportedCodexPolicy = "strict" | "fallback";
type ConfigExplainStorageKind = "unified" | "file" | "none" | "unreadable";
type ConfigExplainStoredSource = Extract<ConfigExplainStorageKind, "unified" | "file">;
export type ConfigExplainSource = "env" | ConfigExplainStoredSource | "default";
export interface ConfigExplainEntry {
    key: keyof PluginConfig;
    value: unknown;
    defaultValue: unknown;
    source: ConfigExplainSource;
    envNames: string[];
}
export interface ConfigExplainReport {
    configPath: string | null;
    storageKind: ConfigExplainStorageKind;
    entries: ConfigExplainEntry[];
}
export declare function __resetConfigWarningCacheForTests(): void;
/**
 * Default plugin configuration
 * CODEX_MODE is enabled by default for better Codex CLI parity
 */
export declare const DEFAULT_PLUGIN_CONFIG: PluginConfig;
/**
 * Return a shallow copy of the default plugin configuration.
 *
 * Safe to call concurrently; performs no I/O and has no filesystem or Windows atomicity implications.
 * The returned object may include placeholder fields for secrets or tokens — callers must redact sensitive values before logging or persisting.
 *
 * @returns A shallow copy of DEFAULT_PLUGIN_CONFIG
 */
export declare function getDefaultPluginConfig(): PluginConfig;
/**
 * Load the plugin configuration, merging validated user settings with defaults and applying legacy fallbacks.
 *
 * Attempts to read unified settings first; if absent, falls back to legacy per-user JSON files (UTF-8 BOM is stripped on Windows before parsing).
 * Emits one-time warnings for validation or migration issues and avoids exposing sensitive tokens in logged messages.
 * This function performs filesystem reads and may write a migrated unified config; callers should avoid concurrent writers to the same config paths.
 *
 * @returns The effective PluginConfig: a shallow merge of DEFAULT_PLUGIN_CONFIG with any validated user-provided settings
 */
export declare function loadPluginConfig(): PluginConfig;
/**
 * Persist a partial plugin configuration to disk, merging it with existing stored settings.
 *
 * This writes the sanitized patch either to the path specified by the CODEX_MULTI_AUTH_CONFIG_PATH
 * environment variable (if set) or into the unified settings store. The function does not take
 * internal locks; callers should avoid concurrent invocations that might overwrite each other.
 * On Windows and other platforms the write behavior follows the Node.js filesystem semantics and may
 * not be atomic across processes. Callers are responsible for redacting any sensitive values
 * (tokens, secrets) before calling if redaction is required; this function writes merged values as-is.
 *
 * @param configPatch - Partial PluginConfig containing changes to persist; undefined fields are ignored.
 * @returns void
 */
export declare function savePluginConfig(configPatch: Partial<PluginConfig>): Promise<void>;
export declare function getCodexMode(pluginConfig: PluginConfig): boolean;
export declare function getCodexTuiV2(pluginConfig: PluginConfig): boolean;
export declare function getCodexTuiColorProfile(pluginConfig: PluginConfig): "truecolor" | "ansi16" | "ansi256";
export declare function getCodexTuiGlyphMode(pluginConfig: PluginConfig): "ascii" | "unicode" | "auto";
export declare function getFastSession(pluginConfig: PluginConfig): boolean;
export declare function getFastSessionStrategy(pluginConfig: PluginConfig): "hybrid" | "always";
export declare function getFastSessionMaxInputItems(pluginConfig: PluginConfig): number;
export declare function getRetryAllAccountsRateLimited(pluginConfig: PluginConfig): boolean;
export declare function getRetryAllAccountsMaxWaitMs(pluginConfig: PluginConfig): number;
export declare function getRetryAllAccountsMaxRetries(pluginConfig: PluginConfig): number;
export declare function getUnsupportedCodexPolicy(pluginConfig: PluginConfig): UnsupportedCodexPolicy;
export declare function getFallbackOnUnsupportedCodexModel(pluginConfig: PluginConfig): boolean;
export declare function getFallbackToGpt52OnUnsupportedGpt53(pluginConfig: PluginConfig): boolean;
export declare function getUnsupportedCodexFallbackChain(pluginConfig: PluginConfig): Record<string, string[]>;
export declare function getTokenRefreshSkewMs(pluginConfig: PluginConfig): number;
export declare function getRateLimitToastDebounceMs(pluginConfig: PluginConfig): number;
export declare function getSessionRecovery(pluginConfig: PluginConfig): boolean;
export declare function getAutoResume(pluginConfig: PluginConfig): boolean;
export declare function getToastDurationMs(pluginConfig: PluginConfig): number;
export declare function getPerProjectAccounts(pluginConfig: PluginConfig): boolean;
export declare function getParallelProbing(pluginConfig: PluginConfig): boolean;
export declare function getParallelProbingMaxConcurrency(pluginConfig: PluginConfig): number;
export declare function getEmptyResponseMaxRetries(pluginConfig: PluginConfig): number;
export declare function getEmptyResponseRetryDelayMs(pluginConfig: PluginConfig): number;
export declare function getPidOffsetEnabled(pluginConfig: PluginConfig): boolean;
/**
 * Resolve the HTTP fetch timeout to use for account/token requests.
 *
 * Concurrency: value is read-only and safe to use concurrently; callers must enforce timeout usage in their request code. On Windows, filesystem-derived overrides (via env or config file) are subject to typical path encoding and newline semantics. Configuration values may contain sensitive tokens elsewhere; this function only returns a numeric timeout and does not expose or log secrets.
 *
 * @param pluginConfig - Plugin configuration object to read the `fetchTimeoutMs` fallback from
 * @returns The resolved fetch timeout in milliseconds (at least 1000)
 */
export declare function getFetchTimeoutMs(pluginConfig: PluginConfig): number;
/**
 * Compute the effective stream stall timeout used to detect stalled streams.
 *
 * This value applies across concurrent operations and should be treated as a global per-process timeout; callers may use it from multiple async contexts without additional synchronization. The function performs no filesystem I/O and has no special Windows filesystem behavior. Returned values do not contain or reveal any tokens and no redaction is performed by this function.
 *
 * @param pluginConfig - Plugin configuration that may contain a `streamStallTimeoutMs` override
 * @returns The effective stream stall timeout in milliseconds; at least 1000 ms, defaults to 45000 ms
 */
export declare function getStreamStallTimeoutMs(pluginConfig: PluginConfig): number;
/**
 * Determine whether live account synchronization is enabled.
 *
 * Respects the environment override `CODEX_AUTH_LIVE_ACCOUNT_SYNC`, falls back to
 * `pluginConfig.liveAccountSync` when present, and defaults to `true`. This accessor performs no
 * filesystem operations (behaves the same on Windows paths) and does not mutate or log token or
 * credential material; callers are responsible for concurrency and must redact tokens before
 * logging or persisting them.
 *
 * @param pluginConfig - The plugin configuration object used as the non-environment fallback
 * @returns `true` if live account synchronization is enabled, `false` otherwise
 */
export declare function getLiveAccountSync(pluginConfig: PluginConfig): boolean;
/**
 * Get the debounce interval, in milliseconds, used when synchronizing live accounts.
 *
 * @param pluginConfig - Plugin configuration which may contain an override for the debounce value
 * @returns The debounce interval in milliseconds; defaults to 250, and will be at least 50
 *
 * Concurrency: safe to call from multiple threads/tasks concurrently.
 * Windows filesystem: value is independent of filesystem semantics.
 * Token redaction: this value contains no secrets and is safe to log.
 */
export declare function getLiveAccountSyncDebounceMs(pluginConfig: PluginConfig): number;
/**
 * Determines the polling interval (in milliseconds) used by live account synchronization.
 *
 * @param pluginConfig - The plugin configuration to read the setting from.
 * @returns The effective poll interval in milliseconds; guaranteed to be at least 500.
 *
 * Notes:
 * - Concurrency: this value is used to debounce/drive polling and should be treated as a minimum per-worker interval when multiple workers run concurrently.
 * - Platform: value is independent of Windows filesystem semantics.
 * - Secrets: the returned value contains no sensitive tokens and is safe for logging (no redaction required).
 */
export declare function getLiveAccountSyncPollMs(pluginConfig: PluginConfig): number;
/**
 * Indicates whether session affinity is enabled.
 *
 * Reads the `sessionAffinity` value from `pluginConfig` and allows an environment
 * override via `CODEX_AUTH_SESSION_AFFINITY`. Safe for concurrent reads, unaffected
 * by Windows filesystem semantics, and does not expose or log authentication tokens.
 *
 * @param pluginConfig - The plugin configuration to consult for the setting
 * @returns `true` if session affinity is enabled, `false` otherwise
 */
export declare function getSessionAffinity(pluginConfig: PluginConfig): boolean;
/**
 * Get the session-affinity time-to-live in milliseconds.
 *
 * Reads CODEX_AUTH_SESSION_AFFINITY_TTL_MS from the environment if present, otherwise uses
 * `pluginConfig.sessionAffinityTtlMs`, falling back to 20 minutes. The returned value is
 * clamped to a minimum of 1000 ms.
 *
 * This function performs no filesystem I/O, is safe for concurrent callers, and does not
 * read or emit any token or secret material (suitable for logging without redaction).
 * Because it does no file operations, there are no Windows filesystem semantics to consider.
 *
 * @param pluginConfig - The plugin configuration to read the setting from
 * @returns The effective session-affinity TTL in milliseconds (minimum 1000)
 */
export declare function getSessionAffinityTtlMs(pluginConfig: PluginConfig): number;
/**
 * Determine the configured maximum number of session-affinity entries.
 *
 * @param pluginConfig - The plugin configuration to read the `sessionAffinityMaxEntries` setting from.
 * @returns The effective maximum number of affinity entries (minimum 8, default 512).
 *
 * Concurrency: value is used for in-memory sizing and should be safe for concurrent use by runtime components.
 * Filesystem: value is runtime-only and unaffected by Windows filesystem semantics.
 * Security: this setting contains no secrets and is safe to log; it does not include tokens or credentials.
 */
export declare function getSessionAffinityMaxEntries(pluginConfig: PluginConfig): number;
/**
 * Controls whether the plugin should automatically continue Responses API turns
 * with the last known `previous_response_id` for the active session key.
 *
 * Reads the `responseContinuation` value from `pluginConfig` and allows an
 * environment override via `CODEX_AUTH_RESPONSE_CONTINUATION`.
 *
 * @param pluginConfig - The plugin configuration to consult for the setting
 * @returns `true` if automatic response continuation is enabled, `false` otherwise
 */
export declare function getResponseContinuation(pluginConfig: PluginConfig): boolean;
/**
 * Controls whether the plugin may preserve explicit Responses API background requests.
 *
 * Background mode is disabled by default because the normal Codex request path is stateless (`store=false`).
 * When enabled, callers may opt into `background: true`, which switches the request to `store=true`.
 *
 * @param pluginConfig - The plugin configuration to consult for the setting
 * @returns `true` if stateful background responses are allowed, `false` otherwise
 */
export declare function getBackgroundResponses(pluginConfig: PluginConfig): boolean;
/**
 * Controls whether the proactive refresh guardian is enabled.
 *
 * When enabled, background refreshes may run concurrently; callers should assume safe concurrent access.
 * Configuration respects cross-platform semantics (including Windows filesystem behavior) when persisting or migrating settings.
 * Any tokens or sensitive values observed during refresh operations are redacted from logs and persisted records.
 *
 * @param pluginConfig - The plugin configuration object to read the setting from
 * @returns `true` if the proactive refresh guardian is enabled, `false` otherwise.
 */
export declare function getProactiveRefreshGuardian(pluginConfig: PluginConfig): boolean;
/**
 * Determines the proactive refresh guardian interval in milliseconds.
 *
 * Uses the environment override `CODEX_AUTH_PROACTIVE_GUARDIAN_INTERVAL_MS` if present; otherwise uses
 * the configured `pluginConfig.proactiveRefreshIntervalMs` or the default of 60000 ms. The resulting
 * value is constrained to be at least 5000 ms.
 *
 * Concurrency assumption: callers may be invoked from multiple timers/workers concurrently.
 * Windows filesystem and token-redaction concerns do not affect this getter.
 *
 * @param pluginConfig - Plugin configuration used as the fallback source for the interval value
 * @returns The proactive refresh interval in milliseconds (>= 5000)
 */
export declare function getProactiveRefreshIntervalMs(pluginConfig: PluginConfig): number;
/**
 * Get the proactive refresh guardian buffer interval in milliseconds.
 *
 * @param pluginConfig - Plugin configuration object; `proactiveRefreshBufferMs` may override the default
 * @returns The buffer interval in milliseconds: at least 30000, default 300000
 *
 * Concurrency: this value is shared across concurrent proactive-refresh workers and should be treated as a global timing setting.
 * Windows filesystem: not related to filesystem behavior.
 * Token redaction: environment values and config contents may be redacted in logs and diagnostics.
 */
export declare function getProactiveRefreshBufferMs(pluginConfig: PluginConfig): number;
/**
 * Get the network error cooldown interval used before retrying network operations.
 *
 * @param pluginConfig - Plugin configuration to read override values from
 * @returns The cooldown interval in milliseconds (greater than or equal to 0)
 *
 * Concurrency: callers may read and cache this value; it is read-only at call time.
 * Windows filesystem: no platform-specific filesystem behavior affects this setting.
 * Token redaction: this function does not expose or log sensitive tokens.
 */
export declare function getNetworkErrorCooldownMs(pluginConfig: PluginConfig): number;
/**
 * Get the cooldown duration in milliseconds to apply after a server error.
 *
 * Callers may invoke this concurrently; the returned value is read-only and safe for concurrent use.
 * This function performs no filesystem access and is unaffected by Windows path semantics.
 * It does not log or expose secrets — environment-derived values are treated as configuration, not token data.
 *
 * @param pluginConfig - Plugin configuration used to resolve the setting
 * @returns The cooldown in milliseconds to use after a server error (minimum 0, default 4000)
 */
export declare function getServerErrorCooldownMs(pluginConfig: PluginConfig): number;
/**
 * Determines whether periodic storage backups are enabled.
 *
 * When enabled, background backup tasks may run concurrently; backups follow platform filesystem semantics (including Windows path behavior), and persisted backup data will have sensitive tokens redacted.
 *
 * @param pluginConfig - The plugin configuration to read the setting from
 * @returns `true` if storage backup is enabled, `false` otherwise
 */
export declare function getStorageBackupEnabled(pluginConfig: PluginConfig): boolean;
/**
 * Determines whether preemptive quota checks are enabled.
 *
 * Safe to call concurrently; this function does not access the filesystem (no Windows-specific behavior)
 * and does not expose or log any authentication tokens.
 *
 * @param pluginConfig - Plugin configuration to read the preemptive quota setting from
 * @returns `true` if preemptive quota is enabled, `false` otherwise
 */
export declare function getPreemptiveQuotaEnabled(pluginConfig: PluginConfig): boolean;
/**
 * Get the configured preemptive-quota remaining percentage for 5-hour windows.
 *
 * @param pluginConfig - Plugin configuration to read the setting from. The value may be overridden by the CODEX_AUTH_PREEMPTIVE_QUOTA_5H_REMAINING_PCT environment variable; environment override semantics are the same on Windows. Safe to call concurrently. The returned value does not contain sensitive tokens and requires no redaction.
 * @returns The percentage (0–100) used as the preemptive quota threshold for 5-hour intervals.
 */
export declare function getPreemptiveQuotaRemainingPercent5h(pluginConfig: PluginConfig): number;
/**
 * Determine the percentage of quota to reserve for the 7-day window.
 *
 * Resolves the effective value from the environment variable `CODEX_AUTH_PREEMPTIVE_QUOTA_7D_REMAINING_PCT`,
 * then from `pluginConfig.preemptiveQuotaRemainingPercent7d`, falling back to `5` if unset, and clamps the result
 * to the inclusive range `0`–`100`.
 *
 * Concurrent reads are safe. Behavior is independent of Windows filesystem semantics. No sensitive tokens are included
 * or returned by this function.
 *
 * @param pluginConfig - Plugin configuration object used as a fallback when the environment variable is not set
 * @returns The reserved quota percentage for the 7-day window, an integer between `0` and `100`
 */
export declare function getPreemptiveQuotaRemainingPercent7d(pluginConfig: PluginConfig): number;
/**
 * Get the configured maximum deferral time (in milliseconds) for preemptive quota checks.
 *
 * Reads an environment override or the plugin configuration and enforces a minimum of 1000 ms.
 *
 * @param pluginConfig - Plugin configuration object to read the setting from
 * @returns The maximum deferral interval in milliseconds
 *
 * Concurrency: concurrent config writers may not be observed immediately by readers.
 * Filesystem note: config persistence/visibility may differ on Windows vs POSIX filesystems.
 * Security: the returned value contains no sensitive tokens and is safe to log.
 */
export declare function getPreemptiveQuotaMaxDeferralMs(pluginConfig: PluginConfig): number;
export declare function getPluginConfigExplainReport(): ConfigExplainReport;
export {};
//# sourceMappingURL=config.d.ts.map