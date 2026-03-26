import { stdin as input, stdout as output } from "node:process";
import type { DashboardDisplaySettings } from "../dashboard-settings.js";
import type { UI_COPY } from "../ui/copy.js";
import { getUiRuntimeOptions } from "../ui/runtime.js";
import { type MenuItem, select } from "../ui/select.js";

export type StartupConfigAction =
	| { type: "toggle-auto-pick-best-account-on-launch" }
	| { type: "reset" }
	| { type: "save" }
	| { type: "cancel" };

export interface StartupSettingsPanelDeps {
	cloneDashboardSettings: (
		settings: DashboardDisplaySettings,
	) => DashboardDisplaySettings;
	applyDashboardDefaultsForKeys: (
		draft: DashboardDisplaySettings,
		keys: readonly (keyof DashboardDisplaySettings)[],
	) => DashboardDisplaySettings;
	STARTUP_PANEL_KEYS: readonly (keyof DashboardDisplaySettings)[];
	UI_COPY: typeof UI_COPY;
}

export async function promptStartupSettingsPanel(
	initial: DashboardDisplaySettings,
	deps: StartupSettingsPanelDeps,
): Promise<DashboardDisplaySettings | null> {
	if (!input.isTTY || !output.isTTY) return null;
	const ui = getUiRuntimeOptions();
	let draft = deps.cloneDashboardSettings(initial);
	let focus: StartupConfigAction = {
		type: "toggle-auto-pick-best-account-on-launch",
	};

	while (true) {
		const autoPickBestAccountOnLaunch =
			draft.autoPickBestAccountOnLaunch ?? false;
		const items: MenuItem<StartupConfigAction>[] = [
			{
				label: `${autoPickBestAccountOnLaunch ? "[x]" : "[ ]"} Auto-pick best account on codex launch`,
				hint: "Runs the live best-account check before proxying to the real Codex CLI.",
				value: { type: "toggle-auto-pick-best-account-on-launch" },
				color: autoPickBestAccountOnLaunch ? "green" : "yellow",
			},
			{ label: "", value: { type: "cancel" }, separator: true },
			{
				label: deps.UI_COPY.settings.resetDefault,
				value: { type: "reset" },
				color: "yellow",
			},
			{
				label: deps.UI_COPY.settings.saveAndBack,
				value: { type: "save" },
				color: "green",
			},
			{
				label: deps.UI_COPY.settings.backNoSave,
				value: { type: "cancel" },
				color: "red",
			},
		];

		const initialCursor = items.findIndex((item) => item.value.type === focus.type);

		const result = await select<StartupConfigAction>(items, {
			message: deps.UI_COPY.settings.startupTitle,
			subtitle: deps.UI_COPY.settings.startupSubtitle,
			help: deps.UI_COPY.settings.startupHelp,
			clearScreen: true,
			theme: ui.theme,
			selectedEmphasis: "minimal",
			initialCursor: initialCursor >= 0 ? initialCursor : undefined,
			onCursorChange: ({ cursor }) => {
				const item = items[cursor];
				if (item && !item.separator && item.kind !== "heading") {
					focus = item.value;
				}
			},
			onInput: (raw) => {
				const lower = raw.toLowerCase();
				if (lower === "q") return { type: "cancel" };
				if (lower === "s") return { type: "save" };
				if (lower === "r") return { type: "reset" };
				if (lower === "b" || raw === "1") {
					return { type: "toggle-auto-pick-best-account-on-launch" };
				}
				return undefined;
			},
		});

		if (!result || result.type === "cancel") return null;
		if (result.type === "save") return draft;
		if (result.type === "reset") {
			draft = deps.applyDashboardDefaultsForKeys(
				draft,
				deps.STARTUP_PANEL_KEYS,
			);
			focus = { type: "toggle-auto-pick-best-account-on-launch" };
			continue;
		}
		draft = {
			...draft,
			autoPickBestAccountOnLaunch:
				!(draft.autoPickBestAccountOnLaunch ?? false),
		};
		focus = result;
	}
}
