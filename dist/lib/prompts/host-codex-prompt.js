/**
 * Codex Prompt Fetcher
 *
 * Fetches and caches the codex.txt system prompt from upstream GitHub sources.
 * Uses ETag-based caching to efficiently track updates.
 */
import { join } from "node:path";
import { mkdir, readFile, writeFile, rename, rm } from "node:fs/promises";
import { logDebug } from "../logger.js";
import { getCodexCacheDir } from "../runtime-paths.js";
import { sleep } from "../utils.js";
const DEFAULT_HOST_CODEX_PROMPT_URLS = [
    "https://raw.githubusercontent.com/anomalyco/Codex/dev/packages/Codex/src/session/prompt/codex.txt",
    "https://raw.githubusercontent.com/sst/Codex/dev/packages/Codex/src/session/prompt/codex.txt",
    "https://raw.githubusercontent.com/anomalyco/Codex/main/packages/Codex/src/session/prompt/codex.txt",
    "https://raw.githubusercontent.com/sst/Codex/main/packages/Codex/src/session/prompt/codex.txt",
    "https://raw.githubusercontent.com/anomalyco/Codex/dev/packages/Codex/src/session/prompt/codex.md",
    "https://raw.githubusercontent.com/sst/Codex/dev/packages/Codex/src/session/prompt/codex.md",
    "https://raw.githubusercontent.com/anomalyco/Codex/main/packages/Codex/src/session/prompt/codex.md",
    "https://raw.githubusercontent.com/sst/Codex/main/packages/Codex/src/session/prompt/codex.md",
];
const CODEX_PROMPT_URL_OVERRIDE_ENV = "CODEX_PROMPT_SOURCE_URL";
const LEGACY_HOST_CODEX_URL_OVERRIDE_ENV = "CODEX_CODEX_PROMPT_URL";
const CACHE_DIR = getCodexCacheDir();
const CACHE_FILE = join(CACHE_DIR, "host-codex-prompt.txt");
const CACHE_META_FILE = join(CACHE_DIR, "host-codex-prompt-meta.json");
const LEGACY_CACHE_FILES = [
    {
        content: join(CACHE_DIR, "opencode-codex-prompt.txt"),
        meta: join(CACHE_DIR, "opencode-codex-prompt-meta.json"),
    },
    {
        content: join(CACHE_DIR, "codex-prompt.txt"),
        meta: join(CACHE_DIR, "codex-prompt-meta.json"),
    },
];
const CACHE_TTL_MS = 15 * 60 * 1000;
const RETRYABLE_FS_ERROR_CODES = new Set(["EBUSY", "EPERM"]);
const WRITE_RETRY_ATTEMPTS = 5;
const WRITE_RETRY_BASE_DELAY_MS = 10;
let memoryCache = null;
let refreshPromise = null;
function isFresh(lastChecked) {
    return Date.now() - lastChecked < CACHE_TTL_MS;
}
function redactSourceForLog(source) {
    try {
        const parsed = new URL(source);
        return `${parsed.origin}${parsed.pathname}`;
    }
    catch {
        return "<invalid-url>";
    }
}
function parseSourceUrl(source) {
    if (!source)
        return undefined;
    const trimmed = source.trim();
    if (!trimmed)
        return undefined;
    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            logDebug("Ignoring codex prompt source override due to protocol", {
                source: redactSourceForLog(trimmed),
            });
            return undefined;
        }
        return trimmed;
    }
    catch {
        logDebug("Ignoring invalid codex prompt source override", {
            source: redactSourceForLog(trimmed),
        });
        return undefined;
    }
}
function sourceCacheKey(source) {
    try {
        const parsed = new URL(source);
        return `${parsed.origin}${parsed.pathname}`;
    }
    catch {
        return source.trim();
    }
}
function isRetryableFsError(error) {
    const code = error?.code;
    return typeof code === "string" && RETRYABLE_FS_ERROR_CODES.has(code);
}
async function writeFileWithRetry(filePath, content) {
    let lastError;
    for (let attempt = 0; attempt < WRITE_RETRY_ATTEMPTS; attempt += 1) {
        try {
            await writeFile(filePath, content, "utf-8");
            return;
        }
        catch (error) {
            if (!isRetryableFsError(error) || attempt + 1 >= WRITE_RETRY_ATTEMPTS) {
                throw error;
            }
            lastError = error;
            await sleep(WRITE_RETRY_BASE_DELAY_MS * 2 ** attempt);
        }
    }
    throw lastError instanceof Error ? lastError : new Error("Failed to write prompt cache file");
}
async function renameWithRetry(fromPath, toPath) {
    let lastError;
    for (let attempt = 0; attempt < WRITE_RETRY_ATTEMPTS; attempt += 1) {
        try {
            await rename(fromPath, toPath);
            return;
        }
        catch (error) {
            if (!isRetryableFsError(error) || attempt + 1 >= WRITE_RETRY_ATTEMPTS) {
                throw error;
            }
            lastError = error;
            await sleep(WRITE_RETRY_BASE_DELAY_MS * 2 ** attempt);
        }
    }
    throw lastError instanceof Error ? lastError : new Error("Failed to rename prompt cache file");
}
async function removeFileQuietly(path) {
    try {
        await rm(path, { force: true });
    }
    catch {
        // Best-effort cleanup only.
    }
}
async function writeCacheFilesAtomically(content, meta) {
    await mkdir(CACHE_DIR, { recursive: true });
    const nonce = `${Date.now()}-${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
    const contentTmp = `${CACHE_FILE}.${nonce}.tmp`;
    const metaTmp = `${CACHE_META_FILE}.${nonce}.tmp`;
    const metaJson = JSON.stringify(meta, null, 2);
    await writeFileWithRetry(contentTmp, content);
    try {
        await writeFileWithRetry(metaTmp, metaJson);
    }
    catch (error) {
        await removeFileQuietly(contentTmp);
        throw error;
    }
    let renamedContent = false;
    try {
        await renameWithRetry(contentTmp, CACHE_FILE);
        renamedContent = true;
        await renameWithRetry(metaTmp, CACHE_META_FILE);
    }
    catch (error) {
        if (renamedContent) {
            // If only one rename succeeded, restore consistency by rewriting the content file.
            try {
                await writeFileWithRetry(CACHE_FILE, content);
            }
            catch (recoveryError) {
                logDebug("Failed to restore host-codex prompt content after partial rename failure", {
                    error: String(recoveryError),
                });
            }
        }
        await removeFileQuietly(contentTmp);
        await removeFileQuietly(metaTmp);
        throw error;
    }
}
function resolvePromptSources() {
    const sources = [];
    const seen = new Set();
    const add = (source) => {
        const parsed = parseSourceUrl(source);
        if (!parsed || seen.has(parsed))
            return;
        seen.add(parsed);
        sources.push(parsed);
    };
    add(process.env[CODEX_PROMPT_URL_OVERRIDE_ENV]);
    add(process.env[LEGACY_HOST_CODEX_URL_OVERRIDE_ENV]);
    for (const source of DEFAULT_HOST_CODEX_PROMPT_URLS) {
        add(source);
    }
    return sources;
}
async function readDiskCache() {
    const tryRead = async (contentPath, metaPath) => {
        try {
            const [content, metaContent] = await Promise.all([
                readFile(contentPath, "utf-8"),
                readFile(metaPath, "utf-8"),
            ]);
            const meta = JSON.parse(metaContent);
            if (!meta.lastChecked) {
                return null;
            }
            return { content, meta };
        }
        catch {
            return null;
        }
    };
    const currentCache = await tryRead(CACHE_FILE, CACHE_META_FILE);
    if (currentCache) {
        return currentCache;
    }
    for (const legacy of LEGACY_CACHE_FILES) {
        const legacyCache = await tryRead(legacy.content, legacy.meta);
        if (!legacyCache)
            continue;
        try {
            await writeCacheFilesAtomically(legacyCache.content, legacyCache.meta);
        }
        catch (error) {
            logDebug("Failed to migrate legacy host-codex prompt cache; using legacy cache in memory", {
                error: String(error),
            });
        }
        return legacyCache;
    }
    return null;
}
async function saveDiskCache(content, etag, sourceUrl) {
    const meta = {
        etag,
        lastFetch: new Date().toISOString(),
        lastChecked: Date.now(),
        sourceKey: sourceCacheKey(sourceUrl),
    };
    await writeCacheFilesAtomically(content, meta);
    return meta;
}
async function refreshPrompt(cachedMeta, cachedContent) {
    const sources = resolvePromptSources();
    let lastFailure = null;
    for (const sourceUrl of sources) {
        const headers = {};
        const currentSourceKey = sourceCacheKey(sourceUrl);
        const cachedSourceKey = cachedMeta?.sourceKey ??
            (cachedMeta?.sourceUrl ? sourceCacheKey(cachedMeta.sourceUrl) : undefined);
        const canUseConditionalRequest = !!cachedMeta?.etag &&
            (!cachedSourceKey || cachedSourceKey === currentSourceKey);
        if (canUseConditionalRequest) {
            headers["If-None-Match"] = cachedMeta.etag;
        }
        let response;
        try {
            response = await fetch(sourceUrl, { headers });
        }
        catch (error) {
            lastFailure = `${redactSourceForLog(sourceUrl)}: ${String(error)}`;
            logDebug("Codex prompt source fetch failed", {
                sourceUrl: redactSourceForLog(sourceUrl),
                error: String(error),
            });
            continue;
        }
        if (response.status === 304 && cachedContent) {
            const refreshedMeta = {
                etag: cachedMeta?.etag ?? "",
                lastFetch: cachedMeta?.lastFetch ?? new Date().toISOString(),
                lastChecked: Date.now(),
                sourceKey: currentSourceKey,
            };
            memoryCache = { content: cachedContent, meta: refreshedMeta };
            await mkdir(CACHE_DIR, { recursive: true });
            await writeFileWithRetry(CACHE_META_FILE, JSON.stringify(refreshedMeta, null, 2));
            return cachedContent;
        }
        if (!response.ok) {
            lastFailure = `${redactSourceForLog(sourceUrl)}: HTTP ${response.status}`;
            logDebug("Codex prompt source returned non-OK response", {
                sourceUrl: redactSourceForLog(sourceUrl),
                status: response.status,
            });
            continue;
        }
        const content = await response.text();
        const etag = response.headers.get("etag") || "";
        const meta = await saveDiskCache(content, etag, sourceUrl);
        memoryCache = { content, meta };
        return content;
    }
    throw new Error(`Failed to fetch codex prompt from all sources${lastFailure ? ` (${lastFailure})` : ""}`);
}
function scheduleRefresh(cachedMeta, cachedContent) {
    if (refreshPromise)
        return;
    refreshPromise = refreshPrompt(cachedMeta, cachedContent)
        .then(() => undefined)
        .catch((error) => {
        logDebug("Codex prompt background refresh failed", {
            error: String(error),
        });
    })
        .finally(() => {
        refreshPromise = null;
    });
}
/**
 * Fetch codex.txt prompt with ETag-based caching
 * Uses HTTP conditional requests to efficiently check for updates
 *
 * Rate limit protection: Only checks GitHub if cache is older than 15 minutes
 * @returns The codex.txt content
 */
export async function getHostCodexPrompt() {
    if (memoryCache && isFresh(memoryCache.meta.lastChecked)) {
        return memoryCache.content;
    }
    const diskCache = await readDiskCache();
    if (diskCache) {
        memoryCache = diskCache;
        if (isFresh(diskCache.meta.lastChecked)) {
            return diskCache.content;
        }
        // Serve stale content immediately and refresh in the background.
        memoryCache = {
            content: diskCache.content,
            meta: { ...diskCache.meta, lastChecked: Date.now() },
        };
        scheduleRefresh(diskCache.meta, diskCache.content);
        return diskCache.content;
    }
    try {
        return await refreshPrompt(memoryCache?.meta ?? null, memoryCache?.content ?? null);
    }
    catch (error) {
        const staleContent = memoryCache?.content;
        if (staleContent) {
            return staleContent;
        }
        throw new Error(`Failed to fetch codex.txt and no cache available: ${error}`);
    }
}
/**
 * Get first N characters of the cached prompt for verification
 * @param chars Number of characters to get (default: 50)
 * @returns First N characters or null if not cached
 */
export async function getCachedPromptPrefix(chars = 50) {
    try {
        const content = await readFile(CACHE_FILE, "utf-8");
        return content.substring(0, chars);
    }
    catch {
        return null;
    }
}
/**
 * Prewarm the prompt cache without blocking startup.
 */
export function prewarmHostCodexPrompt() {
    void getHostCodexPrompt().catch((error) => {
        logDebug("Codex prompt prewarm failed", { error: String(error) });
    });
}
//# sourceMappingURL=host-codex-prompt.js.map