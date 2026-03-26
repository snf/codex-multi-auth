export async function exportAccountsSnapshot(params) {
    const storage = params.transactionState?.active &&
        params.transactionState.storagePath === params.currentStoragePath
        ? params.transactionState.snapshot
        : params.transactionState?.active
            ? await params.readCurrentStorageUnlocked()
            : await params.readCurrentStorage();
    await params.exportAccountsToFile({
        resolvedPath: params.resolvedPath,
        force: params.force,
        storage,
        beforeCommit: params.beforeCommit,
        logInfo: params.logInfo,
    });
}
export async function importAccountsSnapshot(params) {
    const normalized = await params.readImportFile({
        resolvedPath: params.resolvedPath,
        normalizeAccountStorage: params.normalizeAccountStorage,
    });
    const result = await params.withAccountStorageTransaction(async (existing, persist) => {
        const merged = params.mergeImportedAccounts({
            existing,
            imported: normalized,
            maxAccounts: params.maxAccounts,
            deduplicateAccounts: params.deduplicateAccounts,
        });
        await persist(merged.newStorage);
        return {
            imported: merged.imported,
            total: merged.total,
            skipped: merged.skipped,
        };
    });
    params.logInfo("Imported accounts", {
        path: params.resolvedPath,
        imported: result.imported,
        skipped: result.skipped,
        total: result.total,
    });
    return result;
}
//# sourceMappingURL=account-port.js.map