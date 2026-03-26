import type { ManagedAccount, AccountManager } from "./accounts.js";
import type { ModelFamily } from "./prompts/codex.js";
export interface ProbeCandidate {
    account: ManagedAccount;
    controller: AbortController;
}
export interface ProbeResult<T> {
    type: "success" | "failure";
    account: ManagedAccount;
    response?: T;
    error?: Error;
}
export interface ParallelProbeOptions {
    maxConcurrency: number;
    timeoutMs: number;
}
export interface GetTopCandidatesParams {
    accountManager: AccountManager;
    modelFamily: ModelFamily;
    model: string | null;
    maxCandidates: number;
}
/**
 * Get top N candidates ranked by hybrid score WITHOUT mutating AccountManager state.
 * Uses getAccountsSnapshot() and ranks by health + tokens + freshness.
 */
export declare function getTopCandidates(params: GetTopCandidatesParams): ManagedAccount[];
export declare function getTopCandidates(accountManager: AccountManager, modelFamily: ModelFamily, model: string | null, maxCandidates: number): ManagedAccount[];
/**
 * Probe accounts in parallel with first-success-wins racing.
 * Immediately aborts losing candidates when a winner is found.
 */
export declare function probeAccountsInParallel<T>(candidates: ProbeCandidate[], probeFn: (account: ManagedAccount, signal: AbortSignal) => Promise<T>, _options?: Partial<ParallelProbeOptions>): Promise<ProbeResult<T> | null>;
export declare function createProbeCandidates(accounts: ManagedAccount[]): ProbeCandidate[];
//# sourceMappingURL=parallel-probe.d.ts.map