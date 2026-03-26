import { promises as fs, watch as fsWatch } from "node:fs";
import { basename, dirname } from "node:path";
import { createLogger } from "./logger.js";
const log = createLogger("live-account-sync");
/**
 * Convert an fs.watch filename value to a UTF-8 string or null.
 *
 * @param filename - The value supplied by fs.watch listeners; may be a `string`, `Buffer`, or `null`. Buffers are decoded as UTF-8.
 * @returns `filename` as a UTF-8 string, or `null` when the input is `null`.
 */
function normalizeFsWatchFilename(filename) {
    if (filename === null)
        return null;
    if (typeof filename === "string")
        return filename;
    return filename.toString("utf-8");
}
/**
 * Read the file modification time (mtime) for a given filesystem path in milliseconds.
 *
 * This is a point-in-time snapshot — the value may change immediately due to concurrent writes and callers
 * should not assume stability across subsequent operations. On some platforms (notably Windows) timestamp
 * resolution can be coarse; callers should account for that when comparing mtime values.
 *
 * Treat `path` as sensitive when logging: redact any tokens or secrets before emitting it.
 *
 * @param path - Filesystem path to inspect
 * @returns The file's mtime in milliseconds, or `null` if the path does not exist or the mtime is not finite
 */
async function readMtimeMs(path) {
    try {
        const stats = await fs.stat(path);
        return Number.isFinite(stats.mtimeMs) ? stats.mtimeMs : null;
    }
    catch (error) {
        const code = error.code;
        if (code === "ENOENT" || code === "EBUSY" || code === "EACCES")
            return null;
        throw error;
    }
}
function summarizeWatchPath(path) {
    if (!path)
        return "<unknown>";
    return basename(path);
}
/**
 * Watches account storage and triggers a reload callback when file content
 * changes. Uses fs.watch + polling fallback for Windows reliability.
 */
export class LiveAccountSync {
    reload;
    debounceMs;
    pollIntervalMs;
    watcher = null;
    pollTimer = null;
    debounceTimer = null;
    currentPath = null;
    running = false;
    lastKnownMtimeMs = null;
    lastSyncAt = null;
    reloadCount = 0;
    errorCount = 0;
    reloadInFlight = null;
    constructor(reload, options = {}) {
        this.reload = reload;
        this.debounceMs = Math.max(50, Math.floor(options.debounceMs ?? 250));
        this.pollIntervalMs = Math.max(500, Math.floor(options.pollIntervalMs ?? 2_000));
    }
    async syncToPath(path) {
        if (!path)
            return;
        if (this.currentPath === path && this.running)
            return;
        this.stop();
        this.currentPath = path;
        this.lastKnownMtimeMs = await readMtimeMs(path);
        const targetDir = dirname(path);
        const targetName = basename(path);
        try {
            this.watcher = fsWatch(targetDir, { persistent: false }, (_eventType, filename) => {
                const name = normalizeFsWatchFilename(filename);
                if (!name) {
                    this.scheduleReload("watch");
                    return;
                }
                if (name === targetName || name.startsWith(`${targetName}.`)) {
                    this.scheduleReload("watch");
                }
            });
        }
        catch (error) {
            this.errorCount += 1;
            log.warn("Failed to start fs.watch for account storage", {
                path: summarizeWatchPath(path),
                error: error instanceof Error ? error.message : String(error),
            });
        }
        this.pollTimer = setInterval(() => {
            void this.pollOnce();
        }, this.pollIntervalMs);
        if (typeof this.pollTimer === "object" && "unref" in this.pollTimer && typeof this.pollTimer.unref === "function") {
            this.pollTimer.unref();
        }
        this.running = true;
    }
    stop() {
        this.running = false;
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
    }
    getSnapshot() {
        return {
            path: this.currentPath,
            running: this.running,
            lastKnownMtimeMs: this.lastKnownMtimeMs,
            lastSyncAt: this.lastSyncAt,
            reloadCount: this.reloadCount,
            errorCount: this.errorCount,
        };
    }
    scheduleReload(reason) {
        if (!this.running)
            return;
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            void this.runReload(reason);
        }, this.debounceMs);
    }
    async pollOnce() {
        if (!this.running || !this.currentPath)
            return;
        try {
            const currentMtime = await readMtimeMs(this.currentPath);
            if (currentMtime !== this.lastKnownMtimeMs) {
                this.lastKnownMtimeMs = currentMtime;
                this.scheduleReload("poll");
            }
        }
        catch (error) {
            this.errorCount += 1;
            log.debug("Live account sync poll failed", {
                path: summarizeWatchPath(this.currentPath),
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async runReload(reason) {
        if (!this.running || !this.currentPath)
            return;
        const targetPath = this.currentPath;
        if (this.reloadInFlight) {
            await this.reloadInFlight;
            return;
        }
        this.reloadInFlight = (async () => {
            try {
                await this.reload();
                this.lastSyncAt = Date.now();
                this.reloadCount += 1;
                this.lastKnownMtimeMs = await readMtimeMs(targetPath);
                log.debug("Reloaded account manager from live storage update", {
                    reason,
                    path: summarizeWatchPath(targetPath),
                });
            }
            catch (error) {
                this.errorCount += 1;
                log.warn("Live account sync reload failed", {
                    reason,
                    path: summarizeWatchPath(targetPath),
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        })();
        try {
            await this.reloadInFlight;
        }
        finally {
            this.reloadInFlight = null;
        }
    }
}
//# sourceMappingURL=live-account-sync.js.map