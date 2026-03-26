export async function clearAccountsEntry(params) {
    return params.withStorageLock(async () => {
        await params.clearAccountStorageArtifacts({
            path: params.path,
            resetMarkerPath: params.resetMarkerPath,
            walPath: params.walPath,
            backupPaths: await params.getBackupPaths(),
            logError: params.logError,
        });
    });
}
//# sourceMappingURL=account-clear-entry.js.map