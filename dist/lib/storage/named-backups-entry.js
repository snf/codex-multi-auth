export async function getNamedBackupsEntry(params) {
    return params.collectNamedBackups(params.getStoragePath(), {
        loadAccountsFromPath: params.loadAccountsFromPath,
        logDebug: params.logDebug,
    });
}
//# sourceMappingURL=named-backups-entry.js.map