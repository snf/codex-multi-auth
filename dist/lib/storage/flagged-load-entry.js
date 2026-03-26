export async function loadFlaggedAccountsEntry(params) {
    const path = params.getFlaggedAccountsPath();
    return params.loadFlaggedAccountsState({
        path,
        legacyPath: params.getLegacyFlaggedAccountsPath(),
        resetMarkerPath: params.getIntentionalResetMarkerPath(path),
        normalizeFlaggedStorage: params.normalizeFlaggedStorage,
        saveFlaggedAccounts: params.saveFlaggedAccounts,
        logError: params.logError,
        logInfo: params.logInfo,
    });
}
//# sourceMappingURL=flagged-load-entry.js.map