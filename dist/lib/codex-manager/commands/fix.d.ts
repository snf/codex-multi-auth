import type { DashboardDisplaySettings } from "../../dashboard-settings.js";
import type { ForecastAccountResult, ForecastRecommendation } from "../../forecast.js";
import type { QuotaCacheData } from "../../quota-cache.js";
import type { CodexQuotaSnapshot } from "../../quota-probe.js";
import type { AccountStorageV3 } from "../../storage.js";
import type { TokenFailure, TokenResult } from "../../types.js";
export interface FixCliOptions {
    dryRun: boolean;
    json: boolean;
    live: boolean;
    model: string;
}
type ParsedArgsResult<T> = {
    ok: true;
    options: T;
} | {
    ok: false;
    message: string;
};
type QuotaEmailFallbackState = ReadonlyMap<string, {
    matchingCount: number;
    distinctAccountIds: Set<string>;
}>;
type FixOutcome = "healthy" | "disabled-hard-failure" | "warning-soft-failure" | "already-disabled";
export interface FixAccountReport {
    index: number;
    label: string;
    outcome: FixOutcome;
    message: string;
}
export interface FixCommandDeps {
    setStoragePath: (path: string | null) => void;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    parseFixArgs: (args: string[]) => ParsedArgsResult<FixCliOptions>;
    printFixUsage: () => void;
    loadQuotaCache: () => Promise<QuotaCacheData | null>;
    saveQuotaCache: (cache: QuotaCacheData) => Promise<void>;
    cloneQuotaCacheData: (cache: QuotaCacheData) => QuotaCacheData;
    buildQuotaEmailFallbackState: (accounts: AccountStorageV3["accounts"]) => QuotaEmailFallbackState;
    updateQuotaCacheForAccount: (cache: QuotaCacheData, account: AccountStorageV3["accounts"][number], snapshot: CodexQuotaSnapshot, accounts: AccountStorageV3["accounts"], emailFallbackState?: QuotaEmailFallbackState) => boolean;
    pruneUnsafeQuotaEmailCacheEntry: (cache: QuotaCacheData, previousEmail: string | undefined, accounts: AccountStorageV3["accounts"], emailFallbackState: QuotaEmailFallbackState) => boolean;
    resolveActiveIndex: (storage: AccountStorageV3, family?: "codex") => number;
    hasUsableAccessToken: (account: {
        accessToken?: string;
        expiresAt?: number;
    }, now: number) => boolean;
    fetchCodexQuotaSnapshot: (input: {
        accountId: string;
        accessToken: string;
        model: string;
    }) => Promise<CodexQuotaSnapshot>;
    formatCompactQuotaSnapshot: (snapshot: CodexQuotaSnapshot) => string;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    hasLikelyInvalidRefreshToken: (refreshToken: string) => boolean;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    sanitizeEmail: (email: string | undefined) => string | undefined;
    extractAccountEmail: (accessToken: string | undefined, idToken?: string | undefined) => string | undefined;
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    applyTokenAccountIdentity: (account: AccountStorageV3["accounts"][number], accountId: string | undefined) => boolean;
    isHardRefreshFailure: (result: Exclude<TokenResult, {
        type: "success";
    }>) => boolean;
    evaluateForecastAccounts: (inputs: Array<{
        index: number;
        account: AccountStorageV3["accounts"][number];
        isCurrent: boolean;
        now: number;
        refreshFailure?: TokenFailure;
    }>) => ForecastAccountResult[];
    recommendForecastAccount: (results: ForecastAccountResult[]) => ForecastRecommendation;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    formatAccountLabel: (account: AccountStorageV3["accounts"][number], index: number) => string;
    stylePromptText: (text: string, tone: "accent" | "success" | "warning" | "danger" | "muted") => string;
    formatResultSummary: (segments: ReadonlyArray<{
        text: string;
        tone: "accent" | "success" | "warning" | "danger" | "muted";
    }>) => string;
    styleAccountDetailText: (detail: string, fallbackTone?: "accent" | "success" | "warning" | "danger" | "muted") => string;
    defaultDisplay: DashboardDisplaySettings;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
    getNow?: () => number;
}
export declare function summarizeFixReports(reports: FixAccountReport[]): {
    healthy: number;
    disabled: number;
    warnings: number;
    skipped: number;
};
export declare function runFixCommand(args: string[], deps: FixCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=fix.d.ts.map