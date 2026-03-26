export function createEmptyStorageWithRestoreMetadata(restoreEligible, restoreReason) {
    return {
        version: 3,
        accounts: [],
        activeIndex: 0,
        activeIndexByFamily: {},
        restoreEligible,
        restoreReason,
    };
}
export function withRestoreMetadata(storage, restoreEligible, restoreReason) {
    return {
        ...storage,
        restoreEligible,
        restoreReason,
    };
}
//# sourceMappingURL=restore-metadata.js.map