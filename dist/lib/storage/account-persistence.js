export function cloneAccountStorageForPersistence(storage) {
    return {
        version: 3,
        accounts: structuredClone(storage?.accounts ?? []),
        activeIndex: typeof storage?.activeIndex === "number" &&
            Number.isFinite(storage.activeIndex)
            ? storage.activeIndex
            : 0,
        activeIndexByFamily: structuredClone(storage?.activeIndexByFamily ?? {}),
    };
}
//# sourceMappingURL=account-persistence.js.map