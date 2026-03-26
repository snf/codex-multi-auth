export async function saveFlaggedAccountsEntry(params) {
    return params.withStorageLock(async () => {
        await params.saveUnlocked(params.storage);
    });
}
//# sourceMappingURL=flagged-save-entry.js.map