import { type QuotaCacheData } from "../quota-cache.js";
import { fetchCodexQuotaSnapshot } from "../quota-probe.js";
import { type AccountMetadataV3, type AccountStorageV3 } from "../storage.js";
import type { ModelFamily } from "../prompts/codex.js";
type PromptTone = "accent" | "success" | "warning" | "danger" | "muted";
type QuotaEmailFallbackState = {
    matchingCount: number;
    distinctAccountIds: Set<string>;
};
type QuotaCacheAccountRef = Pick<AccountMetadataV3, "accountId"> & {
    email?: string;
};
export interface ForecastCliOptions {
    live: boolean;
    json: boolean;
    model: string;
}
export interface ReportCliOptions {
    live: boolean;
    json: boolean;
    model: string;
    outPath?: string;
}
type ParsedArgsResult<T> = {
    ok: true;
    options: T;
} | {
    ok: false;
    message: string;
};
export interface ForecastReportCommandDeps {
    stylePromptText: (text: string, tone: PromptTone) => string;
    styleQuotaSummary: (summary: string) => string;
    formatResultSummary: (segments: ReadonlyArray<{
        text: string;
        tone: PromptTone;
    }>) => string;
    resolveActiveIndex: (storage: AccountStorageV3, family?: ModelFamily) => number;
    hasUsableAccessToken: (account: AccountMetadataV3, now: number) => boolean;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    buildQuotaEmailFallbackState: (accounts: readonly QuotaCacheAccountRef[]) => ReadonlyMap<string, QuotaEmailFallbackState>;
    updateQuotaCacheForAccount: (cache: QuotaCacheData, account: QuotaCacheAccountRef, snapshot: Awaited<ReturnType<typeof fetchCodexQuotaSnapshot>>, accounts: readonly QuotaCacheAccountRef[], emailFallbackState?: ReadonlyMap<string, QuotaEmailFallbackState>) => boolean;
    cloneQuotaCacheData: (cache: QuotaCacheData) => QuotaCacheData;
    formatCompactQuotaSnapshot: (snapshot: Awaited<ReturnType<typeof fetchCodexQuotaSnapshot>>) => string;
    formatRateLimitEntry: (account: AccountMetadataV3, now: number, family: ModelFamily) => string | null;
}
export declare function printForecastUsage(): void;
export declare function printReportUsage(): void;
export declare function parseForecastArgs(args: string[]): ParsedArgsResult<ForecastCliOptions>;
export declare function parseReportArgs(args: string[]): ParsedArgsResult<ReportCliOptions>;
export declare function runForecast(args: string[], deps: ForecastReportCommandDeps): Promise<number>;
export declare function runReport(args: string[], deps: ForecastReportCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=forecast-report-commands.d.ts.map