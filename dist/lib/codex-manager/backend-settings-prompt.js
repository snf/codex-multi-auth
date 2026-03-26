export async function promptBackendSettingsMenu(params) {
    if (!params.isInteractive())
        return null;
    let draft = params.cloneBackendPluginConfig(params.initial);
    let activeCategory = params.backendCategoryOptions[0]?.key ?? "session-sync";
    const focusByCategory = {};
    for (const category of params.backendCategoryOptions) {
        focusByCategory[category.key] =
            params.getBackendCategoryInitialFocus(category);
    }
    while (true) {
        const previewFocus = focusByCategory[activeCategory] ?? null;
        const preview = params.buildBackendSettingsPreview(draft, params.ui, previewFocus, {
            highlightPreviewToken: params.highlightPreviewToken,
        });
        const categoryItems = params.backendCategoryOptions.map((category, index) => ({
            label: `${index + 1}. ${category.label}`,
            hint: category.description,
            value: { type: "open-category", key: category.key },
            color: "green",
        }));
        const items = [
            {
                label: params.copy.previewHeading,
                value: { type: "cancel" },
                kind: "heading",
            },
            {
                label: preview.label,
                hint: preview.hint,
                value: { type: "cancel" },
                disabled: true,
                color: "green",
                hideUnavailableSuffix: true,
            },
            { label: "", value: { type: "cancel" }, separator: true },
            {
                label: params.copy.backendCategoriesHeading,
                value: { type: "cancel" },
                kind: "heading",
            },
            ...categoryItems,
            { label: "", value: { type: "cancel" }, separator: true },
            {
                label: params.copy.resetDefault,
                value: { type: "reset" },
                color: "yellow",
            },
            {
                label: params.copy.saveAndBack,
                value: { type: "save" },
                color: "green",
            },
            {
                label: params.copy.backNoSave,
                value: { type: "cancel" },
                color: "red",
            },
        ];
        const initialCursor = items.findIndex((item) => {
            if (item.separator || item.disabled || item.kind === "heading")
                return false;
            return (item.value.type === "open-category" && item.value.key === activeCategory);
        });
        const result = await params.select(items, {
            message: params.copy.backendTitle,
            subtitle: params.copy.backendSubtitle,
            help: params.copy.backendHelp,
            clearScreen: true,
            theme: params.ui.theme,
            selectedEmphasis: "minimal",
            initialCursor: initialCursor >= 0 ? initialCursor : undefined,
            onCursorChange: ({ cursor }) => {
                const focusedItem = items[cursor];
                if (focusedItem?.value.type === "open-category") {
                    activeCategory = focusedItem.value.key;
                }
            },
            onInput: (raw) => {
                const lower = raw.toLowerCase();
                if (lower === "q")
                    return { type: "cancel" };
                if (lower === "s")
                    return { type: "save" };
                if (lower === "r")
                    return { type: "reset" };
                const parsed = Number.parseInt(raw, 10);
                if (Number.isFinite(parsed) &&
                    parsed >= 1 &&
                    parsed <= params.backendCategoryOptions.length) {
                    const target = params.backendCategoryOptions[parsed - 1];
                    if (target)
                        return { type: "open-category", key: target.key };
                }
                return undefined;
            },
        });
        if (!result || result.type === "cancel")
            return null;
        if (result.type === "save")
            return draft;
        if (result.type === "reset") {
            draft = params.cloneBackendPluginConfig(params.backendDefaults);
            for (const category of params.backendCategoryOptions) {
                focusByCategory[category.key] =
                    params.getBackendCategoryInitialFocus(category);
            }
            activeCategory = params.backendCategoryOptions[0]?.key ?? activeCategory;
            continue;
        }
        const category = params.getBackendCategory(result.key, params.backendCategoryOptions);
        if (!category)
            continue;
        activeCategory = category.key;
        const categoryResult = await params.promptBackendCategorySettings(draft, category, focusByCategory[category.key] ??
            params.getBackendCategoryInitialFocus(category));
        draft = categoryResult.draft;
        focusByCategory[category.key] = categoryResult.focusKey;
    }
}
//# sourceMappingURL=backend-settings-prompt.js.map