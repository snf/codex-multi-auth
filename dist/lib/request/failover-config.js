export function parseFailoverMode(value) {
    const normalized = (value ?? "").trim().toLowerCase();
    if (normalized === "aggressive")
        return "aggressive";
    if (normalized === "conservative")
        return "conservative";
    return "balanced";
}
export function parseEnvInt(value) {
    if (value === undefined)
        return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}
//# sourceMappingURL=failover-config.js.map