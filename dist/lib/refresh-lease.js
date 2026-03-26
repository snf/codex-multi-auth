import { createHash } from "node:crypto";
import { existsSync, promises as fs } from "node:fs";
import { join } from "node:path";
import { createLogger } from "./logger.js";
import { getCodexMultiAuthDir } from "./runtime-paths.js";
import { safeParseTokenResult } from "./schemas.js";
const log = createLogger("refresh-lease");
const DEFAULT_LEASE_TTL_MS = 30_000;
const DEFAULT_WAIT_TIMEOUT_MS = 35_000;
const DEFAULT_POLL_INTERVAL_MS = 150;
const DEFAULT_RESULT_TTL_MS = 20_000;
const RETRYABLE_IO_ERRORS = new Set(["EBUSY", "EPERM", "EMFILE", "ENFILE"]);
function parseBooleanEnv(value) {
    if (value === undefined)
        return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === "1" || normalized === "true" || normalized === "yes")
        return true;
    if (normalized === "0" || normalized === "false" || normalized === "no")
        return false;
    return undefined;
}
function parseEnvInt(value) {
    if (value === undefined)
        return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function sleep(delayMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, delayMs);
    });
}
function hashRefreshToken(refreshToken) {
    return createHash("sha256").update(refreshToken).digest("hex");
}
function isRecord(value) {
    return value !== null && typeof value === "object";
}
function parseLeasePayload(raw) {
    if (!isRecord(raw))
        return null;
    const tokenHash = typeof raw.tokenHash === "string" ? raw.tokenHash : "";
    const pid = typeof raw.pid === "number" ? raw.pid : Number.NaN;
    const acquiredAt = typeof raw.acquiredAt === "number" ? raw.acquiredAt : Number.NaN;
    const expiresAt = typeof raw.expiresAt === "number" ? raw.expiresAt : Number.NaN;
    if (tokenHash.length === 0 ||
        !Number.isFinite(pid) ||
        !Number.isFinite(acquiredAt) ||
        !Number.isFinite(expiresAt)) {
        return null;
    }
    return {
        tokenHash,
        pid: Math.floor(pid),
        acquiredAt: Math.floor(acquiredAt),
        expiresAt: Math.floor(expiresAt),
    };
}
function parseResultPayload(raw) {
    if (!isRecord(raw))
        return null;
    const tokenHash = typeof raw.tokenHash === "string" ? raw.tokenHash : "";
    const createdAt = typeof raw.createdAt === "number" ? raw.createdAt : Number.NaN;
    const result = safeParseTokenResult(raw.result);
    if (tokenHash.length === 0 || !Number.isFinite(createdAt) || !result)
        return null;
    return {
        tokenHash,
        createdAt: Math.floor(createdAt),
        result,
    };
}
async function readJson(path, fsOps) {
    try {
        const content = await fsOps.readFile(path, "utf8");
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
async function safeUnlink(path, options, fsOps = fs) {
    const attempts = Math.max(1, Math.floor(options?.attempts ?? 4));
    const baseDelayMs = Math.max(5, Math.floor(options?.baseDelayMs ?? 15));
    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            await fsOps.unlink(path);
            return true;
        }
        catch (error) {
            const code = error.code;
            if (code === "ENOENT")
                return true;
            const canRetry = RETRYABLE_IO_ERRORS.has(code ?? "");
            if (canRetry && attempt + 1 < attempts) {
                await sleep(baseDelayMs * (2 ** attempt));
                continue;
            }
            log.debug("Failed to remove lease artifact", {
                path,
                error: error instanceof Error ? error.message : String(error),
                code,
            });
            return false;
        }
    }
    return false;
}
function isRetryableFsCode(code) {
    return RETRYABLE_IO_ERRORS.has(code ?? "");
}
export class RefreshLeaseCoordinator {
    enabled;
    leaseDir;
    leaseTtlMs;
    waitTimeoutMs;
    pollIntervalMs;
    resultTtlMs;
    fsOps;
    constructor(options = {}) {
        this.enabled = options.enabled ?? true;
        this.leaseDir = options.leaseDir ?? join(getCodexMultiAuthDir(), "refresh-leases");
        this.leaseTtlMs = Math.max(1_000, Math.floor(options.leaseTtlMs ?? DEFAULT_LEASE_TTL_MS));
        this.waitTimeoutMs = Math.max(0, Math.floor(options.waitTimeoutMs ?? DEFAULT_WAIT_TIMEOUT_MS));
        this.pollIntervalMs = Math.max(50, Math.floor(options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS));
        this.resultTtlMs = Math.max(1_000, Math.floor(options.resultTtlMs ?? DEFAULT_RESULT_TTL_MS));
        this.fsOps = options.fsOps ?? fs;
    }
    static fromEnvironment() {
        const testMode = process.env.VITEST === "true" || process.env.NODE_ENV === "test";
        const enabled = parseBooleanEnv(process.env.CODEX_AUTH_REFRESH_LEASE) ??
            (testMode ? false : true);
        return new RefreshLeaseCoordinator({
            enabled,
            leaseDir: (process.env.CODEX_AUTH_REFRESH_LEASE_DIR ?? "").trim() || undefined,
            leaseTtlMs: parseEnvInt(process.env.CODEX_AUTH_REFRESH_LEASE_TTL_MS),
            waitTimeoutMs: parseEnvInt(process.env.CODEX_AUTH_REFRESH_LEASE_WAIT_MS),
            pollIntervalMs: parseEnvInt(process.env.CODEX_AUTH_REFRESH_LEASE_POLL_MS),
            resultTtlMs: parseEnvInt(process.env.CODEX_AUTH_REFRESH_LEASE_RESULT_TTL_MS),
        });
    }
    async acquire(refreshToken) {
        if (!this.enabled) {
            return this.createBypassHandle("disabled");
        }
        if (refreshToken.trim().length === 0) {
            return this.createBypassHandle("empty-token");
        }
        const tokenHash = hashRefreshToken(refreshToken);
        const lockPath = join(this.leaseDir, `${tokenHash}.lock`);
        const resultPath = join(this.leaseDir, `${tokenHash}.result.json`);
        await this.fsOps.mkdir(this.leaseDir, { recursive: true });
        void this.pruneExpiredArtifacts();
        const deadline = Date.now() + this.waitTimeoutMs;
        while (true) {
            const cachedResult = await this.readFreshResult(resultPath, tokenHash);
            if (cachedResult) {
                return {
                    role: "follower",
                    result: cachedResult,
                    release: async () => {
                        // Follower does not own lock.
                    },
                };
            }
            try {
                const handle = await this.fsOps.open(lockPath, "wx");
                try {
                    const now = Date.now();
                    const payload = {
                        tokenHash,
                        pid: process.pid,
                        acquiredAt: now,
                        expiresAt: now + this.leaseTtlMs,
                    };
                    await handle.writeFile(`${JSON.stringify(payload)}\n`, "utf8");
                }
                finally {
                    await handle.close();
                }
                return this.createOwnerHandle(tokenHash, lockPath, resultPath);
            }
            catch (error) {
                const code = error.code;
                if (code !== "EEXIST") {
                    log.warn("Refresh lease acquisition failed; proceeding without lease", {
                        error: error instanceof Error ? error.message : String(error),
                    });
                    return this.createBypassHandle("acquire-error");
                }
                const stale = await this.assessLockStaleness(lockPath, tokenHash);
                if (stale.state === "stale") {
                    const removed = await safeUnlink(lockPath, undefined, this.fsOps);
                    if (removed)
                        continue;
                    if (Date.now() >= deadline) {
                        log.warn("Refresh lease wait timeout while stale lock could not be removed", {
                            waitTimeoutMs: this.waitTimeoutMs,
                        });
                        return this.createBypassHandle("wait-timeout");
                    }
                    await sleep(this.pollIntervalMs);
                    continue;
                }
                if (Date.now() >= deadline) {
                    log.warn("Refresh lease wait timeout; proceeding without lease", {
                        waitTimeoutMs: this.waitTimeoutMs,
                    });
                    return this.createBypassHandle("wait-timeout");
                }
                await sleep(this.pollIntervalMs);
            }
        }
    }
    createBypassHandle(reason) {
        log.debug("Bypassing refresh lease", { reason });
        return {
            role: "bypass",
            release: async () => {
                // No-op
            },
        };
    }
    createOwnerHandle(tokenHash, lockPath, resultPath) {
        let released = false;
        return {
            role: "owner",
            release: async (result) => {
                if (released)
                    return;
                released = true;
                try {
                    if (result) {
                        await this.writeResult(resultPath, tokenHash, result);
                    }
                }
                finally {
                    await safeUnlink(lockPath, undefined, this.fsOps);
                }
            },
        };
    }
    async writeResult(resultPath, tokenHash, result) {
        const payload = {
            tokenHash,
            createdAt: Date.now(),
            result,
        };
        const tempPath = `${resultPath}.${process.pid}.${Date.now()}.tmp`;
        try {
            await this.fsOps.writeFile(tempPath, `${JSON.stringify(payload)}\n`, "utf8");
            await this.fsOps.rename(tempPath, resultPath);
        }
        finally {
            await safeUnlink(tempPath, undefined, this.fsOps);
        }
    }
    async readFreshResult(resultPath, tokenHash) {
        if (!existsSync(resultPath))
            return null;
        const parsed = parseResultPayload(await readJson(resultPath, this.fsOps));
        if (!parsed || parsed.tokenHash !== tokenHash) {
            return null;
        }
        const ageMs = Date.now() - parsed.createdAt;
        if (ageMs > this.resultTtlMs) {
            await safeUnlink(resultPath, undefined, this.fsOps);
            return null;
        }
        return parsed.result;
    }
    async assessLockStaleness(lockPath, tokenHash) {
        const raw = await readJson(lockPath, this.fsOps);
        if (raw === null) {
            if (!existsSync(lockPath)) {
                return { state: "stale", reason: "missing" };
            }
            return { state: "unknown", reason: "unreadable" };
        }
        const parsed = parseLeasePayload(raw);
        if (!parsed) {
            return { state: "unknown", reason: "invalid-payload" };
        }
        if (parsed.tokenHash !== tokenHash) {
            return { state: "unknown", reason: "token-mismatch" };
        }
        if (parsed.expiresAt <= Date.now()) {
            return { state: "stale", reason: "expired" };
        }
        try {
            const stat = await this.fsOps.stat(lockPath);
            if (Date.now() - stat.mtimeMs > this.leaseTtlMs) {
                return { state: "stale", reason: "mtime-expired" };
            }
            return { state: "active", reason: "fresh" };
        }
        catch (error) {
            const code = error.code;
            if (code === "ENOENT")
                return { state: "stale", reason: "missing" };
            if (isRetryableFsCode(code) || code === "EACCES") {
                return { state: "unknown", reason: `stat-${String(code).toLowerCase()}` };
            }
            return { state: "unknown", reason: "stat-error" };
        }
    }
    async pruneExpiredArtifacts() {
        try {
            const entries = await this.fsOps.readdir(this.leaseDir, { withFileTypes: true });
            const now = Date.now();
            const maxAgeMs = Math.max(this.leaseTtlMs, this.resultTtlMs) * 2;
            for (const entry of entries) {
                if (!entry.isFile())
                    continue;
                if (!entry.name.endsWith(".lock") && !entry.name.endsWith(".result.json"))
                    continue;
                const fullPath = join(this.leaseDir, entry.name);
                try {
                    const stat = await this.fsOps.stat(fullPath);
                    if (now - stat.mtimeMs > maxAgeMs) {
                        await safeUnlink(fullPath, undefined, this.fsOps);
                    }
                }
                catch {
                    // Best effort.
                }
            }
        }
        catch {
            // Best effort.
        }
    }
}
//# sourceMappingURL=refresh-lease.js.map