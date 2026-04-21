import type { Auth } from "@codex-ai/sdk";
import { type AccountStorageV3, type CooldownReason, type RateLimitStateV3 } from "./storage.js";
import type { AccountReauthReason } from "./account-reauth.js";
import type { AccountIdSource, OAuthAuthDetails } from "./types.js";
import { type ModelFamily } from "./prompts/codex.js";
import { type HybridSelectionOptions } from "./rotation.js";
export { extractAccountId, extractAccountEmail, getAccountIdCandidates, selectBestAccountCandidate, resolveRuntimeRequestIdentity, shouldUpdateAccountIdFromToken, resolveRequestAccountId, sanitizeEmail, type AccountIdCandidate, } from "./auth/token-utils.js";
export { parseRateLimitReason, getQuotaKey, clampNonNegativeInt, clearExpiredRateLimits, isRateLimitedForQuotaKey, isRateLimitedForFamily, formatWaitTime, type QuotaKey, type BaseQuotaKey, type RateLimitReason, type RateLimitState, type RateLimitedEntity, } from "./accounts/rate-limits.js";
export { lookupCodexCliTokensByEmail, isCodexCliSyncEnabled, type CodexCliTokenCacheEntry, } from "./codex-cli/state.js";
import { type RateLimitReason } from "./accounts/rate-limits.js";
export interface Workspace {
    id: string;
    name?: string;
    enabled: boolean;
    disabledAt?: number;
    isDefault?: boolean;
}
export interface ManagedAccount {
    index: number;
    accountId?: string;
    accountIdSource?: AccountIdSource;
    accountLabel?: string;
    email?: string;
    refreshToken: string;
    enabled?: boolean;
    access?: string;
    expires?: number;
    addedAt: number;
    lastUsed: number;
    lastSwitchReason?: "rate-limit" | "initial" | "rotation" | "best" | "restore";
    lastRateLimitReason?: RateLimitReason;
    rateLimitResetTimes: RateLimitStateV3;
    coolingDownUntil?: number;
    cooldownReason?: CooldownReason;
    requiresReauth?: boolean;
    reauthReason?: AccountReauthReason;
    reauthMessage?: string;
    reauthDetectedAt?: number;
    consecutiveAuthFailures?: number;
    workspaces?: Workspace[];
    currentWorkspaceIndex?: number;
}
export declare class AccountManager {
    private accounts;
    private cursorByFamily;
    private currentAccountIndexByFamily;
    private lastToastAccountIndex;
    private lastToastTime;
    private saveDebounceTimer;
    private pendingSave;
    static loadFromDisk(authFallback?: OAuthAuthDetails): Promise<AccountManager>;
    hasRefreshToken(refreshToken: string): boolean;
    private hydrateFromCodexCli;
    constructor(authFallback?: OAuthAuthDetails, stored?: AccountStorageV3 | null);
    getAccountCount(): number;
    getActiveIndex(): number;
    getActiveIndexForFamily(family: ModelFamily): number;
    getAccountsSnapshot(): ManagedAccount[];
    getAccountByIndex(index: number): ManagedAccount | null;
    isAccountAvailableForFamily(index: number, family: ModelFamily, model?: string | null): boolean;
    setActiveIndex(index: number): ManagedAccount | null;
    syncCodexCliActiveSelectionForIndex(index: number): Promise<void>;
    getCurrentAccount(): ManagedAccount | null;
    getCurrentAccountForFamily(family: ModelFamily): ManagedAccount | null;
    getCurrentOrNext(): ManagedAccount | null;
    getCurrentOrNextForFamily(family: ModelFamily, model?: string | null): ManagedAccount | null;
    getNextForFamily(family: ModelFamily, model?: string | null): ManagedAccount | null;
    getCurrentOrNextForFamilyHybrid(family: ModelFamily, model?: string | null, options?: HybridSelectionOptions): ManagedAccount | null;
    recordSuccess(account: ManagedAccount, family: ModelFamily, model?: string | null): void;
    recordRateLimit(account: ManagedAccount, family: ModelFamily, model?: string | null): void;
    recordFailure(account: ManagedAccount, family: ModelFamily, model?: string | null): void;
    consumeToken(account: ManagedAccount, family: ModelFamily, model?: string | null): boolean;
    /**
     * Refund a token consumed within the refund window (30 seconds).
     * Use this when a request fails due to network errors (not rate limits).
     * @returns true if refund was successful, false if no valid consumption found
     */
    refundToken(account: ManagedAccount, family: ModelFamily, model?: string | null): boolean;
    markSwitched(account: ManagedAccount, reason: "rate-limit" | "initial" | "rotation", family: ModelFamily): void;
    markRateLimited(account: ManagedAccount, retryAfterMs: number, family: ModelFamily, model?: string | null): void;
    markRateLimitedWithReason(account: ManagedAccount, retryAfterMs: number, family: ModelFamily, reason: RateLimitReason, model?: string | null): void;
    markAccountCoolingDown(account: ManagedAccount, cooldownMs: number, reason: CooldownReason): void;
    isAccountCoolingDown(account: ManagedAccount): boolean;
    clearAccountCooldown(account: ManagedAccount): void;
    incrementAuthFailures(account: ManagedAccount): number;
    clearAuthFailures(account: ManagedAccount): void;
    shouldShowAccountToast(accountIndex: number, debounceMs?: number): boolean;
    markToastShown(accountIndex: number): void;
    updateFromAuth(account: ManagedAccount, auth: OAuthAuthDetails): void;
    toAuthDetails(account: ManagedAccount): Auth;
    getMinWaitTime(): number;
    getMinWaitTimeForFamily(family: ModelFamily, model?: string | null): number;
    removeAccount(account: ManagedAccount): boolean;
    removeAccountByIndex(index: number): boolean;
    setAccountEnabled(index: number, enabled: boolean): ManagedAccount | null;
    saveToDisk(): Promise<void>;
    saveToDiskDebounced(delayMs?: number): void;
    flushPendingSave(): Promise<void>;
    private resetWorkspaces;
    getCurrentWorkspace(account: ManagedAccount): Workspace | null;
    disableCurrentWorkspace(account: ManagedAccount, expectedWorkspaceId?: string): boolean;
    rotateToNextWorkspace(account: ManagedAccount): Workspace | null;
    /**
     * Legacy accounts without tracked workspaces are treated as having one
     * implicit enabled workspace for backwards compatibility.
     */
    hasEnabledWorkspaces(account: ManagedAccount): boolean;
    getWorkspaceCount(account: ManagedAccount): number;
    getEnabledWorkspaceCount(account: ManagedAccount): number;
}
export declare function formatAccountLabel(account: {
    email?: string;
    accountId?: string;
    accountLabel?: string;
} | undefined, index: number): string;
export declare function formatCooldown(account: {
    coolingDownUntil?: number;
    cooldownReason?: string;
}, now?: number): string | null;
//# sourceMappingURL=accounts.d.ts.map