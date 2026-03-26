import { resolveEntitlementAccountKey } from "../entitlement-cache.js";
export function buildCapabilityBoostByAccount(input) {
    const boosts = new Array(Math.max(0, input.accountCount));
    const accountSnapshotList = typeof input.accountSnapshotSource.getAccountsSnapshot === "function"
        ? (input.accountSnapshotSource.getAccountsSnapshot() ?? [])
        : [];
    if (accountSnapshotList.length === 0 &&
        typeof input.accountSnapshotSource.getAccountByIndex === "function") {
        for (let accountSnapshotIndex = 0; accountSnapshotIndex < input.accountCount; accountSnapshotIndex += 1) {
            const candidate = input.accountSnapshotSource.getAccountByIndex(accountSnapshotIndex);
            if (candidate)
                accountSnapshotList.push(candidate);
        }
    }
    for (const candidate of accountSnapshotList) {
        if (!Number.isInteger(candidate.index) ||
            candidate.index < 0 ||
            candidate.index >= boosts.length) {
            continue;
        }
        const accountKey = resolveEntitlementAccountKey(candidate);
        boosts[candidate.index] = input.getBoost(accountKey, input.model ?? input.modelFamily);
    }
    return boosts;
}
//# sourceMappingURL=capability-boost.js.map