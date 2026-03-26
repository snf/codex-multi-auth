import type { ForecastAccountResult } from "../../forecast.js";
import type { AccountStorageV3 } from "../../storage.js";
import type { TokenResult } from "../../types.js";
export type DoctorSeverity = "ok" | "warn" | "error";
export interface DoctorCheck {
    key: string;
    severity: DoctorSeverity;
    message: string;
    details?: string;
}
export interface DoctorFixAction {
    key: string;
    message: string;
}
export interface DoctorCliOptions {
    json: boolean;
    fix: boolean;
    dryRun: boolean;
}
type ParsedArgsResult<T> = {
    ok: true;
    options: T;
} | {
    ok: false;
    message: string;
};
export interface DoctorCommandDeps {
    setStoragePath: (path: string | null) => void;
    getStoragePath: () => string;
    getCodexCliAuthPath: () => string;
    getCodexCliConfigPath: () => string;
    loadCodexCliState: (options: {
        forceRefresh: boolean;
    }) => Promise<{
        activeEmail?: string;
        activeAccountId?: string;
        path?: string;
    } | null>;
    parseDoctorArgs: (args: string[]) => ParsedArgsResult<DoctorCliOptions>;
    printDoctorUsage: () => void;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    applyDoctorFixes: (storage: AccountStorageV3) => {
        changed: boolean;
        actions: DoctorFixAction[];
    };
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    resolveActiveIndex: (storage: AccountStorageV3, family?: "codex") => number;
    evaluateForecastAccounts: (inputs: Array<{
        index: number;
        account: AccountStorageV3["accounts"][number];
        isCurrent: boolean;
        now: number;
    }>) => ForecastAccountResult[];
    recommendForecastAccount: (results: ForecastAccountResult[]) => {
        recommendedIndex: number | null;
        reason: string;
    };
    sanitizeEmail: (email: string | undefined) => string | undefined;
    extractAccountEmail: (accessToken: string | undefined, idToken?: string | undefined) => string | undefined;
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    hasPlaceholderEmail: (value: string | undefined) => boolean;
    hasLikelyInvalidRefreshToken: (refreshToken: string) => boolean;
    getDoctorRefreshTokenKey: (refreshToken: unknown) => string | undefined;
    hasUsableAccessToken: (account: {
        accessToken?: string;
        expiresAt?: number;
    }, now: number) => boolean;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    applyTokenAccountIdentity: (account: AccountStorageV3["accounts"][number], accountId: string | undefined) => boolean;
    setCodexCliActiveSelection: (params: {
        accountId?: string;
        email?: string;
        accessToken?: string;
        refreshToken: string;
        expiresAt?: number;
        idToken?: string;
    }) => Promise<boolean>;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
    getNow?: () => number;
}
export declare function runDoctorCommand(args: string[], deps: DoctorCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=doctor.d.ts.map