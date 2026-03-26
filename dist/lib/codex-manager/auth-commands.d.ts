import { promptLoginMode, type ExistingAccountInfo } from "../cli.js";
import { type DashboardDisplaySettings } from "../dashboard-settings.js";
import { type QuotaCacheData } from "../quota-cache.js";
import { type AccountMetadataV3, type AccountStorageV3, type NamedBackupSummary } from "../storage.js";
import type { AccountIdSource, TokenResult } from "../types.js";
import { type ModelFamily } from "../prompts/codex.js";
type PromptTone = "accent" | "success" | "warning" | "danger" | "muted";
type TokenSuccess = Extract<TokenResult, {
    type: "success";
}>;
type TokenSuccessWithAccount = TokenSuccess & {
    accountIdOverride?: string;
    accountIdSource?: AccountIdSource;
    accountLabel?: string;
};
type OAuthSignInMode = "browser" | "manual" | "restore-backup" | "cancel";
type BackupRestoreMode = "latest" | "manual" | "back";
type LoginMenuResult = Awaited<ReturnType<typeof promptLoginMode>>;
type HealthCheckOptions = {
    forceRefresh?: boolean;
    liveProbe?: boolean;
};
export interface AuthCommandHelpers {
    resolveActiveIndex: (storage: AccountStorageV3, family?: ModelFamily) => number;
    hasUsableAccessToken: (account: AccountMetadataV3, now: number) => boolean;
    applyTokenAccountIdentity: (account: {
        accountId?: string;
        accountIdSource?: AccountIdSource;
    }, tokenAccountId: string | undefined) => boolean;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
}
export interface AuthLoginCommandDeps extends AuthCommandHelpers {
    stylePromptText: (text: string, tone: PromptTone) => string;
    runActionPanel: (title: string, stage: string, action: () => Promise<void> | void, settings?: DashboardDisplaySettings) => Promise<void>;
    toExistingAccountInfo: (storage: AccountStorageV3, cache: QuotaCacheData, settings: DashboardDisplaySettings) => ExistingAccountInfo[];
    countMenuQuotaRefreshTargets: (storage: AccountStorageV3, cache: QuotaCacheData, maxAgeMs: number) => number;
    defaultMenuQuotaRefreshTtlMs: number;
    refreshQuotaCacheForMenu: (storage: AccountStorageV3, cache: QuotaCacheData, maxAgeMs: number, onProgress?: (current: number, total: number) => void) => Promise<QuotaCacheData>;
    clearAccountsAndReset: () => Promise<void>;
    handleManageAction: (storage: AccountStorageV3, menuResult: LoginMenuResult) => Promise<void>;
    promptOAuthSignInMode: (backupOption: NamedBackupSummary | null, backupDiscoveryWarning?: string | null) => Promise<OAuthSignInMode>;
    promptBackupRestoreMode: (latestBackup: NamedBackupSummary) => Promise<BackupRestoreMode>;
    promptManualBackupSelection: (namedBackups: NamedBackupSummary[]) => Promise<NamedBackupSummary | null>;
    runOAuthFlow: (forceNewLogin: boolean, signInMode: Extract<OAuthSignInMode, "browser" | "manual">) => Promise<TokenResult>;
    resolveAccountSelection: (tokens: TokenSuccess) => TokenSuccessWithAccount;
    persistAccountPool: (tokens: TokenSuccessWithAccount[], preserveActiveIndexByFamily: boolean) => Promise<void>;
    syncSelectionToCodex: (tokens: TokenSuccessWithAccount) => Promise<void>;
    runHealthCheck: (options: HealthCheckOptions) => Promise<void>;
    runForecast: (args: string[]) => Promise<number>;
    runFix: (args: string[]) => Promise<number>;
    runVerifyFlagged: (args: string[]) => Promise<number>;
    log: {
        debug: (message: string, meta?: unknown) => void;
    };
}
export declare function persistAndSyncSelectedAccount({ storage, targetIndex, parsed, switchReason, initialSyncIdToken, preserveActiveIndexByFamily, helpers, }: {
    storage: AccountStorageV3;
    targetIndex: number;
    parsed: number;
    switchReason: "rotation" | "best" | "restore";
    initialSyncIdToken?: string;
    preserveActiveIndexByFamily?: boolean;
    helpers: AuthCommandHelpers;
}): Promise<{
    synced: boolean;
    wasDisabled: boolean;
}>;
export declare function runSwitch(args: string[], helpers: AuthCommandHelpers): Promise<number>;
export declare function runBest(args: string[], helpers: AuthCommandHelpers): Promise<number>;
export declare function runAuthLogin(args: string[], deps: AuthLoginCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=auth-commands.d.ts.map