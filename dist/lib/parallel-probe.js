import { createLogger } from "./logger.js";
import { getHealthTracker, getTokenTracker, } from "./rotation.js";
import { clearExpiredRateLimits, isRateLimitedForFamily } from "./accounts/rate-limits.js";
const log = createLogger("parallel-probe");
export function getTopCandidates(accountManagerOrParams, modelFamily, model, maxCandidates) {
    const useNamedParams = typeof modelFamily === "undefined";
    let resolvedAccountManager;
    let resolvedModelFamily;
    let resolvedModel;
    let resolvedMaxCandidates;
    if (useNamedParams) {
        const namedParams = accountManagerOrParams;
        resolvedAccountManager = namedParams.accountManager;
        resolvedModelFamily = namedParams.modelFamily;
        resolvedModel = namedParams.model;
        resolvedMaxCandidates = namedParams.maxCandidates;
    }
    else {
        resolvedAccountManager = accountManagerOrParams;
        resolvedModelFamily = modelFamily;
        resolvedModel = model;
        resolvedMaxCandidates = maxCandidates;
    }
    if (!resolvedAccountManager ||
        typeof resolvedAccountManager.getAccountsSnapshot !== "function") {
        throw new TypeError("getTopCandidates requires accountManager");
    }
    if (!resolvedModelFamily) {
        throw new TypeError("getTopCandidates requires modelFamily");
    }
    if (typeof resolvedMaxCandidates !== "number" ||
        !Number.isInteger(resolvedMaxCandidates) ||
        resolvedMaxCandidates <= 0) {
        throw new TypeError("getTopCandidates requires maxCandidates to be a positive integer");
    }
    const normalizedModelFamily = resolvedModelFamily;
    const normalizedMaxCandidates = resolvedMaxCandidates;
    const accounts = resolvedAccountManager.getAccountsSnapshot();
    if (accounts.length === 0)
        return [];
    const quotaKey = resolvedModel ? `${normalizedModelFamily}:${resolvedModel}` : normalizedModelFamily;
    const healthTracker = getHealthTracker();
    const tokenTracker = getTokenTracker();
    const accountsWithMetrics = [];
    for (const account of accounts) {
        clearExpiredRateLimits(account);
        const isRateLimited = isRateLimitedForFamily(account, normalizedModelFamily, resolvedModel);
        const isCoolingDown = account.coolingDownUntil !== undefined && account.coolingDownUntil > Date.now();
        const isAvailable = !isRateLimited && !isCoolingDown;
        accountsWithMetrics.push({
            index: account.index,
            isAvailable,
            lastUsed: account.lastUsed,
            account,
        });
    }
    const available = accountsWithMetrics.filter((a) => a.isAvailable);
    if (available.length === 0)
        return [];
    const now = Date.now();
    const scored = available.map((a) => {
        const health = healthTracker.getScore(a.index, quotaKey);
        const tokens = tokenTracker.getTokens(a.index, quotaKey);
        const hoursSinceUsed = (now - a.lastUsed) / (1000 * 60 * 60);
        const score = health * 2 + tokens * 5 + hoursSinceUsed * 2.0;
        return { ...a, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, normalizedMaxCandidates).map((s) => s.account);
}
/**
 * Probe accounts in parallel with first-success-wins racing.
 * Immediately aborts losing candidates when a winner is found.
 */
export async function probeAccountsInParallel(candidates, probeFn, _options = {}) {
    if (candidates.length === 0) {
        return null;
    }
    if (candidates.length === 1) {
        const candidate = candidates[0];
        if (!candidate)
            return null;
        const { account, controller } = candidate;
        try {
            const response = await probeFn(account, controller.signal);
            return { type: "success", account, response };
        }
        catch (error) {
            return { type: "failure", account, error: error };
        }
    }
    log.debug(`Probing ${candidates.length} accounts in parallel`);
    let winner = null;
    let resolvedCount = 0;
    return new Promise((resolve) => {
        for (const { account, controller } of candidates) {
            probeFn(account, controller.signal)
                .then((response) => {
                if (!winner) {
                    winner = { type: "success", account, response };
                    log.debug(`Parallel probe succeeded with account ${account.index + 1}`);
                    for (const c of candidates) {
                        if (c.account.index !== account.index) {
                            c.controller.abort();
                        }
                    }
                    resolve(winner);
                }
            })
                .catch((_error) => {
                resolvedCount++;
                if (resolvedCount === candidates.length && !winner) {
                    resolve(null);
                }
            });
        }
    });
}
export function createProbeCandidates(accounts) {
    return accounts.map((account) => ({
        account,
        controller: new AbortController(),
    }));
}
//# sourceMappingURL=parallel-probe.js.map