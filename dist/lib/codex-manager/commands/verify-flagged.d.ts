import type { AccountStorageV3, FlaggedAccountMetadataV1 } from "../../storage.js";
import type { TokenResult } from "../../types.js";
export interface VerifyFlaggedCliOptions {
    dryRun: boolean;
    json: boolean;
    restore: boolean;
}
type ParsedArgsResult<T> = {
    ok: true;
    options: T;
} | {
    ok: false;
    message: string;
};
export interface VerifyFlaggedReport {
    index: number;
    label: string;
    outcome: "restored" | "healthy-flagged" | "still-flagged" | "restore-skipped";
    message: string;
}
export interface VerifyFlaggedCommandDeps {
    setStoragePath: (path: string | null) => void;
    loadFlaggedAccounts: () => Promise<{
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }>;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    parseVerifyFlaggedArgs: (args: string[]) => ParsedArgsResult<VerifyFlaggedCliOptions>;
    printVerifyFlaggedUsage: () => void;
    createEmptyAccountStorage: () => AccountStorageV3;
    upsertRecoveredFlaggedAccount: (storage: AccountStorageV3, flagged: FlaggedAccountMetadataV1, refreshResult: Extract<TokenResult, {
        type: "success";
    }>, now: number) => {
        restored: boolean;
        changed: boolean;
        message: string;
    };
    resolveStoredAccountIdentity: (accountId: string | undefined, accountIdSource: FlaggedAccountMetadataV1["accountIdSource"], tokenAccountId: string | undefined) => {
        accountId?: string;
        accountIdSource?: FlaggedAccountMetadataV1["accountIdSource"];
    };
    extractAccountId: (accessToken: string | undefined) => string | undefined;
    extractAccountEmail: (accessToken: string | undefined, idToken: string | undefined) => string | undefined;
    sanitizeEmail: (email: string | undefined) => string | undefined;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    withAccountAndFlaggedStorageTransaction: (callback: (loadedStorage: AccountStorageV3 | null, persist: (nextStorage: AccountStorageV3, nextFlagged: {
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }) => Promise<void>) => Promise<void>) => Promise<void>;
    normalizeDoctorIndexes: (storage: AccountStorageV3) => void;
    saveFlaggedAccounts: (data: {
        version: 1;
        accounts: FlaggedAccountMetadataV1[];
    }) => Promise<void>;
    formatAccountLabel: (account: Pick<FlaggedAccountMetadataV1, "email" | "accountLabel" | "accountId">, index: number) => string;
    stylePromptText: (text: string, tone: "accent" | "success" | "warning" | "danger" | "muted") => string;
    styleAccountDetailText: (detail: string, fallbackTone?: "accent" | "success" | "warning" | "danger" | "muted") => string;
    formatResultSummary: (segments: ReadonlyArray<{
        text: string;
        tone: "accent" | "success" | "warning" | "danger" | "muted";
    }>) => string;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
    getNow?: () => number;
}
export declare function runVerifyFlaggedCommand(args: string[], deps: VerifyFlaggedCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=verify-flagged.d.ts.map