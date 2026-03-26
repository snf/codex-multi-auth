import { promises as fs } from "node:fs";
import { getUnifiedSettingsPath } from "../unified-settings.js";
export function resolvePluginConfigSavePathKey() {
    const envPath = (process.env.CODEX_MULTI_AUTH_CONFIG_PATH ?? "").trim();
    return envPath.length > 0 ? envPath : getUnifiedSettingsPath();
}
export function formatPersistError(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
export function warnPersistFailure(scope, error) {
    console.warn(`Settings save failed (${scope}) after retries: ${formatPersistError(error)}`);
}
export async function readFileWithRetry(path, deps) {
    for (let attempt = 0;; attempt += 1) {
        try {
            return await fs.readFile(path, "utf-8");
        }
        catch (error) {
            const code = error.code;
            if (code === "ENOENT")
                throw error;
            if (!code ||
                !deps.retryableCodes.has(code) ||
                attempt >= deps.maxAttempts - 1) {
                throw error;
            }
            await deps.sleep(25 * 2 ** attempt);
        }
    }
}
//# sourceMappingURL=settings-persist-utils.js.map