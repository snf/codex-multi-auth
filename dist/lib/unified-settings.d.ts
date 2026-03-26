type JsonRecord = Record<string, unknown>;
export declare const UNIFIED_SETTINGS_VERSION: 1;
/**
 * Get the absolute filesystem path to the unified settings JSON file used for multi-auth plugins.
 *
 * The path points to the settings.json inside the Codex multi-auth directory. Callers should treat access as subject to typical filesystem race conditions (concurrent readers/writers may conflict), and be aware that on Windows the path uses platform separators returned by Node's path utilities. The file may contain sensitive tokens; redact or avoid logging file contents.
 *
 * @returns The absolute path to the unified settings JSON file
 */
export declare function getUnifiedSettingsPath(): string;
/**
 * Loads the unified plugin configuration from the versioned settings file.
 *
 * Returns a shallow clone of the `pluginConfig` section if present; returns `null` when the settings file or the section is absent or unreadable.
 *
 * Note: callers should expect possible race conditions if other processes write the settings file concurrently; atomicity is not guaranteed across filesystems (including some Windows setups). This function does not redact or modify sensitive tokens—do not log or expose values returned here without first applying appropriate redaction.
 *
 * @returns A shallow clone of the `pluginConfig` object from the settings file, or `null` if unavailable.
 */
export declare function loadUnifiedPluginConfigSync(): JsonRecord | null;
/**
 * Persist the given plugin configuration into the unified settings file synchronously.
 *
 * The provided `pluginConfig` is stored as the `pluginConfig` section of the on-disk
 * settings payload (shallow-cloned before write). Callers are responsible for redacting
 * any sensitive tokens or secrets prior to calling; values are written verbatim.
 *
 * Concurrency: no cross-process locking is performed — concurrent writers may overwrite
 * each other. On Windows, write semantics and atomicity may differ from POSIX filesystems.
 *
 * @param pluginConfig - Key/value map representing plugin configuration to persist
 */
export declare function saveUnifiedPluginConfigSync(pluginConfig: JsonRecord): void;
/**
 * Persist the provided plugin configuration to the unified settings file, replacing the `pluginConfig` section.
 *
 * Writes a shallow clone of `pluginConfig` into the on-disk settings payload. In-process calls are serialized
 * through an async queue to reduce lost-update races, but there is still no cross-process locking. On Windows,
 * filesystem atomicity and visibility semantics are platform-dependent; do not assume atomic merges across processes.
 * The settings file is written as plain JSON; redact or remove any sensitive tokens or secrets before calling.
 *
 * @param pluginConfig - The plugin configuration object to store (will be shallow-cloned)
 */
export declare function saveUnifiedPluginConfig(pluginConfig: JsonRecord): Promise<void>;
/**
 * Load the dashboard display settings section from the unified settings file.
 *
 * Concurrency: callers should avoid concurrent conflicting writes to the settings file; concurrent readers are allowed but may observe intermediate state if a writer is in progress.
 * Windows: note that filesystem semantics on Windows may cause exclusive locks or delayed visibility during writes.
 * Secrets: this API does not perform token or secret redaction; callers must remove or mask sensitive values before saving.
 *
 * @returns A cloned `JsonRecord` with the `dashboardDisplaySettings` section, or `null` if the settings file is missing or cannot be parsed.
 */
export declare function loadUnifiedDashboardSettings(): Promise<JsonRecord | null>;
/**
 * Persist dashboard display settings into the unified settings file.
 *
 * Writes `dashboardDisplaySettings` into the shared settings.json (overwriting
 * any existing dashboardDisplaySettings section) and ensures the payload is
 * normalized with the file version. In-process async callers are serialized
 * through an internal queue (last writer still wins), but no cross-process lock
 * is provided. On Windows, path and directory creation follow Node's filesystem
 * semantics (case-insensitive paths, ACLs apply). Sensitive tokens or secrets
 * included in `dashboardDisplaySettings` are written verbatim — callers must
 * redact or omit secrets before calling.
 *
 * @param dashboardDisplaySettings - A plain JSON record describing dashboard display preferences; the object is shallow-copied before persisting.
 */
export declare function saveUnifiedDashboardSettings(dashboardDisplaySettings: JsonRecord): Promise<void>;
export {};
//# sourceMappingURL=unified-settings.d.ts.map