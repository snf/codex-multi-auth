export { saveFlaggedAccountsEntry } from "./flagged-save-entry.js";
export async function clearFlaggedAccountsEntry(params) {
    return params.withStorageLock(async () => {
        await params.clearFlaggedAccountsOnDisk({
            path: params.path,
            markerPath: params.markerPath,
            backupPaths: await params.getBackupPaths(),
            logError: params.logError,
        });
    });
}
//# sourceMappingURL=flagged-entry.js.map