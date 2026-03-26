export async function promptSettingsHubMenu(initialFocus, deps) {
    if (!deps.isInteractive())
        return null;
    const ui = deps.getUiRuntimeOptions();
    const items = deps.buildItems();
    const initialCursor = deps.findInitialCursor(items, initialFocus);
    return deps.select(items, {
        message: deps.copy.title,
        subtitle: deps.copy.subtitle,
        help: deps.copy.help,
        clearScreen: true,
        theme: ui.theme,
        selectedEmphasis: "minimal",
        initialCursor,
        onInput: (raw) => {
            const lower = raw.toLowerCase();
            if (lower === "q")
                return { type: "back" };
            return undefined;
        },
    });
}
//# sourceMappingURL=settings-hub-prompt.js.map