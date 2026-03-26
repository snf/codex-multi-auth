import type { ForecastAccountResult } from "../../forecast.js";
import type { CodexQuotaSnapshot } from "../../quota-probe.js";
import type { AccountStorageV3 } from "../../storage.js";
import type { TokenFailure, TokenResult } from "../../types.js";
export interface BestCliOptions {
    live: boolean;
    json: boolean;
    model: string;
    modelProvided: boolean;
}
type ParsedArgsResult<T> = {
    ok: true;
    options: T;
} | {
    ok: false;
    message: string;
};
export interface BestCommandDeps {
    setStoragePath: (path: string | null) => void;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    parseBestArgs: (args: string[]) => ParsedArgsResult<BestCliOptions>;
    printBestUsage: () => void;
    resolveActiveIndex: (storage: AccountStorageV3, family?: "codex") => number;
    hasUsableAccessToken: (account: {
        accessToken?: string;
        expiresAt?: number;
    }, now: number) => boolean;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    extractAccountEmail: (accessToken: string | undefined, idToken: string | undefined) => string | undefined;
    sanitizeEmail: (email: string | undefined) => string | undefined;
    formatAccountLabel: (account: {
        email?: string;
        accountLabel?: string;
        accountId?: string;
    }, index: number) => string;
    fetchCodexQuotaSnapshot: (input: {
        accountId: string;
        accessToken: string;
        model: string;
    }) => Promise<CodexQuotaSnapshot>;
    evaluateForecastAccounts: (inputs: Array<{
        index: number;
        account: AccountStorageV3["accounts"][number];
        isCurrent: boolean;
        now: number;
        refreshFailure?: TokenFailure;
        liveQuota?: CodexQuotaSnapshot;
    }>) => ForecastAccountResult[];
    recommendForecastAccount: (results: ForecastAccountResult[]) => {
        recommendedIndex: number | null;
        reason: string;
    };
    persistAndSyncSelectedAccount: (params: {
        storage: AccountStorageV3;
        targetIndex: number;
        parsed: number;
        switchReason: "best";
        initialSyncIdToken?: string;
    }) => Promise<{
        synced: boolean;
        wasDisabled: boolean;
    }>;
    setCodexCliActiveSelection: (params: {
        accountId?: string;
        email?: string;
        accessToken?: string;
        refreshToken: string;
        expiresAt?: number;
        idToken?: string;
    }) => Promise<boolean>;
    logInfo?: (message: string) => void;
    logWarn?: (message: string) => void;
    logError?: (message: string) => void;
    getNow?: () => number;
}
export declare function runBestCommand(args: string[], deps: BestCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=best.d.ts.map