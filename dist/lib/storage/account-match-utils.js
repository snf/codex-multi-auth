export function selectNewestAccount(current, candidate) {
    if (!current)
        return candidate;
    const currentLastUsed = current.lastUsed || 0;
    const candidateLastUsed = candidate.lastUsed || 0;
    if (candidateLastUsed > currentLastUsed)
        return candidate;
    if (candidateLastUsed < currentLastUsed)
        return current;
    const currentAddedAt = current.addedAt || 0;
    const candidateAddedAt = candidate.addedAt || 0;
    return candidateAddedAt >= currentAddedAt ? candidate : current;
}
export function collectDistinctIdentityValues(values) {
    const distinct = new Set();
    for (const value of values) {
        if (value)
            distinct.add(value);
    }
    return distinct;
}
export function findNewestMatchingIndex(accounts, toRef, predicate, selectNewest) {
    let matchIndex;
    let match;
    for (let i = 0; i < accounts.length; i += 1) {
        const account = accounts[i];
        if (!account)
            continue;
        const ref = toRef(account);
        if (!predicate(ref))
            continue;
        if (matchIndex === undefined) {
            matchIndex = i;
            match = account;
            continue;
        }
        const newest = selectNewest(match, account);
        if (newest === account) {
            matchIndex = i;
            match = account;
        }
    }
    return matchIndex;
}
//# sourceMappingURL=account-match-utils.js.map