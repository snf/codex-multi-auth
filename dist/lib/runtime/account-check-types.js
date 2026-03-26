export function createAccountCheckWorkingState(flaggedStorage) {
    return {
        storageChanged: false,
        flaggedChanged: false,
        ok: 0,
        errors: 0,
        disabled: 0,
        removeFromActive: new Set(),
        flaggedStorage,
    };
}
//# sourceMappingURL=account-check-types.js.map