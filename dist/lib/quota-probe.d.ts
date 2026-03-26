export interface CodexQuotaWindow {
    usedPercent?: number;
    windowMinutes?: number;
    resetAtMs?: number;
}
export interface CodexQuotaSnapshot {
    status: number;
    planType?: string;
    activeLimit?: number;
    primary: CodexQuotaWindow;
    secondary: CodexQuotaWindow;
    model: string;
}
/**
 * Produce a single-line human-readable summary of a Codex quota snapshot.
 *
 * This pure, deterministic formatter is safe for concurrent use, performs no
 * filesystem side effects (including on Windows), and never exposes secret
 * tokens or other sensitive values.
 *
 * @param snapshot - The quota snapshot to format
 * @returns A concise, comma-separated summary describing primary and secondary windows, optional plan and active limit, and `rate-limited` when the status is 429
 */
export declare function formatQuotaSnapshotLine(snapshot: CodexQuotaSnapshot): string;
export interface ProbeCodexQuotaOptions {
    accountId: string;
    accessToken: string;
    model?: string;
    fallbackModels?: readonly string[];
    timeoutMs?: number;
}
/**
 * Probe Codex models sequentially to obtain a quota snapshot for the specified account.
 *
 * Concurrency: models are probed one-at-a-time (no parallel requests).
 * Filesystem: performs no filesystem access and makes no Windows filesystem calls.
 * Security: `accessToken` is sent in request headers and is treated as sensitive; tokens are not persisted or written to disk.
 *
 * @param options - Probe options including:
 *   - accountId: account identifier used for Codex requests
 *   - accessToken: bearer token for authentication (sensitive)
 *   - model: optional preferred model name to probe first
 *   - fallbackModels: optional list of fallback model names to try
 *   - timeoutMs: optional per-model timeout in milliseconds (bounded between 1000 and 60000; default 15000)
 * @returns The first CodexQuotaSnapshot parsed from response quota headers, augmented with the model that produced it.
 * @throws If no candidate model produces a quota snapshot, throws the last encountered error or a generic failure error.
 */
export declare function fetchCodexQuotaSnapshot(options: ProbeCodexQuotaOptions): Promise<CodexQuotaSnapshot>;
//# sourceMappingURL=quota-probe.d.ts.map