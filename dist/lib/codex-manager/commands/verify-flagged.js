export async function runVerifyFlaggedCommand(args, deps) {
    const logInfo = deps.logInfo ?? console.log;
    const logError = deps.logError ?? console.error;
    if (args.includes("--help") || args.includes("-h")) {
        deps.printVerifyFlaggedUsage();
        return 0;
    }
    const parsedArgs = deps.parseVerifyFlaggedArgs(args);
    if (!parsedArgs.ok) {
        logError(parsedArgs.message);
        deps.printVerifyFlaggedUsage();
        return 1;
    }
    const options = parsedArgs.options;
    deps.setStoragePath(null);
    const flaggedStorage = await deps.loadFlaggedAccounts();
    if (flaggedStorage.accounts.length === 0) {
        if (options.json) {
            logInfo(JSON.stringify({
                command: "verify-flagged",
                total: 0,
                restored: 0,
                healthyFlagged: 0,
                stillFlagged: 0,
                changed: false,
                dryRun: options.dryRun,
                restore: options.restore,
                reports: [],
            }, null, 2));
            return 0;
        }
        logInfo("No flagged accounts to check.");
        return 0;
    }
    let storageChanged = false;
    let flaggedChanged = false;
    const reports = [];
    const nextFlaggedAccounts = [];
    const now = deps.getNow?.() ?? Date.now();
    const refreshChecks = [];
    for (let i = 0; i < flaggedStorage.accounts.length; i += 1) {
        const flagged = flaggedStorage.accounts[i];
        if (!flagged)
            continue;
        const label = deps.formatAccountLabel(flagged, i);
        refreshChecks.push({
            index: i,
            flagged,
            label,
            result: await deps.queuedRefresh(flagged.refreshToken),
        });
    }
    const applyRefreshChecks = (storage) => {
        let nextStorageChanged = false;
        let nextFlaggedChanged = false;
        const nextReports = [];
        const pendingFlaggedAccounts = [];
        for (const check of refreshChecks) {
            const { index: i, flagged, label, result } = check;
            if (result.type === "success") {
                if (!options.restore) {
                    const tokenAccountId = deps.extractAccountId(result.access);
                    const nextIdentity = deps.resolveStoredAccountIdentity(flagged.accountId, flagged.accountIdSource, tokenAccountId);
                    const nextFlagged = {
                        ...flagged,
                        refreshToken: result.refresh,
                        accessToken: result.access,
                        expiresAt: result.expires,
                        accountId: nextIdentity.accountId,
                        accountIdSource: nextIdentity.accountIdSource,
                        email: deps.sanitizeEmail(deps.extractAccountEmail(result.access, result.idToken)) ?? flagged.email,
                        lastUsed: now,
                        lastError: undefined,
                    };
                    pendingFlaggedAccounts.push(nextFlagged);
                    if (JSON.stringify(nextFlagged) !== JSON.stringify(flagged))
                        nextFlaggedChanged = true;
                    nextReports.push({
                        index: i,
                        label,
                        outcome: "healthy-flagged",
                        message: "session is healthy (left in flagged list due to --no-restore)",
                    });
                    continue;
                }
                const upsertResult = deps.upsertRecoveredFlaggedAccount(storage, flagged, result, now);
                if (upsertResult.restored) {
                    nextStorageChanged = nextStorageChanged || upsertResult.changed;
                    nextFlaggedChanged = true;
                    nextReports.push({
                        index: i,
                        label,
                        outcome: "restored",
                        message: upsertResult.message,
                    });
                    continue;
                }
                const tokenAccountId = deps.extractAccountId(result.access);
                const nextIdentity = deps.resolveStoredAccountIdentity(flagged.accountId, flagged.accountIdSource, tokenAccountId);
                const updatedFlagged = {
                    ...flagged,
                    refreshToken: result.refresh,
                    accessToken: result.access,
                    expiresAt: result.expires,
                    accountId: nextIdentity.accountId,
                    accountIdSource: nextIdentity.accountIdSource,
                    email: deps.sanitizeEmail(deps.extractAccountEmail(result.access, result.idToken)) ?? flagged.email,
                    lastUsed: now,
                    lastError: upsertResult.message,
                };
                pendingFlaggedAccounts.push(updatedFlagged);
                if (JSON.stringify(updatedFlagged) !== JSON.stringify(flagged))
                    nextFlaggedChanged = true;
                nextReports.push({
                    index: i,
                    label,
                    outcome: "restore-skipped",
                    message: upsertResult.message,
                });
                continue;
            }
            const detail = deps.normalizeFailureDetail(result.message, result.reason);
            const failedFlagged = {
                ...flagged,
                lastError: detail,
            };
            pendingFlaggedAccounts.push(failedFlagged);
            if ((flagged.lastError ?? "") !== detail)
                nextFlaggedChanged = true;
            nextReports.push({
                index: i,
                label,
                outcome: "still-flagged",
                message: detail,
            });
        }
        return {
            storageChanged: nextStorageChanged,
            flaggedChanged: nextFlaggedChanged,
            reports: nextReports,
            nextFlaggedAccounts: pendingFlaggedAccounts,
        };
    };
    const assignRefreshCheckResult = (result) => {
        storageChanged = result.storageChanged;
        flaggedChanged = result.flaggedChanged;
        reports.length = 0;
        reports.push(...result.reports);
        nextFlaggedAccounts.length = 0;
        nextFlaggedAccounts.push(...result.nextFlaggedAccounts);
    };
    if (options.restore) {
        if (options.dryRun) {
            assignRefreshCheckResult(applyRefreshChecks((await deps.loadAccounts()) ?? deps.createEmptyAccountStorage()));
        }
        else {
            let transactionResult;
            await deps.withAccountAndFlaggedStorageTransaction(async (loadedStorage, persist) => {
                const nextStorage = loadedStorage
                    ? structuredClone(loadedStorage)
                    : deps.createEmptyAccountStorage();
                const attemptResult = applyRefreshChecks(nextStorage);
                if (!attemptResult.storageChanged) {
                    transactionResult = attemptResult;
                    return;
                }
                deps.normalizeDoctorIndexes(nextStorage);
                await persist(nextStorage, {
                    version: 1,
                    accounts: attemptResult.nextFlaggedAccounts,
                });
                transactionResult = attemptResult;
            });
            if (!transactionResult) {
                logError("verify-flagged: transaction completed without a result; storage may be unchanged");
                return 1;
            }
            assignRefreshCheckResult(transactionResult);
        }
    }
    else {
        assignRefreshCheckResult(applyRefreshChecks(deps.createEmptyAccountStorage()));
    }
    const remainingFlagged = nextFlaggedAccounts.length;
    const restored = reports.filter((report) => report.outcome === "restored").length;
    const healthyFlagged = reports.filter((report) => report.outcome === "healthy-flagged").length;
    const stillFlagged = reports.filter((report) => report.outcome === "still-flagged").length;
    const changed = storageChanged || flaggedChanged;
    if (!options.dryRun &&
        flaggedChanged &&
        (!options.restore || !storageChanged)) {
        await deps.saveFlaggedAccounts({
            version: 1,
            accounts: nextFlaggedAccounts,
        });
    }
    if (options.json) {
        logInfo(JSON.stringify({
            command: "verify-flagged",
            total: flaggedStorage.accounts.length,
            restored,
            healthyFlagged,
            stillFlagged,
            remainingFlagged,
            changed,
            dryRun: options.dryRun,
            restore: options.restore,
            reports,
        }, null, 2));
        return 0;
    }
    logInfo(deps.stylePromptText(`Checking ${flaggedStorage.accounts.length} flagged account(s)...`, "accent"));
    for (const report of reports) {
        const tone = report.outcome === "restored"
            ? "success"
            : report.outcome === "healthy-flagged" ||
                report.outcome === "restore-skipped"
                ? "warning"
                : "danger";
        const marker = report.outcome === "restored"
            ? "✓"
            : report.outcome === "healthy-flagged" ||
                report.outcome === "restore-skipped"
                ? "!"
                : "✗";
        logInfo(`${deps.stylePromptText(marker, tone)} ${deps.stylePromptText(`${report.index + 1}. ${report.label}`, "accent")} ${deps.stylePromptText("|", "muted")} ${deps.styleAccountDetailText(report.message, tone)}`);
    }
    logInfo("");
    logInfo(deps.formatResultSummary([
        {
            text: `${restored} restored`,
            tone: restored > 0 ? "success" : "muted",
        },
        {
            text: `${healthyFlagged} healthy (kept flagged)`,
            tone: healthyFlagged > 0 ? "warning" : "muted",
        },
        {
            text: `${stillFlagged} still flagged`,
            tone: stillFlagged > 0 ? "danger" : "muted",
        },
    ]));
    if (options.dryRun) {
        logInfo(deps.stylePromptText("Preview only: no changes were saved.", "warning"));
    }
    else if (!changed) {
        logInfo(deps.stylePromptText("No storage changes were needed.", "muted"));
    }
    return 0;
}
//# sourceMappingURL=verify-flagged.js.map