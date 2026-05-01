import { createLogger } from "./logger.js";
import { loadAccounts, saveAccounts, findMatchingAccountIndex, } from "./storage.js";
import { MODEL_FAMILIES } from "./prompts/codex.js";
import { getHealthTracker, getTokenTracker, selectHybridAccount, } from "./rotation.js";
import { nowMs } from "./utils.js";
import { loadCodexCliState, } from "./codex-cli/state.js";
import { syncAccountStorageFromCodexCli } from "./codex-cli/sync.js";
import { setCodexCliActiveSelection } from "./codex-cli/writer.js";
export { extractAccountId, extractAccountEmail, getAccountIdCandidates, selectBestAccountCandidate, resolveRuntimeRequestIdentity, shouldUpdateAccountIdFromToken, resolveRequestAccountId, sanitizeEmail, } from "./auth/token-utils.js";
export { parseRateLimitReason, getQuotaKey, clampNonNegativeInt, clearExpiredRateLimits, isRateLimitedForQuotaKey, isRateLimitedForFamily, formatWaitTime, } from "./accounts/rate-limits.js";
export { lookupCodexCliTokensByEmail, isCodexCliSyncEnabled, } from "./codex-cli/state.js";
import { extractAccountId, extractAccountEmail, shouldUpdateAccountIdFromToken, sanitizeEmail, } from "./auth/token-utils.js";
import { clampNonNegativeInt, getQuotaKey, clearExpiredRateLimits, isRateLimitedForFamily, formatWaitTime, } from "./accounts/rate-limits.js";
const log = createLogger("accounts");
function initFamilyState(defaultValue) {
    return Object.fromEntries(MODEL_FAMILIES.map((family) => [family, defaultValue]));
}
function isAccountEnabledForUse(account) {
    return account.enabled !== false && account.requiresReauth !== true;
}
export class AccountManager {
    accounts = [];
    cursorByFamily = initFamilyState(0);
    currentAccountIndexByFamily = initFamilyState(-1);
    lastToastAccountIndex = -1;
    lastToastTime = 0;
    saveDebounceTimer = null;
    pendingSave = null;
    static async loadFromDisk(authFallback) {
        const stored = await loadAccounts();
        const synced = await syncAccountStorageFromCodexCli(stored);
        const sourceOfTruthStorage = synced.storage ?? stored;
        if (synced.changed && sourceOfTruthStorage) {
            try {
                await saveAccounts(sourceOfTruthStorage);
            }
            catch (error) {
                log.debug("Failed to persist Codex CLI source-of-truth sync", {
                    error: String(error),
                });
            }
        }
        const manager = new AccountManager(authFallback, sourceOfTruthStorage);
        await manager.hydrateFromCodexCli();
        return manager;
    }
    hasRefreshToken(refreshToken) {
        return this.accounts.some((account) => account.refreshToken === refreshToken);
    }
    async hydrateFromCodexCli() {
        const state = await loadCodexCliState();
        if (!state || state.accounts.length === 0)
            return;
        const cache = new Map();
        for (const snapshot of state.accounts) {
            const email = sanitizeEmail(snapshot.email);
            if (!email || !snapshot.accessToken)
                continue;
            cache.set(email, {
                accessToken: snapshot.accessToken,
                expiresAt: snapshot.expiresAt,
                refreshToken: snapshot.refreshToken,
                accountId: snapshot.accountId,
            });
        }
        if (cache.size === 0)
            return;
        const now = nowMs();
        let changed = false;
        for (const account of this.accounts) {
            const email = sanitizeEmail(account.email);
            if (!email)
                continue;
            const cached = cache.get(email);
            if (!cached)
                continue;
            if (typeof cached.expiresAt === "number" && cached.expiresAt <= now) {
                continue;
            }
            const missingOrExpired = !account.access || account.expires === undefined || account.expires <= now;
            if (missingOrExpired) {
                account.access = cached.accessToken;
                if (typeof cached.expiresAt === "number") {
                    account.expires = cached.expiresAt;
                }
                changed = true;
            }
            if (!account.accountId &&
                cached.accountId &&
                shouldUpdateAccountIdFromToken(account.accountIdSource, account.accountId)) {
                account.accountId = cached.accountId;
                account.accountIdSource = account.accountIdSource ?? "token";
                changed = true;
            }
        }
        if (!changed)
            return;
        try {
            await this.saveToDisk();
        }
        catch (error) {
            log.debug("Failed to persist Codex CLI cache hydration", { error: String(error) });
        }
    }
    constructor(authFallback, stored) {
        const fallbackAccountId = extractAccountId(authFallback?.access)?.trim() || undefined;
        const fallbackAccountEmail = sanitizeEmail(extractAccountEmail(authFallback?.access));
        if (stored && stored.accounts.length > 0) {
            const storedIdentityRows = [];
            for (let index = 0; index < stored.accounts.length; index += 1) {
                const account = stored.accounts[index];
                if (typeof account?.refreshToken !== "string" ||
                    !account.refreshToken.trim()) {
                    continue;
                }
                storedIdentityRows.push({
                    index,
                    accountId: account.accountId,
                    email: account.email,
                    refreshToken: account.refreshToken,
                });
            }
            const fallbackMatchedRowIndex = authFallback && storedIdentityRows.length > 0
                ? storedIdentityRows[findMatchingAccountIndex(storedIdentityRows, {
                    accountId: fallbackAccountId,
                    email: fallbackAccountEmail,
                    refreshToken: authFallback.refresh,
                }, {
                    allowUniqueAccountIdFallbackWithoutEmail: true,
                }) ?? -1]?.index
                : undefined;
            const baseNow = nowMs();
            this.accounts = stored.accounts
                .map((account, index) => {
                if (typeof account.refreshToken !== "string" ||
                    !account.refreshToken.trim()) {
                    return null;
                }
                const matchesFallback = !!authFallback &&
                    fallbackMatchedRowIndex === index;
                const refreshToken = matchesFallback && authFallback ? authFallback.refresh : account.refreshToken;
                return {
                    index,
                    accountId: matchesFallback ? fallbackAccountId ?? account.accountId : account.accountId,
                    accountIdSource: account.accountIdSource,
                    accountLabel: account.accountLabel,
                    email: matchesFallback
                        ? fallbackAccountEmail ?? sanitizeEmail(account.email)
                        : sanitizeEmail(account.email),
                    refreshToken,
                    enabled: account.enabled !== false,
                    access: matchesFallback && authFallback ? authFallback.access : account.accessToken,
                    expires: matchesFallback && authFallback ? authFallback.expires : account.expiresAt,
                    addedAt: clampNonNegativeInt(account.addedAt, baseNow),
                    lastUsed: clampNonNegativeInt(account.lastUsed, 0),
                    lastSwitchReason: account.lastSwitchReason,
                    rateLimitResetTimes: account.rateLimitResetTimes ?? {},
                    coolingDownUntil: account.coolingDownUntil,
                    cooldownReason: account.cooldownReason,
                    requiresReauth: account.requiresReauth,
                    reauthReason: account.reauthReason,
                    reauthMessage: account.reauthMessage,
                    reauthDetectedAt: account.reauthDetectedAt,
                    workspaces: account.workspaces,
                    currentWorkspaceIndex: account.currentWorkspaceIndex,
                };
            })
                .filter((account) => account !== null);
            const hasMatchingFallback = !!authFallback &&
                fallbackMatchedRowIndex !== undefined;
            if (authFallback && !hasMatchingFallback) {
                const now = nowMs();
                this.accounts.push({
                    index: this.accounts.length,
                    accountId: fallbackAccountId,
                    accountIdSource: fallbackAccountId ? "token" : undefined,
                    email: fallbackAccountEmail,
                    refreshToken: authFallback.refresh,
                    enabled: true,
                    access: authFallback.access,
                    expires: authFallback.expires,
                    addedAt: now,
                    lastUsed: now,
                    lastSwitchReason: "initial",
                    rateLimitResetTimes: {},
                });
            }
            if (this.accounts.length > 0) {
                const defaultIndex = clampNonNegativeInt(stored.activeIndex, 0) % this.accounts.length;
                for (const family of MODEL_FAMILIES) {
                    const rawIndex = stored.activeIndexByFamily?.[family];
                    const nextIndex = clampNonNegativeInt(rawIndex, defaultIndex) % this.accounts.length;
                    this.currentAccountIndexByFamily[family] = nextIndex;
                    this.cursorByFamily[family] = nextIndex;
                }
            }
            return;
        }
        if (authFallback) {
            const now = nowMs();
            this.accounts = [
                {
                    index: 0,
                    accountId: fallbackAccountId,
                    accountIdSource: fallbackAccountId ? "token" : undefined,
                    email: fallbackAccountEmail,
                    refreshToken: authFallback.refresh,
                    enabled: true,
                    access: authFallback.access,
                    expires: authFallback.expires,
                    addedAt: now,
                    lastUsed: 0,
                    lastSwitchReason: "initial",
                    rateLimitResetTimes: {},
                },
            ];
            for (const family of MODEL_FAMILIES) {
                this.currentAccountIndexByFamily[family] = 0;
                this.cursorByFamily[family] = 0;
            }
        }
    }
    getAccountCount() {
        return this.accounts.length;
    }
    getActiveIndex() {
        return this.getActiveIndexForFamily("codex");
    }
    getActiveIndexForFamily(family) {
        const index = this.currentAccountIndexByFamily[family];
        if (index < 0 || index >= this.accounts.length) {
            return this.accounts.length > 0 ? 0 : -1;
        }
        return index;
    }
    getAccountsSnapshot() {
        return this.accounts.map((account) => ({
            ...account,
            rateLimitResetTimes: { ...account.rateLimitResetTimes },
        }));
    }
    getAccountByIndex(index) {
        if (!Number.isFinite(index))
            return null;
        if (index < 0 || index >= this.accounts.length)
            return null;
        const account = this.accounts[index];
        return account ?? null;
    }
    isAccountAvailableForFamily(index, family, model) {
        const account = this.getAccountByIndex(index);
        if (!account)
            return false;
        if (!isAccountEnabledForUse(account))
            return false;
        clearExpiredRateLimits(account);
        return !isRateLimitedForFamily(account, family, model) && !this.isAccountCoolingDown(account);
    }
    setActiveIndex(index) {
        if (!Number.isFinite(index))
            return null;
        if (index < 0 || index >= this.accounts.length)
            return null;
        const account = this.accounts[index];
        if (!account)
            return null;
        if (!isAccountEnabledForUse(account))
            return null;
        for (const family of MODEL_FAMILIES) {
            this.currentAccountIndexByFamily[family] = index;
            this.cursorByFamily[family] = index;
        }
        account.lastUsed = nowMs();
        account.lastSwitchReason = "rotation";
        void this.syncCodexCliActiveSelectionForIndex(account.index);
        return account;
    }
    async syncCodexCliActiveSelectionForIndex(index) {
        if (!Number.isFinite(index))
            return;
        if (index < 0 || index >= this.accounts.length)
            return;
        const account = this.accounts[index];
        if (!account)
            return;
        await setCodexCliActiveSelection({
            accountId: account.accountId,
            email: account.email,
            accessToken: account.access,
            refreshToken: account.refreshToken,
            expiresAt: account.expires,
        });
    }
    getCurrentAccount() {
        return this.getCurrentAccountForFamily("codex");
    }
    getCurrentAccountForFamily(family) {
        const index = this.currentAccountIndexByFamily[family];
        if (index < 0 || index >= this.accounts.length) {
            return null;
        }
        const account = this.accounts[index];
        if (!account || !isAccountEnabledForUse(account)) {
            return null;
        }
        return account;
    }
    getCurrentOrNext() {
        return this.getCurrentOrNextForFamily("codex");
    }
    getCurrentOrNextForFamily(family, model) {
        const count = this.accounts.length;
        if (count === 0)
            return null;
        const cursor = this.cursorByFamily[family];
        for (let i = 0; i < count; i++) {
            const idx = (cursor + i) % count;
            const account = this.accounts[idx];
            if (!account)
                continue;
            if (!isAccountEnabledForUse(account))
                continue;
            clearExpiredRateLimits(account);
            if (isRateLimitedForFamily(account, family, model) || this.isAccountCoolingDown(account)) {
                continue;
            }
            this.cursorByFamily[family] = (idx + 1) % count;
            this.currentAccountIndexByFamily[family] = idx;
            account.lastUsed = nowMs();
            return account;
        }
        return null;
    }
    getNextForFamily(family, model) {
        const count = this.accounts.length;
        if (count === 0)
            return null;
        const cursor = this.cursorByFamily[family];
        for (let i = 0; i < count; i++) {
            const idx = (cursor + i) % count;
            const account = this.accounts[idx];
            if (!account)
                continue;
            if (!isAccountEnabledForUse(account))
                continue;
            clearExpiredRateLimits(account);
            if (isRateLimitedForFamily(account, family, model) || this.isAccountCoolingDown(account)) {
                continue;
            }
            this.cursorByFamily[family] = (idx + 1) % count;
            account.lastUsed = nowMs();
            return account;
        }
        return null;
    }
    getCurrentOrNextForFamilyHybrid(family, model, options) {
        const count = this.accounts.length;
        if (count === 0)
            return null;
        const currentIndex = this.currentAccountIndexByFamily[family];
        if (currentIndex >= 0 && currentIndex < count) {
            const currentAccount = this.accounts[currentIndex];
            if (currentAccount) {
                if (!isAccountEnabledForUse(currentAccount)) {
                    // Fall through to hybrid selection.
                }
                else {
                    clearExpiredRateLimits(currentAccount);
                    if (!isRateLimitedForFamily(currentAccount, family, model) &&
                        !this.isAccountCoolingDown(currentAccount)) {
                        currentAccount.lastUsed = nowMs();
                        return currentAccount;
                    }
                }
            }
        }
        const quotaKey = model ? `${family}:${model}` : family;
        const healthTracker = getHealthTracker();
        const tokenTracker = getTokenTracker();
        const accountsWithMetrics = this.accounts
            .map((account) => {
            if (!account)
                return null;
            if (!isAccountEnabledForUse(account))
                return null;
            clearExpiredRateLimits(account);
            const isAvailable = !isRateLimitedForFamily(account, family, model) && !this.isAccountCoolingDown(account);
            return {
                index: account.index,
                isAvailable,
                lastUsed: account.lastUsed,
            };
        })
            .filter((a) => a !== null);
        const selected = selectHybridAccount(accountsWithMetrics, healthTracker, tokenTracker, quotaKey, {}, options);
        if (!selected)
            return null;
        const account = this.accounts[selected.index];
        if (!account)
            return null;
        this.currentAccountIndexByFamily[family] = account.index;
        this.cursorByFamily[family] = (account.index + 1) % count;
        account.lastUsed = nowMs();
        return account;
    }
    recordSuccess(account, family, model) {
        const quotaKey = model ? `${family}:${model}` : family;
        const healthTracker = getHealthTracker();
        healthTracker.recordSuccess(account.index, quotaKey);
    }
    recordRateLimit(account, family, model) {
        const quotaKey = model ? `${family}:${model}` : family;
        const healthTracker = getHealthTracker();
        const tokenTracker = getTokenTracker();
        healthTracker.recordRateLimit(account.index, quotaKey);
        tokenTracker.drain(account.index, quotaKey);
    }
    recordFailure(account, family, model) {
        const quotaKey = model ? `${family}:${model}` : family;
        const healthTracker = getHealthTracker();
        healthTracker.recordFailure(account.index, quotaKey);
    }
    consumeToken(account, family, model) {
        const quotaKey = model ? `${family}:${model}` : family;
        const tokenTracker = getTokenTracker();
        return tokenTracker.tryConsume(account.index, quotaKey);
    }
    /**
     * Refund a token consumed within the refund window (30 seconds).
     * Use this when a request fails due to network errors (not rate limits).
     * @returns true if refund was successful, false if no valid consumption found
     */
    refundToken(account, family, model) {
        const quotaKey = model ? `${family}:${model}` : family;
        const tokenTracker = getTokenTracker();
        return tokenTracker.refundToken(account.index, quotaKey);
    }
    markSwitched(account, reason, family) {
        account.lastSwitchReason = reason;
        this.currentAccountIndexByFamily[family] = account.index;
    }
    markRateLimited(account, retryAfterMs, family, model) {
        this.markRateLimitedWithReason(account, retryAfterMs, family, "unknown", model);
    }
    markRateLimitedWithReason(account, retryAfterMs, family, reason, model) {
        const retryMs = Math.max(0, Math.floor(retryAfterMs));
        const resetAt = nowMs() + retryMs;
        const baseKey = getQuotaKey(family);
        account.rateLimitResetTimes[baseKey] = resetAt;
        if (model) {
            const modelKey = getQuotaKey(family, model);
            account.rateLimitResetTimes[modelKey] = resetAt;
        }
        account.lastRateLimitReason = reason;
    }
    markAccountCoolingDown(account, cooldownMs, reason) {
        const ms = Math.max(0, Math.floor(cooldownMs));
        account.coolingDownUntil = nowMs() + ms;
        account.cooldownReason = reason;
    }
    isAccountCoolingDown(account) {
        if (account.coolingDownUntil === undefined)
            return false;
        if (nowMs() >= account.coolingDownUntil) {
            this.clearAccountCooldown(account);
            return false;
        }
        return true;
    }
    clearAccountCooldown(account) {
        delete account.coolingDownUntil;
        delete account.cooldownReason;
    }
    incrementAuthFailures(account) {
        account.consecutiveAuthFailures = (account.consecutiveAuthFailures ?? 0) + 1;
        return account.consecutiveAuthFailures;
    }
    clearAuthFailures(account) {
        account.consecutiveAuthFailures = 0;
    }
    shouldShowAccountToast(accountIndex, debounceMs = 30000) {
        const now = nowMs();
        if (accountIndex === this.lastToastAccountIndex && now - this.lastToastTime < debounceMs) {
            return false;
        }
        return true;
    }
    markToastShown(accountIndex) {
        this.lastToastAccountIndex = accountIndex;
        this.lastToastTime = nowMs();
    }
    updateFromAuth(account, auth) {
        account.refreshToken = auth.refresh;
        account.access = auth.access;
        account.expires = auth.expires;
        const tokenAccountId = extractAccountId(auth.access);
        if (tokenAccountId &&
            (shouldUpdateAccountIdFromToken(account.accountIdSource, account.accountId))) {
            account.accountId = tokenAccountId;
            account.accountIdSource = "token";
        }
        account.email = sanitizeEmail(extractAccountEmail(auth.access)) ?? account.email;
    }
    toAuthDetails(account) {
        return {
            type: "oauth",
            access: account.access ?? "",
            refresh: account.refreshToken,
            expires: account.expires ?? 0,
        };
    }
    getMinWaitTime() {
        return this.getMinWaitTimeForFamily("codex");
    }
    getMinWaitTimeForFamily(family, model) {
        const now = nowMs();
        const enabledAccounts = this.accounts.filter((account) => isAccountEnabledForUse(account));
        const available = enabledAccounts.filter((account) => {
            clearExpiredRateLimits(account);
            return !isRateLimitedForFamily(account, family, model) && !this.isAccountCoolingDown(account);
        });
        if (available.length > 0)
            return 0;
        if (enabledAccounts.length === 0)
            return 0;
        const waitTimes = [];
        const baseKey = getQuotaKey(family);
        const modelKey = model ? getQuotaKey(family, model) : null;
        for (const account of enabledAccounts) {
            const baseResetAt = account.rateLimitResetTimes[baseKey];
            if (typeof baseResetAt === "number") {
                waitTimes.push(Math.max(0, baseResetAt - now));
            }
            if (modelKey) {
                const modelResetAt = account.rateLimitResetTimes[modelKey];
                if (typeof modelResetAt === "number") {
                    waitTimes.push(Math.max(0, modelResetAt - now));
                }
            }
            if (typeof account.coolingDownUntil === "number") {
                waitTimes.push(Math.max(0, account.coolingDownUntil - now));
            }
        }
        return waitTimes.length > 0 ? Math.min(...waitTimes) : 0;
    }
    removeAccount(account) {
        const idx = this.accounts.indexOf(account);
        if (idx < 0) {
            return false;
        }
        this.accounts.splice(idx, 1);
        this.accounts.forEach((acc, index) => {
            acc.index = index;
        });
        if (this.accounts.length === 0) {
            for (const family of MODEL_FAMILIES) {
                this.cursorByFamily[family] = 0;
                this.currentAccountIndexByFamily[family] = -1;
            }
            return true;
        }
        for (const family of MODEL_FAMILIES) {
            if (this.cursorByFamily[family] > idx) {
                this.cursorByFamily[family] = Math.max(0, this.cursorByFamily[family] - 1);
            }
        }
        for (const family of MODEL_FAMILIES) {
            this.cursorByFamily[family] = this.cursorByFamily[family] % this.accounts.length;
        }
        for (const family of MODEL_FAMILIES) {
            if (this.currentAccountIndexByFamily[family] > idx) {
                this.currentAccountIndexByFamily[family] -= 1;
            }
            if (this.currentAccountIndexByFamily[family] >= this.accounts.length) {
                this.currentAccountIndexByFamily[family] = -1;
            }
        }
        return true;
    }
    removeAccountByIndex(index) {
        if (!Number.isFinite(index))
            return false;
        if (index < 0 || index >= this.accounts.length)
            return false;
        const account = this.accounts[index];
        if (!account)
            return false;
        return this.removeAccount(account);
    }
    setAccountEnabled(index, enabled) {
        if (!Number.isFinite(index))
            return null;
        if (index < 0 || index >= this.accounts.length)
            return null;
        const account = this.accounts[index];
        if (!account)
            return null;
        const wasEnabled = account.enabled !== false;
        account.enabled = enabled;
        if (enabled && !wasEnabled) {
            this.resetWorkspaces(account);
        }
        return account;
    }
    async saveToDisk() {
        const activeIndexByFamily = {};
        for (const family of MODEL_FAMILIES) {
            const raw = this.currentAccountIndexByFamily[family];
            activeIndexByFamily[family] = clampNonNegativeInt(raw, 0);
        }
        const activeIndex = clampNonNegativeInt(activeIndexByFamily.codex, 0);
        const storage = {
            version: 3,
            accounts: this.accounts.map((account) => ({
                accountId: account.accountId,
                accountIdSource: account.accountIdSource,
                accountLabel: account.accountLabel,
                email: account.email,
                refreshToken: account.refreshToken,
                accessToken: account.access,
                expiresAt: account.expires,
                enabled: account.enabled === false ? false : undefined,
                addedAt: account.addedAt,
                lastUsed: account.lastUsed,
                lastSwitchReason: account.lastSwitchReason,
                rateLimitResetTimes: Object.keys(account.rateLimitResetTimes).length > 0 ? account.rateLimitResetTimes : undefined,
                coolingDownUntil: account.coolingDownUntil,
                cooldownReason: account.cooldownReason,
                requiresReauth: account.requiresReauth,
                reauthReason: account.reauthReason,
                reauthMessage: account.reauthMessage,
                reauthDetectedAt: account.reauthDetectedAt,
                workspaces: account.workspaces,
                currentWorkspaceIndex: account.currentWorkspaceIndex,
            })),
            activeIndex,
            activeIndexByFamily,
        };
        await saveAccounts(storage);
    }
    saveToDiskDebounced(delayMs = 500) {
        if (this.saveDebounceTimer) {
            clearTimeout(this.saveDebounceTimer);
        }
        this.saveDebounceTimer = setTimeout(() => {
            this.saveDebounceTimer = null;
            const doSave = async () => {
                try {
                    if (this.pendingSave) {
                        await this.pendingSave;
                    }
                    this.pendingSave = this.saveToDisk().finally(() => {
                        this.pendingSave = null;
                    });
                    await this.pendingSave;
                }
                catch (error) {
                    log.warn("Debounced save failed", { error: error instanceof Error ? error.message : String(error) });
                }
            };
            void doSave();
        }, delayMs);
    }
    async flushPendingSave() {
        if (this.saveDebounceTimer) {
            clearTimeout(this.saveDebounceTimer);
            this.saveDebounceTimer = null;
            await this.saveToDisk();
        }
        if (this.pendingSave) {
            await this.pendingSave;
        }
    }
    // Workspace management methods
    resetWorkspaces(account) {
        if (!account.workspaces || account.workspaces.length === 0) {
            return;
        }
        const resetIndex = account.workspaces.findIndex((workspace) => workspace.isDefault === true);
        for (const workspace of account.workspaces) {
            workspace.enabled = true;
            delete workspace.disabledAt;
        }
        account.currentWorkspaceIndex = resetIndex >= 0 ? resetIndex : 0;
    }
    getCurrentWorkspace(account) {
        if (!account.workspaces || account.workspaces.length === 0) {
            return null;
        }
        const idx = account.currentWorkspaceIndex ?? 0;
        return account.workspaces[idx] ?? null;
    }
    disableCurrentWorkspace(account, expectedWorkspaceId) {
        if (!account.workspaces || account.workspaces.length === 0) {
            return false;
        }
        const idx = account.currentWorkspaceIndex ?? 0;
        if (idx < 0 || idx >= account.workspaces.length) {
            return false;
        }
        const workspace = account.workspaces[idx];
        if (!workspace)
            return false;
        if (expectedWorkspaceId && workspace.id !== expectedWorkspaceId) {
            return false;
        }
        if (workspace.enabled === false) {
            return false;
        }
        workspace.enabled = false;
        workspace.disabledAt = nowMs();
        return true;
    }
    rotateToNextWorkspace(account) {
        if (!account.workspaces || account.workspaces.length === 0) {
            return null;
        }
        const currentIdx = account.currentWorkspaceIndex ?? 0;
        const totalWorkspaces = account.workspaces.length;
        // Search successor workspaces only; the current slot was just evaluated.
        for (let i = 1; i < totalWorkspaces; i++) {
            const nextIdx = (currentIdx + i) % totalWorkspaces;
            const workspace = account.workspaces[nextIdx];
            if (workspace && workspace.enabled !== false) {
                account.currentWorkspaceIndex = nextIdx;
                return workspace;
            }
        }
        return null; // No enabled workspaces found
    }
    /**
     * Legacy accounts without tracked workspaces are treated as having one
     * implicit enabled workspace for backwards compatibility.
     */
    hasEnabledWorkspaces(account) {
        if (!account.workspaces || account.workspaces.length === 0) {
            return true; // No workspaces tracked yet, assume single workspace
        }
        return account.workspaces.some((w) => w.enabled !== false);
    }
    getWorkspaceCount(account) {
        return account.workspaces?.length ?? 0;
    }
    getEnabledWorkspaceCount(account) {
        if (!account.workspaces)
            return 0;
        return account.workspaces.filter((w) => w.enabled !== false).length;
    }
}
export function formatAccountLabel(account, index) {
    const accountLabel = account?.accountLabel?.trim();
    const email = account?.email?.trim();
    const accountId = account?.accountId?.trim();
    const idSuffix = accountId ? (accountId.length > 6 ? accountId.slice(-6) : accountId) : null;
    if (accountLabel && email && idSuffix) {
        return `Account ${index + 1} (${accountLabel}, ${email}, id:${idSuffix})`;
    }
    if (accountLabel && email)
        return `Account ${index + 1} (${accountLabel}, ${email})`;
    if (accountLabel && idSuffix)
        return `Account ${index + 1} (${accountLabel}, id:${idSuffix})`;
    if (accountLabel)
        return `Account ${index + 1} (${accountLabel})`;
    if (email && idSuffix)
        return `Account ${index + 1} (${email}, id:${idSuffix})`;
    if (email)
        return `Account ${index + 1} (${email})`;
    if (idSuffix)
        return `Account ${index + 1} (${idSuffix})`;
    return `Account ${index + 1}`;
}
export function formatCooldown(account, now = nowMs()) {
    if (typeof account.coolingDownUntil !== "number")
        return null;
    const remaining = account.coolingDownUntil - now;
    if (remaining <= 0)
        return null;
    const reason = account.cooldownReason ? ` (${account.cooldownReason})` : "";
    return `${formatWaitTime(remaining)}${reason}`;
}
//# sourceMappingURL=accounts.js.map