import { maskEmail } from "../logger.js";
import { classifyAccessTokenFailureForReauth, classifyRefreshFailureForReauth, clearAccountReauthRequired, markAccountReauthRequired, } from "../account-reauth.js";
export async function runRuntimeAccountCheck(deepProbe, deps) {
    const loadedStorage = await deps.hydrateEmails(await deps.loadAccounts());
    const workingStorage = loadedStorage
        ? {
            ...loadedStorage,
            accounts: loadedStorage.accounts.map((account) => ({ ...account })),
            activeIndexByFamily: loadedStorage.activeIndexByFamily
                ? { ...loadedStorage.activeIndexByFamily }
                : {},
        }
        : deps.createEmptyStorage();
    if (workingStorage.accounts.length === 0) {
        deps.showLine("\nNo accounts to check.\n");
        return;
    }
    const flaggedStorage = await deps.loadFlaggedAccounts();
    const state = deps.createAccountCheckWorkingState(flaggedStorage);
    const total = workingStorage.accounts.length;
    deps.showLine(`\nChecking ${deepProbe ? "full account health" : "quotas"} for all accounts...\n`);
    for (let i = 0; i < total; i += 1) {
        const account = workingStorage.accounts[i];
        if (!account)
            continue;
        const maskedEmail = account.email ? maskEmail(account.email) : undefined;
        const label = account.accountLabel ?? maskedEmail ?? `Account ${i + 1}`;
        if (account.enabled === false) {
            state.disabled += 1;
            deps.showLine(`[${i + 1}/${total}] ${label}: DISABLED`);
            continue;
        }
        try {
            const nowMs = deps.now?.() ?? Date.now();
            let accessToken = null;
            let tokenAccountId;
            let authDetail = "OK";
            if (account.accessToken &&
                (typeof account.expiresAt !== "number" ||
                    !Number.isFinite(account.expiresAt) ||
                    account.expiresAt > nowMs)) {
                accessToken = account.accessToken;
                authDetail = "OK (cached access)";
                tokenAccountId = deps.extractAccountId(account.accessToken);
                if (tokenAccountId &&
                    deps.shouldUpdateAccountIdFromToken(account.accountIdSource, account.accountId) &&
                    tokenAccountId !== account.accountId) {
                    account.accountId = tokenAccountId;
                    account.accountIdSource = "token";
                    state.storageChanged = true;
                }
            }
            if (!accessToken) {
                const cached = await deps
                    .lookupCodexCliTokensByEmail(account.email)
                    .catch(() => null);
                if (cached &&
                    (typeof cached.expiresAt !== "number" ||
                        !Number.isFinite(cached.expiresAt) ||
                        cached.expiresAt > nowMs)) {
                    accessToken = cached.accessToken;
                    authDetail = "OK (Codex CLI cache)";
                    if (cached.refreshToken &&
                        cached.refreshToken !== account.refreshToken) {
                        account.refreshToken = cached.refreshToken;
                        state.storageChanged = true;
                    }
                    if (cached.refreshToken &&
                        clearAccountReauthRequired(account)) {
                        state.storageChanged = true;
                    }
                    if (cached.accessToken &&
                        cached.accessToken !== account.accessToken) {
                        account.accessToken = cached.accessToken;
                        state.storageChanged = true;
                    }
                    if (cached.expiresAt !== account.expiresAt) {
                        account.expiresAt = cached.expiresAt;
                        state.storageChanged = true;
                    }
                    const hydratedEmail = deps.sanitizeEmail(deps.extractAccountEmail(cached.accessToken));
                    if (hydratedEmail && hydratedEmail !== account.email) {
                        account.email = hydratedEmail;
                        state.storageChanged = true;
                    }
                    tokenAccountId = deps.extractAccountId(cached.accessToken);
                    if (tokenAccountId &&
                        deps.shouldUpdateAccountIdFromToken(account.accountIdSource, account.accountId) &&
                        tokenAccountId !== account.accountId) {
                        account.accountId = tokenAccountId;
                        account.accountIdSource = "token";
                        state.storageChanged = true;
                    }
                }
            }
            if (!accessToken) {
                const refreshResult = await deps.queuedRefresh(account.refreshToken);
                if (refreshResult.type !== "success") {
                    state.errors += 1;
                    const message = refreshResult.message ?? refreshResult.reason ?? "refresh failed";
                    const reauthRequirement = classifyRefreshFailureForReauth(refreshResult, {
                        sessionUsable: false,
                    });
                    if (reauthRequirement &&
                        markAccountReauthRequired(account, reauthRequirement, nowMs)) {
                        state.storageChanged = true;
                    }
                    deps.showLine(`[${i + 1}/${total}] ${label}: ERROR (${message})`);
                    if (deepProbe && deps.isRuntimeFlaggableFailure(refreshResult)) {
                        const existingIndex = state.flaggedStorage.accounts.findIndex((flagged) => flagged.refreshToken === account.refreshToken);
                        const flaggedRecord = {
                            ...account,
                            flaggedAt: nowMs,
                            flaggedReason: "token-invalid",
                            lastError: message,
                        };
                        if (existingIndex >= 0) {
                            state.flaggedStorage.accounts[existingIndex] = flaggedRecord;
                        }
                        else {
                            state.flaggedStorage.accounts.push(flaggedRecord);
                        }
                        state.removeFromActive.add(account.refreshToken);
                        state.flaggedChanged = true;
                    }
                    continue;
                }
                accessToken = refreshResult.access;
                authDetail = "OK";
                if (refreshResult.refresh !== account.refreshToken) {
                    account.refreshToken = refreshResult.refresh;
                    state.storageChanged = true;
                }
                if (refreshResult.access &&
                    refreshResult.access !== account.accessToken) {
                    account.accessToken = refreshResult.access;
                    state.storageChanged = true;
                }
                if (typeof refreshResult.expires === "number" &&
                    refreshResult.expires !== account.expiresAt) {
                    account.expiresAt = refreshResult.expires;
                    state.storageChanged = true;
                }
                if (clearAccountReauthRequired(account)) {
                    state.storageChanged = true;
                }
                const hydratedEmail = deps.sanitizeEmail(deps.extractAccountEmail(refreshResult.access, refreshResult.idToken));
                if (hydratedEmail && hydratedEmail !== account.email) {
                    account.email = hydratedEmail;
                    state.storageChanged = true;
                }
                tokenAccountId = deps.extractAccountId(refreshResult.access);
                if (tokenAccountId &&
                    deps.shouldUpdateAccountIdFromToken(account.accountIdSource, account.accountId) &&
                    tokenAccountId !== account.accountId) {
                    account.accountId = tokenAccountId;
                    account.accountIdSource = "token";
                    state.storageChanged = true;
                }
            }
            if (!accessToken) {
                throw new Error("Missing access token after refresh");
            }
            if (deepProbe) {
                state.ok += 1;
                const detail = tokenAccountId
                    ? `${authDetail} (id:${tokenAccountId.slice(-6)})`
                    : authDetail;
                deps.showLine(`[${i + 1}/${total}] ${label}: ${detail}`);
                continue;
            }
            try {
                const requestAccountId = deps.resolveRequestAccountId(account.accountId, account.accountIdSource, tokenAccountId) ??
                    tokenAccountId ??
                    account.accountId;
                if (!requestAccountId) {
                    throw new Error("Missing accountId for quota probe");
                }
                const snapshot = await deps.fetchCodexQuotaSnapshot({
                    accountId: requestAccountId,
                    accessToken,
                });
                if (account.reauthReason === "access-token-invalidated" &&
                    clearAccountReauthRequired(account)) {
                    state.storageChanged = true;
                }
                state.ok += 1;
                deps.showLine(`[${i + 1}/${total}] ${label}: ${deps.formatCodexQuotaLine(snapshot)}`);
            }
            catch (error) {
                state.errors += 1;
                const message = error instanceof Error ? error.message : String(error);
                const reauthRequirement = classifyAccessTokenFailureForReauth({
                    message,
                });
                if (reauthRequirement &&
                    markAccountReauthRequired(account, reauthRequirement, nowMs)) {
                    state.storageChanged = true;
                }
                deps.showLine(`[${i + 1}/${total}] ${label}: ERROR (${message.slice(0, 160)})`);
            }
        }
        catch (error) {
            state.errors += 1;
            const message = error instanceof Error ? error.message : String(error);
            deps.showLine(`[${i + 1}/${total}] ${label}: ERROR (${message.slice(0, 120)})`);
        }
    }
    if (state.removeFromActive.size > 0) {
        workingStorage.accounts = workingStorage.accounts.filter((account) => !state.removeFromActive.has(account.refreshToken));
        deps.clampRuntimeActiveIndices(workingStorage, deps.MODEL_FAMILIES);
        state.storageChanged = true;
    }
    if (state.flaggedChanged) {
        await deps.saveFlaggedAccounts(state.flaggedStorage);
    }
    if (state.storageChanged) {
        await deps.saveAccounts(workingStorage);
        deps.invalidateAccountManagerCache();
    }
    deps.showLine("");
    deps.showLine(`Results: ${state.ok} ok, ${state.errors} error, ${state.disabled} disabled`);
    if (state.removeFromActive.size > 0) {
        deps.showLine(`Moved ${state.removeFromActive.size} account(s) to flagged pool (invalid refresh token).`);
    }
    deps.showLine("");
}
//# sourceMappingURL=account-check.js.map