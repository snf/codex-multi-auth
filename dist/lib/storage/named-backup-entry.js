export async function exportNamedBackupEntry(params) {
    return params.exportNamedBackupFile(params.name, {
        getStoragePath: params.getStoragePath,
        exportAccounts: params.exportAccounts,
    }, params.options);
}
//# sourceMappingURL=named-backup-entry.js.map