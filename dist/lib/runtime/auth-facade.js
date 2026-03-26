export async function runRuntimeOAuthFlow(forceNewLogin, deps) {
    const pluginPrefix = `[${deps.pluginName}]`;
    const prefixLogMessage = (message, options) => {
        if (message.startsWith(pluginPrefix) ||
            message.startsWith(`\n${pluginPrefix}`)) {
            return message;
        }
        return options?.leadingNewline
            ? `\n${pluginPrefix} ${message}`
            : `${pluginPrefix} ${message}`;
    };
    return deps.runBrowserOAuthFlow({
        forceNewLogin,
        manualModeLabel: deps.manualModeLabel,
        logInfo: deps.logInfo,
        logDebug: (message) => deps.logDebug(prefixLogMessage(message)),
        logWarn: (message) => deps.logWarn(prefixLogMessage(message, { leadingNewline: true })),
    });
}
export function createPersistAccounts(deps) {
    return async (results, replaceAll = false) => deps.persistAccountPoolResults({
        results,
        replaceAll,
        modelFamilies: deps.modelFamilies,
        withAccountStorageTransaction: deps.withAccountStorageTransaction,
        findMatchingAccountIndex: deps.findMatchingAccountIndex,
        extractAccountId: deps.extractAccountId,
        extractAccountEmail: deps.extractAccountEmail,
        sanitizeEmail: deps.sanitizeEmail,
    });
}
export function createAccountManagerReloader(deps) {
    return async (authFallback) => {
        const inFlight = deps.getReloadInFlight();
        if (inFlight) {
            return inFlight;
        }
        return deps.reloadRuntimeAccountManager({
            currentReloadInFlight: inFlight,
            loadFromDisk: deps.loadFromDisk,
            setCachedAccountManager: deps.setCachedAccountManager,
            setAccountManagerPromise: deps.setAccountManagerPromise,
            setReloadInFlight: deps.setReloadInFlight,
            authFallback,
        });
    };
}
//# sourceMappingURL=auth-facade.js.map