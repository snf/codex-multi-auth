export async function saveAccountsToDisk(storage, params) {
    const tempPath = params.createTempPath();
    try {
        await params.ensureDirectory();
        await params.ensureGitignore();
        if (params.looksLikeSyntheticFixtureStorage(storage)) {
            const existing = await params.loadExistingStorage();
            if (existing &&
                existing.accounts.length > 0 &&
                !params.looksLikeSyntheticFixtureStorage(existing)) {
                throw params.createSyntheticFixtureError();
            }
        }
        if (params.storageBackupEnabled) {
            try {
                await params.createRotatingAccountsBackup(params.path);
            }
            catch (backupError) {
                params.logWarn("Failed to create account storage backup", {
                    path: params.path,
                    backupPath: params.backupPath,
                    error: String(backupError),
                });
            }
        }
        const content = JSON.stringify(storage, null, 2);
        await params.writeJournal(content, params.path);
        await params.writeTemp(tempPath, content);
        const stats = await params.statTemp(tempPath);
        if (stats.size === 0) {
            throw Object.assign(new Error("File written but size is 0"), {
                code: "EEMPTY",
            });
        }
        await params.renameTempToPath(tempPath);
        await params.cleanupResetMarker();
        params.onSaved();
        await params.cleanupWal();
    }
    catch (error) {
        await params.cleanupTemp(tempPath);
        params.logError("Failed to save accounts", {
            path: params.path,
            error: String(error),
        });
        throw params.createStorageError(error);
    }
}
//# sourceMappingURL=account-save.js.map