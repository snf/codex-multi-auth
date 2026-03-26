import { type QuotaCacheData } from "../quota-cache.js";
import { fetchCodexQuotaSnapshot } from "../quota-probe.js";
import { type AccountMetadataV3, type AccountStorageV3 } from "../storage.js";
import { type ModelFamily } from "../prompts/codex.js";
import type { AccountIdSource } from "../types.js";
type PromptTone = "accent" | "success" | "warning" | "danger" | "muted";
type QuotaEmailFallbackState = {
    matchingCount: number;
    distinctAccountIds: Set<string>;
};
type QuotaCacheAccountRef = Pick<AccountMetadataV3, "accountId"> & {
    email?: string;
};
type ParsedArgsResult<T> = {
    ok: true;
    options: T;
} | {
    ok: false;
    message: string;
};
type AccountIdentityResolution = {
    accountId?: string;
    accountIdSource?: AccountIdSource;
};
export interface FixCliOptions {
    dryRun: boolean;
    json: boolean;
    live: boolean;
    model: string;
}
export interface VerifyFlaggedCliOptions {
    dryRun: boolean;
    json: boolean;
    restore: boolean;
}
export interface DoctorCliOptions {
    json: boolean;
    fix: boolean;
    dryRun: boolean;
}
export interface RepairCommandDeps {
    stylePromptText: (text: string, tone: PromptTone) => string;
    styleAccountDetailText: (detail: string, fallbackTone?: PromptTone) => string;
    formatResultSummary: (segments: ReadonlyArray<{
        text: string;
        tone: PromptTone;
    }>) => string;
    resolveActiveIndex: (storage: AccountStorageV3, family?: ModelFamily) => number;
    hasUsableAccessToken: (account: AccountMetadataV3, now: number) => boolean;
    hasLikelyInvalidRefreshToken: (refreshToken: string | undefined) => boolean;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    buildQuotaEmailFallbackState: (accounts: readonly QuotaCacheAccountRef[]) => ReadonlyMap<string, QuotaEmailFallbackState>;
    updateQuotaCacheForAccount: (cache: QuotaCacheData, account: QuotaCacheAccountRef, snapshot: Awaited<ReturnType<typeof fetchCodexQuotaSnapshot>>, accounts: readonly QuotaCacheAccountRef[], emailFallbackState?: ReadonlyMap<string, QuotaEmailFallbackState>) => boolean;
    cloneQuotaCacheData: (cache: QuotaCacheData) => QuotaCacheData;
    pruneUnsafeQuotaEmailCacheEntry: (cache: QuotaCacheData, previousEmail: string | undefined, accounts: readonly QuotaCacheAccountRef[], emailFallbackState: ReadonlyMap<string, QuotaEmailFallbackState>) => boolean;
    formatCompactQuotaSnapshot: (snapshot: Awaited<ReturnType<typeof fetchCodexQuotaSnapshot>>) => string;
    resolveStoredAccountIdentity: (storedAccountId: string | undefined, storedAccountIdSource: AccountIdSource | undefined, refreshedAccountId: string | undefined) => AccountIdentityResolution;
    applyTokenAccountIdentity: (account: AccountMetadataV3, refreshedAccountId: string | undefined) => boolean;
}
export declare function printFixUsage(): void;
export declare function printVerifyFlaggedUsage(): void;
export declare function printDoctorUsage(): void;
export declare function parseFixArgs(args: string[]): ParsedArgsResult<FixCliOptions>;
export declare function parseVerifyFlaggedArgs(args: string[]): ParsedArgsResult<VerifyFlaggedCliOptions>;
export declare function parseDoctorArgs(args: string[]): ParsedArgsResult<DoctorCliOptions>;
export declare function runVerifyFlagged(args: string[], deps: RepairCommandDeps): Promise<number>;
export declare function runFix(args: string[], deps: RepairCommandDeps): Promise<number>;
export declare function runDoctor(args: string[], deps: RepairCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=repair-commands.d.ts.map