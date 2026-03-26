export const SETTINGS_WRITE_MAX_ATTEMPTS = 4;
export const SETTINGS_WRITE_BASE_DELAY_MS = 50;
export const SETTINGS_WRITE_MAX_DELAY_MS = 30_000;
export const RETRYABLE_SETTINGS_WRITE_CODES = new Set([
    "EBUSY",
    "EPERM",
    "EAGAIN",
    "ENOTEMPTY",
    "EACCES",
]);
const settingsWriteQueues = new Map();
export function readErrorNumber(value) {
    if (typeof value === "number" && Number.isFinite(value))
        return value;
    if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed))
            return parsed;
    }
    return undefined;
}
export function getErrorStatusCode(error) {
    if (!error || typeof error !== "object")
        return undefined;
    const record = error;
    return readErrorNumber(record.status) ?? readErrorNumber(record.statusCode);
}
export function getRetryAfterMs(error) {
    if (!error || typeof error !== "object")
        return undefined;
    const record = error;
    return (readErrorNumber(record.retryAfterMs) ??
        readErrorNumber(record.retry_after_ms) ??
        readErrorNumber(record.retryAfter) ??
        readErrorNumber(record.retry_after));
}
export function isRetryableSettingsWriteError(error) {
    const statusCode = getErrorStatusCode(error);
    if (statusCode === 429)
        return true;
    const code = error?.code;
    return typeof code === "string" && RETRYABLE_SETTINGS_WRITE_CODES.has(code);
}
export function resolveRetryDelayMs(error, attempt) {
    const retryAfterMs = getRetryAfterMs(error);
    if (typeof retryAfterMs === "number" &&
        Number.isFinite(retryAfterMs) &&
        retryAfterMs > 0) {
        return Math.max(10, Math.min(SETTINGS_WRITE_MAX_DELAY_MS, Math.round(retryAfterMs)));
    }
    return Math.min(SETTINGS_WRITE_MAX_DELAY_MS, SETTINGS_WRITE_BASE_DELAY_MS * 2 ** attempt);
}
export async function enqueueSettingsWrite(pathKey, task) {
    const previous = settingsWriteQueues.get(pathKey) ?? Promise.resolve();
    const queued = previous.catch(() => { }).then(task);
    const queueTail = queued.then(() => undefined, () => undefined);
    settingsWriteQueues.set(pathKey, queueTail);
    try {
        return await queued;
    }
    finally {
        if (settingsWriteQueues.get(pathKey) === queueTail) {
            settingsWriteQueues.delete(pathKey);
        }
    }
}
export async function withQueuedRetry(pathKey, task, deps) {
    return enqueueSettingsWrite(pathKey, async () => {
        let lastError;
        for (let attempt = 0; attempt < SETTINGS_WRITE_MAX_ATTEMPTS; attempt += 1) {
            try {
                return await task();
            }
            catch (error) {
                lastError = error;
                if (!isRetryableSettingsWriteError(error)) {
                    throw error;
                }
                if (attempt >= SETTINGS_WRITE_MAX_ATTEMPTS - 1) {
                    break;
                }
                await deps.sleep(resolveRetryDelayMs(error, attempt));
            }
        }
        throw lastError;
    });
}
//# sourceMappingURL=settings-write-queue.js.map