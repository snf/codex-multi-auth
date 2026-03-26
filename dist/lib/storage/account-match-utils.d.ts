type AccountLike = {
    addedAt?: number;
    lastUsed?: number;
};
export declare function selectNewestAccount<T extends AccountLike>(current: T | undefined, candidate: T): T;
export declare function collectDistinctIdentityValues(values: Array<string | undefined>): Set<string>;
export declare function findNewestMatchingIndex<T, TRef>(accounts: readonly T[], toRef: (account: T) => TRef, predicate: (ref: TRef) => boolean, selectNewest: (current: T | undefined, candidate: T) => T): number | undefined;
export {};
//# sourceMappingURL=account-match-utils.d.ts.map