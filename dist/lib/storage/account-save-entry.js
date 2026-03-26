export async function saveAccountsEntry(params) {
    return params.withStorageLock(async () => {
        await params.saveUnlocked(params.storage);
    });
}
//# sourceMappingURL=account-save-entry.js.map