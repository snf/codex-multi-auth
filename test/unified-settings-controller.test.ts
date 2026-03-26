import { describe, expect, it, vi } from "vitest";
import { configureUnifiedSettingsController } from "../lib/codex-manager/unified-settings-controller.js";
import type { DashboardDisplaySettings } from "../lib/dashboard-settings.js";
import type { PluginConfig } from "../lib/types.js";

function createSettings(): DashboardDisplaySettings {
	return {
		menuShowStatusBadge: true,
		autoPickBestAccountOnLaunch: false,
	};
}

function createConfig(): PluginConfig {
	return { fetchTimeoutMs: 1000 };
}

describe("unified settings controller", () => {
	it("returns current settings when hub exits immediately", async () => {
		const result = await configureUnifiedSettingsController(undefined, {
			cloneDashboardSettings: (settings) => ({ ...settings }),
			cloneBackendPluginConfig: (config) => ({ ...config }),
			loadDashboardDisplaySettings: async () => createSettings(),
			loadPluginConfig: () => createConfig(),
			applyUiThemeFromDashboardSettings: vi.fn(),
			promptSettingsHub: async () => null,
			configureDashboardDisplaySettings: async (current) => current,
			configureStatuslineSettings: async (current) => current,
			promptStartupSettings: async () => null,
			promptBehaviorSettings: async () => null,
			promptThemeSettings: async () => null,
			dashboardSettingsEqual: () => true,
			persistDashboardSettingsSelection: vi.fn(),
			promptExperimentalSettings: async () => null,
			backendSettingsEqual: () => true,
			persistBackendConfigSelection: vi.fn(),
			configureBackendSettings: async (config) => config,
			STARTUP_PANEL_KEYS: [],
			BEHAVIOR_PANEL_KEYS: [],
			THEME_PANEL_KEYS: [],
		});

		expect(result.menuShowStatusBadge).toBe(true);
	});

	it("routes account-list and backend actions through delegates", async () => {
		const configureDashboardDisplaySettings = vi.fn(async () => ({
			menuShowStatusBadge: false,
		}));
		const configureBackendSettings = vi.fn(async (config: PluginConfig) => ({
			...config,
			fetchTimeoutMs: 2000,
		}));
		const promptSettingsHub = vi
			.fn()
			.mockResolvedValueOnce({ type: "account-list" })
			.mockResolvedValueOnce({ type: "backend" })
			.mockResolvedValueOnce({ type: "back" });

		const result = await configureUnifiedSettingsController(createSettings(), {
			cloneDashboardSettings: (settings) => ({ ...settings }),
			cloneBackendPluginConfig: (config) => ({ ...config }),
			loadDashboardDisplaySettings: async () => createSettings(),
			loadPluginConfig: () => createConfig(),
			applyUiThemeFromDashboardSettings: vi.fn(),
			promptSettingsHub,
			configureDashboardDisplaySettings,
			configureStatuslineSettings: async (current) => current,
			promptStartupSettings: async () => null,
			promptBehaviorSettings: async () => null,
			promptThemeSettings: async () => null,
			dashboardSettingsEqual: () => true,
			persistDashboardSettingsSelection: vi.fn(),
			promptExperimentalSettings: async () => null,
			backendSettingsEqual: () => true,
			persistBackendConfigSelection: vi.fn(),
			configureBackendSettings,
			STARTUP_PANEL_KEYS: [],
			BEHAVIOR_PANEL_KEYS: [],
			THEME_PANEL_KEYS: [],
		});

		expect(configureDashboardDisplaySettings).toHaveBeenCalled();
		expect(configureBackendSettings).toHaveBeenCalledWith({
			fetchTimeoutMs: 1000,
		});
		expect(result.menuShowStatusBadge).toBe(false);
	});

	it("persists startup, behavior, theme, and experimental changes when selections differ", async () => {
		const persistDashboardSettingsSelection = vi.fn(
			async (selected: DashboardDisplaySettings) => selected,
		);
		const persistBackendConfigSelection = vi.fn(
			async (config: PluginConfig) => config,
		);
		const applyUiThemeFromDashboardSettings = vi.fn();
		const promptSettingsHub = vi
			.fn()
			.mockResolvedValueOnce({ type: "startup" })
			.mockResolvedValueOnce({ type: "behavior" })
			.mockResolvedValueOnce({ type: "theme" })
			.mockResolvedValueOnce({ type: "experimental" })
			.mockResolvedValueOnce({ type: "back" });

		const result = await configureUnifiedSettingsController(createSettings(), {
			cloneDashboardSettings: (settings) => ({ ...settings }),
			cloneBackendPluginConfig: (config) => ({ ...config }),
			loadDashboardDisplaySettings: async () => createSettings(),
			loadPluginConfig: () => createConfig(),
			applyUiThemeFromDashboardSettings,
			promptSettingsHub,
			configureDashboardDisplaySettings: async (current) => current,
			configureStatuslineSettings: async (current) => current,
			promptStartupSettings: async () => ({
				menuShowStatusBadge: true,
				autoPickBestAccountOnLaunch: true,
			}),
			promptBehaviorSettings: async () => ({
				menuShowStatusBadge: false,
				autoPickBestAccountOnLaunch: true,
			}),
			promptThemeSettings: async () => ({
				menuShowStatusBadge: true,
				autoPickBestAccountOnLaunch: true,
			}),
			dashboardSettingsEqual: (left, right) =>
				left.menuShowStatusBadge === right.menuShowStatusBadge &&
				left.autoPickBestAccountOnLaunch === right.autoPickBestAccountOnLaunch,
			persistDashboardSettingsSelection,
			promptExperimentalSettings: async () => ({ fetchTimeoutMs: 2000 }),
			backendSettingsEqual: (left, right) =>
				left.fetchTimeoutMs === right.fetchTimeoutMs,
			persistBackendConfigSelection,
			configureBackendSettings: async (config) => config,
			STARTUP_PANEL_KEYS: ["autoPickBestAccountOnLaunch"],
			BEHAVIOR_PANEL_KEYS: ["menuShowStatusBadge"],
			THEME_PANEL_KEYS: ["menuShowStatusBadge"],
		});

		expect(persistDashboardSettingsSelection).toHaveBeenCalledTimes(3);
		expect(persistDashboardSettingsSelection).toHaveBeenNthCalledWith(
			1,
			{
				menuShowStatusBadge: true,
				autoPickBestAccountOnLaunch: true,
			},
			["autoPickBestAccountOnLaunch"],
			"startup",
		);
		expect(persistBackendConfigSelection).toHaveBeenCalledWith(
			{ fetchTimeoutMs: 2000 },
			"experimental",
		);
		expect(applyUiThemeFromDashboardSettings).toHaveBeenCalled();
		expect(result.menuShowStatusBadge).toBe(true);
	});
});
