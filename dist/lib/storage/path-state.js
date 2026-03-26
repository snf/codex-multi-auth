import { AsyncLocalStorage } from "node:async_hooks";
const storagePathStateContext = new AsyncLocalStorage();
let currentStorageState = {
    currentStoragePath: null,
    currentLegacyProjectStoragePath: null,
    currentLegacyWorktreeStoragePath: null,
    currentProjectRoot: null,
};
export function getStoragePathState() {
    // Keep the last synchronously assigned state as a fallback until enterWith()
    // has propagated through the current async chain. This is intentionally a
    // best-effort bridge for immediate reads; callers should still set state
    // before spawning child work and treat AsyncLocalStorage as the source of truth.
    return storagePathStateContext.getStore() ?? currentStorageState;
}
export function setStoragePathState(state) {
    currentStorageState = state;
    storagePathStateContext.enterWith(state);
}
//# sourceMappingURL=path-state.js.map