export function resolveFocusedBackendNumberKey(focus, numberOptions) {
    const numberKeys = new Set(numberOptions.map((option) => option.key));
    if (focus && numberKeys.has(focus)) {
        return focus;
    }
    return numberOptions[0]?.key ?? "fetchTimeoutMs";
}
export function getBackendCategory(key, categoryOptions) {
    return categoryOptions.find((category) => category.key === key) ?? null;
}
export function getBackendCategoryInitialFocus(category) {
    const firstToggle = category.toggleKeys[0];
    if (firstToggle)
        return firstToggle;
    return category.numberKeys[0] ?? null;
}
export function applyBackendCategoryDefaults(draft, category, deps) {
    const next = { ...draft };
    for (const key of category.toggleKeys) {
        next[key] = deps.backendDefaults[key] ?? false;
    }
    for (const key of category.numberKeys) {
        const option = deps.numberOptionByKey.get(key);
        const fallback = option?.min ?? 0;
        next[key] = deps.backendDefaults[key] ?? fallback;
    }
    return next;
}
//# sourceMappingURL=backend-category-helpers.js.map