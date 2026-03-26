import { handleAccountSelectEvent } from "./account-select-event.js";
export function createRuntimeEventHandler(deps) {
    return async (input) => {
        try {
            const handled = await deps.handleAccountSelectEvent({
                event: input.event,
                providerId: deps.providerId,
                loadAccounts: deps.loadAccounts,
                saveAccounts: deps.saveAccounts,
                modelFamilies: deps.modelFamilies,
                cachedAccountManager: deps.getCachedAccountManager(),
                reloadAccountManagerFromDisk: deps.reloadAccountManagerFromDisk,
                setLastCodexCliActiveSyncIndex: deps.setLastCodexCliActiveSyncIndex,
                showToast: deps.showToast,
            });
            if (handled)
                return;
        }
        catch (error) {
            deps.logDebug(`[${deps.pluginName}] Event handler error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };
}
export async function handleRuntimeEvent(params) {
    try {
        await handleAccountSelectEvent({
            event: params.input.event,
            providerId: params.providerId,
            loadAccounts: params.loadAccounts,
            saveAccounts: params.saveAccounts,
            modelFamilies: params.modelFamilies,
            getCachedAccountManager: () => params.hasCachedAccountManager()
                ? {
                    syncCodexCliActiveSelectionForIndex: params.syncCodexCliActiveSelectionForIndex,
                }
                : null,
            reloadAccountManagerFromDisk: params.reloadAccountManagerFromDisk,
            setLastCodexCliActiveSyncIndex: params.setLastCodexCliActiveSyncIndex,
            showToast: params.showToast,
        });
    }
    catch (error) {
        params.logDebug(`[${params.pluginName}] Event handler error: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=event-handler.js.map