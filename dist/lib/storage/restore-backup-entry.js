export async function restoreAccountsFromBackupEntry(params) {
    return params.restoreAccountsFromBackupPath(params.path, {
        persist: params.options?.persist,
        backupRoot: params.getNamedBackupRoot(params.getStoragePath()),
        realpath: params.realpath,
        loadAccountsFromPath: params.loadAccountsFromPath,
        saveAccounts: params.saveAccounts,
    });
}
//# sourceMappingURL=restore-backup-entry.js.map