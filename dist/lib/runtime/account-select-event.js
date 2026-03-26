let accountSelectWriteQueue = Promise.resolve();
function serializeAccountSelectMutation(task) {
    const run = accountSelectWriteQueue.then(task, task);
    accountSelectWriteQueue = run.then(() => undefined, () => undefined);
    return run;
}
export async function handleAccountSelectEvent(input) {
    const { event } = input;
    if (event.type !== "account.select" &&
        event.type !== "openai.account.select") {
        return false;
    }
    const props = typeof event.properties === "object" && event.properties !== null
        ? event.properties
        : {};
    const provider = typeof props.provider === "string" ? props.provider : undefined;
    if (provider && provider !== "openai" && provider !== input.providerId) {
        return false;
    }
    const rawIndex = props.index ?? props.accountIndex;
    if (!Number.isInteger(rawIndex))
        return true;
    const index = rawIndex;
    return serializeAccountSelectMutation(async () => {
        const storage = await input.loadAccounts();
        if (!storage || index < 0 || index >= storage.accounts.length) {
            return true;
        }
        const now = Date.now();
        const account = storage.accounts[index];
        if (account) {
            account.lastUsed = now;
            account.lastSwitchReason = "rotation";
        }
        storage.activeIndex = index;
        storage.activeIndexByFamily = storage.activeIndexByFamily ?? {};
        for (const family of input.modelFamilies) {
            storage.activeIndexByFamily[family] = index;
        }
        await input.saveAccounts(storage);
        const manager = input.getCachedAccountManager();
        if (manager) {
            await manager.syncCodexCliActiveSelectionForIndex(index);
        }
        input.setLastCodexCliActiveSyncIndex(index);
        if (input.getCachedAccountManager()) {
            await input.reloadAccountManagerFromDisk();
        }
        await input.showToast(`Switched to account ${index + 1}`, "info");
        return true;
    });
}
//# sourceMappingURL=account-select-event.js.map