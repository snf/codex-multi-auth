export async function promptSettingsHubEntry(params) {
    return params.promptSettingsHubMenu(params.initialFocus, {
        isInteractive: params.isInteractive,
        getUiRuntimeOptions: params.getUiRuntimeOptions,
        buildItems: params.buildItems,
        findInitialCursor: params.findInitialCursor,
        select: params.select,
        copy: params.copy,
    });
}
//# sourceMappingURL=settings-hub-entry.js.map