import { formatAccountLabel, formatCooldown, formatWaitTime, } from "../../accounts.js";
export async function runStatusCommand(deps) {
    deps.setStoragePath(null);
    const storage = await deps.loadAccounts();
    const path = deps.getStoragePath();
    const logInfo = deps.logInfo ?? console.log;
    if (!storage || storage.accounts.length === 0) {
        logInfo("No accounts configured.");
        logInfo(`Storage: ${path}`);
        return 0;
    }
    const now = deps.getNow?.() ?? Date.now();
    const activeIndex = deps.resolveActiveIndex(storage, "codex");
    logInfo(`Accounts (${storage.accounts.length})`);
    logInfo(`Storage: ${path}`);
    logInfo("");
    for (let i = 0; i < storage.accounts.length; i += 1) {
        const account = storage.accounts[i];
        if (!account)
            continue;
        const label = formatAccountLabel(account, i);
        const markers = [];
        if (i === activeIndex)
            markers.push("current");
        if (account.enabled === false)
            markers.push("disabled");
        const rateLimit = deps.formatRateLimitEntry(account, now, "codex");
        if (rateLimit)
            markers.push("rate-limited");
        const cooldown = formatCooldown(account, now);
        if (cooldown)
            markers.push(`cooldown:${cooldown}`);
        const markerLabel = markers.length > 0 ? ` [${markers.join(", ")}]` : "";
        const lastUsed = typeof account.lastUsed === "number" && account.lastUsed > 0
            ? `used ${formatWaitTime(now - account.lastUsed)} ago`
            : "never used";
        logInfo(`${i + 1}. ${label}${markerLabel} ${lastUsed}`);
    }
    return 0;
}
export function runFeaturesCommand(deps) {
    const logInfo = deps.logInfo ?? console.log;
    logInfo(`Implemented features (${deps.implementedFeatures.length})`);
    logInfo("");
    for (const feature of deps.implementedFeatures) {
        logInfo(`${feature.id}. ${feature.name}`);
    }
    return 0;
}
//# sourceMappingURL=status.js.map