import { AsyncLocalStorage } from "node:async_hooks";
let storageMutex = Promise.resolve();
const transactionSnapshotContext = new AsyncLocalStorage();
export function getTransactionSnapshotState() {
    return transactionSnapshotContext.getStore();
}
export function runInTransactionSnapshotContext(state, fn) {
    return transactionSnapshotContext.run(state, fn);
}
export function withStorageLock(fn) {
    const previousMutex = storageMutex;
    let releaseLock;
    storageMutex = new Promise((resolve) => {
        releaseLock = resolve;
    });
    return previousMutex.then(fn).finally(() => releaseLock());
}
export async function withAccountStorageTransaction(handler, deps) {
    return withStorageLock(async () => {
        const state = {
            snapshot: await deps.loadCurrent(),
            storagePath: deps.getStoragePath(),
            active: true,
        };
        const current = state.snapshot;
        const persist = async (storage) => {
            await deps.saveAccounts(storage);
            state.snapshot = storage;
        };
        return transactionSnapshotContext.run(state, () => handler(current, persist));
    });
}
export async function withAccountAndFlaggedStorageTransaction(handler, deps) {
    return withStorageLock(async () => {
        const state = {
            snapshot: await deps.loadCurrent(),
            storagePath: deps.getStoragePath(),
            active: true,
        };
        const current = state.snapshot;
        const persist = async (accountStorage, flaggedStorage) => {
            const previousAccounts = deps.cloneAccountStorageForPersistence(state.snapshot);
            const nextAccounts = deps.cloneAccountStorageForPersistence(accountStorage);
            await deps.saveAccounts(nextAccounts);
            try {
                await deps.saveFlaggedAccounts(flaggedStorage);
                state.snapshot = nextAccounts;
            }
            catch (error) {
                try {
                    await deps.saveAccounts(previousAccounts);
                    state.snapshot = previousAccounts;
                }
                catch (rollbackError) {
                    deps.logRollbackError(error, rollbackError);
                    throw new AggregateError([error, rollbackError], "Flagged save failed and account storage rollback also failed");
                }
                throw error;
            }
        };
        return transactionSnapshotContext.run(state, () => handler(current, persist));
    });
}
//# sourceMappingURL=transactions.js.map