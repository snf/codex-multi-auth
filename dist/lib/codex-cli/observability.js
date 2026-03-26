import { createHash } from "node:crypto";
const DEFAULT_METRICS = {
    readAttempts: 0,
    readSuccesses: 0,
    readMisses: 0,
    readFailures: 0,
    legacySyncEnvUses: 0,
    reconcileAttempts: 0,
    reconcileChanges: 0,
    reconcileNoops: 0,
    reconcileFailures: 0,
    writeAttempts: 0,
    writeSuccesses: 0,
    writeFailures: 0,
};
let metrics = { ...DEFAULT_METRICS };
export function incrementCodexCliMetric(key, delta = 1) {
    metrics[key] += delta;
}
export function getCodexCliMetricsSnapshot() {
    return { ...metrics };
}
export function resetCodexCliMetricsForTests() {
    metrics = { ...DEFAULT_METRICS };
}
export function makeAccountFingerprint(input) {
    const raw = typeof input.accountId === "string" && input.accountId.trim().length > 0
        ? input.accountId.trim()
        : typeof input.email === "string" && input.email.trim().length > 0
            ? input.email.trim().toLowerCase()
            : "";
    if (!raw)
        return undefined;
    return createHash("sha256").update(raw).digest("hex").slice(0, 12);
}
//# sourceMappingURL=observability.js.map