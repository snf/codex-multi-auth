import { resolveNormalizedModel } from "../../request/helpers/model-map.js";
export function summarizeFixReports(reports) {
    let healthy = 0;
    let disabled = 0;
    let warnings = 0;
    let skipped = 0;
    for (const report of reports) {
        if (report.outcome === "healthy")
            healthy += 1;
        else if (report.outcome === "disabled-hard-failure")
            disabled += 1;
        else if (report.outcome === "warning-soft-failure")
            warnings += 1;
        else
            skipped += 1;
    }
    return { healthy, disabled, warnings, skipped };
}
export async function runFixCommand(args, deps) {
    const logInfo = deps.logInfo ?? console.log;
    const logError = deps.logError ?? console.error;
    if (args.includes("--help") || args.includes("-h")) {
        deps.printFixUsage();
        return 0;
    }
    const parsedArgs = deps.parseFixArgs(args);
    if (!parsedArgs.ok) {
        logError(parsedArgs.message);
        deps.printFixUsage();
        return 1;
    }
    const options = parsedArgs.options;
    const requestedModel = options.model?.trim() || "gpt-5-codex";
    const probeModel = resolveNormalizedModel(requestedModel);
    const display = deps.defaultDisplay;
    const quotaCache = options.live ? await deps.loadQuotaCache() : null;
    const workingQuotaCache = quotaCache
        ? deps.cloneQuotaCacheData(quotaCache)
        : null;
    let quotaCacheChanged = false;
    deps.setStoragePath(null);
    const storage = await deps.loadAccounts();
    if (!storage || storage.accounts.length === 0) {
        if (options.json) {
            logInfo(JSON.stringify({
                command: "fix",
                dryRun: options.dryRun,
                liveProbe: options.live,
                model: options.model,
                changed: false,
                summary: { healthy: 0, disabled: 0, warnings: 0, skipped: 0 },
                recommendation: {
                    recommendedIndex: null,
                    reason: "No accounts configured.",
                },
                recommendedSwitchCommand: null,
                reports: [],
            }, null, 2));
        }
        else {
            logInfo("No accounts configured.");
        }
        return 0;
    }
    let quotaEmailFallbackState = options.live && quotaCache
        ? deps.buildQuotaEmailFallbackState(storage.accounts)
        : null;
    const now = deps.getNow?.() ?? Date.now();
    const activeIndex = deps.resolveActiveIndex(storage, "codex");
    let changed = false;
    const reports = [];
    const refreshFailures = new Map();
    const hardDisabledIndexes = [];
    for (let i = 0; i < storage.accounts.length; i += 1) {
        const account = storage.accounts[i];
        if (!account)
            continue;
        const label = deps.formatAccountLabel(account, i);
        if (account.enabled === false) {
            reports.push({
                index: i,
                label,
                outcome: "already-disabled",
                message: "already disabled",
            });
            continue;
        }
        if (deps.hasUsableAccessToken(account, now)) {
            if (options.live) {
                const currentAccessToken = account.accessToken;
                const probeAccountId = currentAccessToken
                    ? (account.accountId ?? deps.extractAccountId(currentAccessToken))
                    : undefined;
                if (probeAccountId && currentAccessToken) {
                    try {
                        const snapshot = await deps.fetchCodexQuotaSnapshot({
                            accountId: probeAccountId,
                            accessToken: currentAccessToken,
                            model: probeModel,
                        });
                        if (workingQuotaCache)
                            quotaCacheChanged =
                                deps.updateQuotaCacheForAccount(workingQuotaCache, account, snapshot, storage.accounts, quotaEmailFallbackState ?? undefined) || quotaCacheChanged;
                        reports.push({
                            index: i,
                            label,
                            outcome: "healthy",
                            message: display.showQuotaDetails
                                ? `live session OK (${deps.formatCompactQuotaSnapshot(snapshot)})`
                                : "live session OK",
                        });
                        continue;
                    }
                    catch (error) {
                        const message = deps.normalizeFailureDetail(error instanceof Error ? error.message : String(error), undefined);
                        reports.push({
                            index: i,
                            label,
                            outcome: "warning-soft-failure",
                            message: `live probe failed (${message}), trying refresh fallback`,
                        });
                    }
                }
            }
            const refreshWarning = deps.hasLikelyInvalidRefreshToken(account.refreshToken)
                ? " (refresh token looks stale; re-login recommended)"
                : "";
            reports.push({
                index: i,
                label,
                outcome: "healthy",
                message: `access token still valid${refreshWarning}`,
            });
            continue;
        }
        const refreshResult = await deps.queuedRefresh(account.refreshToken);
        if (refreshResult.type === "success") {
            const nextEmail = deps.sanitizeEmail(deps.extractAccountEmail(refreshResult.access, refreshResult.idToken));
            const nextAccountId = deps.extractAccountId(refreshResult.access);
            const previousEmail = account.email;
            let accountChanged = false;
            let accountIdentityChanged = false;
            if (account.refreshToken !== refreshResult.refresh) {
                account.refreshToken = refreshResult.refresh;
                accountChanged = true;
            }
            if (account.accessToken !== refreshResult.access) {
                account.accessToken = refreshResult.access;
                accountChanged = true;
            }
            if (account.expiresAt !== refreshResult.expires) {
                account.expiresAt = refreshResult.expires;
                accountChanged = true;
            }
            if (nextEmail && nextEmail !== account.email) {
                account.email = nextEmail;
                accountChanged = true;
                accountIdentityChanged = true;
            }
            if (deps.applyTokenAccountIdentity(account, nextAccountId)) {
                accountChanged = true;
                accountIdentityChanged = true;
            }
            if (accountChanged)
                changed = true;
            if (accountIdentityChanged && options.live && workingQuotaCache) {
                quotaEmailFallbackState = deps.buildQuotaEmailFallbackState(storage.accounts);
                quotaCacheChanged =
                    deps.pruneUnsafeQuotaEmailCacheEntry(workingQuotaCache, previousEmail, storage.accounts, quotaEmailFallbackState) || quotaCacheChanged;
            }
            if (options.live) {
                const probeAccountId = account.accountId ?? nextAccountId;
                if (probeAccountId) {
                    try {
                        const snapshot = await deps.fetchCodexQuotaSnapshot({
                            accountId: probeAccountId,
                            accessToken: refreshResult.access,
                            model: probeModel,
                        });
                        if (workingQuotaCache)
                            quotaCacheChanged =
                                deps.updateQuotaCacheForAccount(workingQuotaCache, account, snapshot, storage.accounts, quotaEmailFallbackState ?? undefined) || quotaCacheChanged;
                        reports.push({
                            index: i,
                            label,
                            outcome: "healthy",
                            message: display.showQuotaDetails
                                ? `refresh + live probe succeeded (${deps.formatCompactQuotaSnapshot(snapshot)})`
                                : "refresh + live probe succeeded",
                        });
                        continue;
                    }
                    catch (error) {
                        const message = deps.normalizeFailureDetail(error instanceof Error ? error.message : String(error), undefined);
                        reports.push({
                            index: i,
                            label,
                            outcome: "warning-soft-failure",
                            message: `refresh succeeded but live probe failed: ${message}`,
                        });
                        continue;
                    }
                }
            }
            reports.push({
                index: i,
                label,
                outcome: "healthy",
                message: "refresh succeeded",
            });
            continue;
        }
        const detail = deps.normalizeFailureDetail(refreshResult.message, refreshResult.reason);
        refreshFailures.set(i, { ...refreshResult, message: detail });
        if (deps.isHardRefreshFailure(refreshResult)) {
            account.enabled = false;
            changed = true;
            hardDisabledIndexes.push(i);
            reports.push({
                index: i,
                label,
                outcome: "disabled-hard-failure",
                message: detail,
            });
        }
        else {
            reports.push({
                index: i,
                label,
                outcome: "warning-soft-failure",
                message: detail,
            });
        }
    }
    if (hardDisabledIndexes.length > 0) {
        const enabledCount = storage.accounts.filter((account) => account.enabled !== false).length;
        if (enabledCount === 0) {
            const fallbackIndex = hardDisabledIndexes.includes(activeIndex)
                ? activeIndex
                : hardDisabledIndexes[0];
            const fallback = typeof fallbackIndex === "number"
                ? storage.accounts[fallbackIndex]
                : undefined;
            if (fallback && fallback.enabled === false) {
                fallback.enabled = true;
                changed = true;
                const existingReport = reports.find((report) => report.index === fallbackIndex &&
                    report.outcome === "disabled-hard-failure");
                if (existingReport) {
                    existingReport.outcome = "warning-soft-failure";
                    existingReport.message = `${existingReport.message} (kept enabled to avoid lockout; re-login required)`;
                }
            }
        }
    }
    const forecastResults = deps.evaluateForecastAccounts(storage.accounts.map((account, index) => ({
        index,
        account,
        isCurrent: index === activeIndex,
        now,
        refreshFailure: refreshFailures.get(index),
    })));
    const recommendation = deps.recommendForecastAccount(forecastResults);
    const reportSummary = summarizeFixReports(reports);
    if (changed && !options.dryRun)
        await deps.saveAccounts(storage);
    if (options.json) {
        if (workingQuotaCache && quotaCacheChanged && !options.dryRun)
            await deps.saveQuotaCache(workingQuotaCache);
        logInfo(JSON.stringify({
            command: "fix",
            dryRun: options.dryRun,
            liveProbe: options.live,
            model: requestedModel,
            changed,
            summary: reportSummary,
            recommendation,
            recommendedSwitchCommand: recommendation.recommendedIndex !== null &&
                recommendation.recommendedIndex !== activeIndex
                ? `codex auth switch ${recommendation.recommendedIndex + 1}`
                : null,
            reports,
        }, null, 2));
        return 0;
    }
    logInfo(deps.stylePromptText(`Auto-fix scan (${options.dryRun ? "preview" : "apply"})`, "accent"));
    logInfo(deps.formatResultSummary([
        { text: `${reportSummary.healthy} working`, tone: "success" },
        {
            text: `${reportSummary.disabled} disabled`,
            tone: reportSummary.disabled > 0 ? "danger" : "muted",
        },
        {
            text: `${reportSummary.warnings} warning${reportSummary.warnings === 1 ? "" : "s"}`,
            tone: reportSummary.warnings > 0 ? "warning" : "muted",
        },
        { text: `${reportSummary.skipped} already disabled`, tone: "muted" },
    ]));
    if (display.showPerAccountRows) {
        logInfo("");
        for (const report of reports) {
            const prefix = report.outcome === "healthy"
                ? "✓"
                : report.outcome === "disabled-hard-failure"
                    ? "✗"
                    : report.outcome === "warning-soft-failure"
                        ? "!"
                        : "-";
            const tone = report.outcome === "healthy"
                ? "success"
                : report.outcome === "disabled-hard-failure"
                    ? "danger"
                    : report.outcome === "warning-soft-failure"
                        ? "warning"
                        : "muted";
            logInfo(`${deps.stylePromptText(prefix, tone)} ${deps.stylePromptText(`${report.index + 1}. ${report.label}`, "accent")} ${deps.stylePromptText("|", "muted")} ${deps.styleAccountDetailText(report.message, tone === "success" ? "muted" : tone)}`);
        }
    }
    else {
        logInfo("");
        logInfo(deps.stylePromptText("Per-account lines are hidden in dashboard settings.", "muted"));
    }
    if (display.showRecommendations) {
        logInfo("");
        if (recommendation.recommendedIndex !== null) {
            const target = recommendation.recommendedIndex + 1;
            logInfo(`${deps.stylePromptText("Best next account:", "accent")} ${deps.stylePromptText(String(target), "success")}`);
            logInfo(`${deps.stylePromptText("Why:", "accent")} ${deps.stylePromptText(recommendation.reason, "muted")}`);
            if (recommendation.recommendedIndex !== activeIndex) {
                logInfo(`${deps.stylePromptText("Switch now with:", "accent")} codex auth switch ${target}`);
            }
        }
        else {
            logInfo(`${deps.stylePromptText("Note:", "accent")} ${deps.stylePromptText(recommendation.reason, "muted")}`);
        }
    }
    if (workingQuotaCache && quotaCacheChanged && !options.dryRun)
        await deps.saveQuotaCache(workingQuotaCache);
    if (changed && options.dryRun)
        logInfo(`\n${deps.stylePromptText("Preview only: no changes were saved.", "warning")}`);
    else if (changed)
        logInfo(`\n${deps.stylePromptText("Saved updates.", "success")}`);
    else
        logInfo(`\n${deps.stylePromptText("No changes were needed.", "muted")}`);
    return 0;
}
//# sourceMappingURL=fix.js.map