import { sleep } from "../utils.js";
const RETRYABLE_READ_CODES = new Set(["EBUSY", "EAGAIN"]);
function isRetryableReadError(error) {
    const code = error?.code;
    return typeof code === "string" && RETRYABLE_READ_CODES.has(code);
}
async function readFileWithRetry(path, deps) {
    for (let attempt = 0;; attempt += 1) {
        try {
            return await deps.readFile(path, "utf-8");
        }
        catch (error) {
            if (!isRetryableReadError(error) || attempt >= 3) {
                throw error;
            }
            await (deps.sleep ?? sleep)(10 * 2 ** attempt);
        }
    }
}
export async function loadFlaggedAccountsFromFile(path, deps) {
    const content = await readFileWithRetry(path, deps);
    const data = JSON.parse(content);
    return deps.normalizeFlaggedStorage(data);
}
//# sourceMappingURL=flagged-storage-file.js.map