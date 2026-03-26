import { UI_COPY } from "../ui/copy.js";
export function getExperimentalSelectOptions(ui, help, onInput) {
    return {
        message: UI_COPY.settings.experimentalTitle,
        subtitle: UI_COPY.settings.experimentalSubtitle,
        help,
        clearScreen: true,
        theme: ui.theme,
        selectedEmphasis: "minimal",
        onInput,
    };
}
export function mapExperimentalMenuHotkey(raw) {
    if (raw === "1")
        return { type: "sync" };
    if (raw === "2")
        return { type: "backup" };
    if (raw === "3")
        return { type: "toggle-refresh-guardian" };
    if (raw === "[" || raw === "-")
        return { type: "decrease-refresh-interval" };
    if (raw === "]" || raw === "+")
        return { type: "increase-refresh-interval" };
    const lower = raw.toLowerCase();
    if (lower === "q")
        return { type: "back" };
    if (lower === "s")
        return { type: "save" };
    return undefined;
}
export function mapExperimentalStatusHotkey(raw) {
    return raw.toLowerCase() === "q" ? { type: "back" } : undefined;
}
//# sourceMappingURL=experimental-settings-schema.js.map