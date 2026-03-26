export interface SessionAffinityOptions {
    ttlMs?: number;
    maxEntries?: number;
}
/**
 * Tracks preferred account index per session so follow-up turns stay on the
 * same account until it becomes unhealthy or stale.
 */
export declare class SessionAffinityStore {
    private readonly ttlMs;
    private readonly maxEntries;
    private readonly entries;
    constructor(options?: SessionAffinityOptions);
    getPreferredAccountIndex(sessionKey: string | null | undefined, now?: number): number | null;
    remember(sessionKey: string | null | undefined, accountIndex: number, now?: number): void;
    getLastResponseId(sessionKey: string | null | undefined, now?: number): string | null;
    /**
     * Update the last response id for an existing live session.
     *
     * This method does not create a new affinity entry; callers that need to
     * upsert continuation state should use `rememberWithResponseId`.
     */
    rememberLastResponseId(sessionKey: string | null | undefined, responseId: string | null | undefined, now?: number): void;
    updateLastResponseId(sessionKey: string | null | undefined, responseId: string | null | undefined, now?: number): void;
    forgetSession(sessionKey: string | null | undefined): void;
    forgetAccount(accountIndex: number): number;
    reindexAfterRemoval(removedIndex: number): number;
    prune(now?: number): number;
    size(): number;
    private setEntry;
    private findOldestKey;
}
//# sourceMappingURL=session-affinity.d.ts.map