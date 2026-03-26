import { stdin as input, stdout as output } from "node:process";
import { getUiRuntimeOptions } from "../ui/runtime.js";
import { select } from "../ui/select.js";
export async function promptStatuslineSettingsPanel(initial, deps) {
    if (!input.isTTY || !output.isTTY)
        return null;
    const ui = getUiRuntimeOptions();
    let draft = deps.cloneDashboardSettings(initial);
    let focusKey = draft.menuStatuslineFields?.[0] ?? "last-used";
    while (true) {
        const preview = deps.buildAccountListPreview(draft, ui, focusKey);
        const selectedSet = new Set(deps.normalizeStatuslineFields(draft.menuStatuslineFields));
        const ordered = deps.normalizeStatuslineFields(draft.menuStatuslineFields);
        const orderMap = new Map();
        for (let index = 0; index < ordered.length; index += 1) {
            const key = ordered[index];
            if (key)
                orderMap.set(key, index + 1);
        }
        const optionItems = deps.STATUSLINE_FIELD_OPTIONS.map((option, index) => {
            const enabled = selectedSet.has(option.key);
            const rank = orderMap.get(option.key);
            return {
                label: `${deps.formatDashboardSettingState(enabled)} ${index + 1}. ${option.label}${rank ? ` (order ${rank})` : ""}`,
                hint: option.description,
                value: { type: "toggle", key: option.key },
                color: enabled ? "green" : "yellow",
            };
        });
        const items = [
            {
                label: deps.UI_COPY.settings.previewHeading,
                value: { type: "cancel" },
                kind: "heading",
            },
            {
                label: preview.label,
                hint: preview.hint,
                value: { type: "cancel" },
                color: "green",
                disabled: true,
                hideUnavailableSuffix: true,
            },
            { label: "", value: { type: "cancel" }, separator: true },
            {
                label: deps.UI_COPY.settings.displayHeading,
                value: { type: "cancel" },
                kind: "heading",
            },
            ...optionItems,
            { label: "", value: { type: "cancel" }, separator: true },
            {
                label: deps.UI_COPY.settings.moveUp,
                value: { type: "move-up", key: focusKey },
                color: "green",
            },
            {
                label: deps.UI_COPY.settings.moveDown,
                value: { type: "move-down", key: focusKey },
                color: "green",
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
        const initialCursor = items.findIndex((item) => item.value.type === "toggle" && item.value.key === focusKey);
        const updateFocusedPreview = (cursor) => {
            const focusedItem = items[cursor];
            const focused = focusedItem?.value.type === "toggle" ? focusedItem.value.key : focusKey;
            const nextPreview = deps.buildAccountListPreview(draft, ui, focused);
            const previewItem = items[1];
            if (!previewItem)
                return;
            previewItem.label = nextPreview.label;
            previewItem.hint = nextPreview.hint;
        };
        const result = await select(items, {
            message: deps.UI_COPY.settings.summaryTitle,
            subtitle: deps.UI_COPY.settings.summarySubtitle,
            help: deps.UI_COPY.settings.summaryHelp,
            clearScreen: true,
            theme: ui.theme,
            selectedEmphasis: "minimal",
            initialCursor: initialCursor >= 0 ? initialCursor : undefined,
            onCursorChange: ({ cursor }) => {
                const focusedItem = items[cursor];
                if (focusedItem?.value.type === "toggle")
                    focusKey = focusedItem.value.key;
                updateFocusedPreview(cursor);
            },
            onInput: (raw) => {
                const lower = raw.toLowerCase();
                if (lower === "q")
                    return { type: "cancel" };
                if (lower === "s")
                    return { type: "save" };
                if (lower === "r")
                    return { type: "reset" };
                if (lower === "[")
                    return { type: "move-up", key: focusKey };
                if (lower === "]")
                    return { type: "move-down", key: focusKey };
                const parsed = Number.parseInt(raw, 10);
                if (Number.isFinite(parsed) &&
                    parsed >= 1 &&
                    parsed <= deps.STATUSLINE_FIELD_OPTIONS.length) {
                    const target = deps.STATUSLINE_FIELD_OPTIONS[parsed - 1];
                    if (target)
                        return { type: "toggle", key: target.key };
                }
                return undefined;
            },
        });
        if (!result || result.type === "cancel")
            return null;
        if (result.type === "save")
            return draft;
        if (result.type === "reset") {
            draft = deps.applyDashboardDefaultsForKeys(draft, deps.STATUSLINE_PANEL_KEYS);
            focusKey = draft.menuStatuslineFields?.[0] ?? "last-used";
            continue;
        }
        if (result.type === "move-up") {
            draft = {
                ...draft,
                menuStatuslineFields: deps.reorderField(deps.normalizeStatuslineFields(draft.menuStatuslineFields), result.key, -1),
            };
            focusKey = result.key;
            continue;
        }
        if (result.type === "move-down") {
            draft = {
                ...draft,
                menuStatuslineFields: deps.reorderField(deps.normalizeStatuslineFields(draft.menuStatuslineFields), result.key, 1),
            };
            focusKey = result.key;
            continue;
        }
        focusKey = result.key;
        const fields = deps.normalizeStatuslineFields(draft.menuStatuslineFields);
        const isEnabled = fields.includes(result.key);
        if (isEnabled) {
            const next = fields.filter((field) => field !== result.key);
            draft = {
                ...draft,
                menuStatuslineFields: next.length > 0 ? next : [result.key],
            };
        }
        else {
            draft = { ...draft, menuStatuslineFields: [...fields, result.key] };
        }
    }
}
//# sourceMappingURL=statusline-settings-panel.js.map