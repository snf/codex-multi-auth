import type { DashboardDisplaySettings } from "../../dashboard-settings.js";
import { type ForecastAccountResult } from "../../forecast.js";
import type { QuotaCacheData } from "../../quota-cache.js";
import type { CodexQuotaSnapshot } from "../../quota-probe.js";
import type { AccountMetadataV3, AccountStorageV3 } from "../../storage.js";
import type { TokenFailure, TokenResult } from "../../types.js";
type PromptTone = "accent" | "success" | "warning" | "danger" | "muted";
type QuotaEmailFallbackState = ReadonlyMap<string, {
    matchingCount: number;
    distinctAccountIds: Set<string>;
}>;
export interface ForecastCommandDeps {
    setStoragePath: (path: string | null) => void;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    loadDashboardDisplaySettings?: () => Promise<DashboardDisplaySettings>;
    resolveActiveIndex: (storage: AccountStorageV3, family?: "codex") => number;
    loadQuotaCache: () => Promise<QuotaCacheData | null>;
    saveQuotaCache: (cache: QuotaCacheData) => Promise<void>;
    cloneQuotaCacheData: (cache: QuotaCacheData) => QuotaCacheData;
    buildQuotaEmailFallbackState: (accounts: readonly Pick<AccountMetadataV3, "accountId" | "email">[]) => QuotaEmailFallbackState;
    updateQuotaCacheForAccount: (cache: QuotaCacheData, account: Pick<AccountMetadataV3, "accountId" | "email">, snapshot: CodexQuotaSnapshot, accounts: readonly Pick<AccountMetadataV3, "accountId" | "email">[], emailFallbackState?: QuotaEmailFallbackState) => boolean;
    hasUsableAccessToken: (account: Pick<AccountMetadataV3, "accessToken" | "expiresAt">, now: number) => boolean;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    fetchCodexQuotaSnapshot: (input: {
        accountId: string;
        accessToken: string;
        model: string;
    }) => Promise<CodexQuotaSnapshot>;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    formatAccountLabel: (account: Pick<AccountMetadataV3, "email" | "accountLabel" | "accountId">, index: number) => string;
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    evaluateForecastAccounts: (inputs: Array<{
        index: number;
        account: AccountMetadataV3;
        isCurrent: boolean;
        now: number;
        refreshFailure?: TokenFailure;
        liveQuota?: CodexQuotaSnapshot;
    }>) => ForecastAccountResult[];
    summarizeForecast: (results: ForecastAccountResult[]) => {
        total: number;
        ready: number;
        delayed: number;
        unavailable: number;
        highRisk: number;
    };
    recommendForecastAccount: (results: ForecastAccountResult[]) => {
        recommendedIndex: number | null;
        reason: string;
    };
    stylePromptText: (text: string, tone: PromptTone) => string;
    formatResultSummary: (segments: ReadonlyArray<{
        text: string;
        tone: PromptTone;
    }>) => string;
    styleQuotaSummary: (summary: string) => string;
    formatCompactQuotaSnapshot: (snapshot: CodexQuotaSnapshot) => string;
    availabilityTone: (availability: ForecastAccountResult["availability"]) => "success" | "warning" | "danger";
    riskTone: (level: ForecastAccountResult["riskLevel"]) => "success" | "warning" | "danger";
    formatWaitTime: (ms: number) => string;
    defaultDisplay: DashboardDisplaySettings;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
    getNow?: () => number;
}
export declare function runForecastCommand(args: string[], deps: ForecastCommandDeps & {
    formatQuotaSnapshotLine: (snapshot: CodexQuotaSnapshot) => string;
}): Promise<number>;
export {};
//# sourceMappingURL=forecast.d.ts.map