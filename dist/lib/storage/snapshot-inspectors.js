export async function describeAccountsWalSnapshot(path, deps) {
    const stats = await deps.statSnapshot(path);
    if (!stats.exists) {
        return { kind: "accounts-wal", path, exists: false, valid: false };
    }
    try {
        const raw = await deps.readFile(path, "utf-8");
        const parsed = JSON.parse(raw);
        if (!deps.isRecord(parsed)) {
            return {
                kind: "accounts-wal",
                path,
                exists: true,
                valid: false,
                bytes: stats.bytes,
                mtimeMs: stats.mtimeMs,
            };
        }
        const entry = parsed;
        if (entry.version !== 1 ||
            typeof entry.content !== "string" ||
            typeof entry.checksum !== "string" ||
            deps.computeSha256(entry.content) !== entry.checksum) {
            return {
                kind: "accounts-wal",
                path,
                exists: true,
                valid: false,
                bytes: stats.bytes,
                mtimeMs: stats.mtimeMs,
            };
        }
        const { normalized, storedVersion, schemaErrors } = deps.parseAndNormalizeStorage(JSON.parse(entry.content));
        return {
            kind: "accounts-wal",
            path,
            exists: true,
            valid: !!normalized,
            bytes: stats.bytes,
            mtimeMs: stats.mtimeMs,
            version: typeof storedVersion === "number" ? storedVersion : undefined,
            accountCount: normalized?.accounts.length,
            schemaErrors: schemaErrors.length > 0 ? schemaErrors : undefined,
        };
    }
    catch {
        return {
            kind: "accounts-wal",
            path,
            exists: true,
            valid: false,
            bytes: stats.bytes,
            mtimeMs: stats.mtimeMs,
        };
    }
}
export async function describeFlaggedSnapshot(path, kind, deps) {
    const stats = await deps.statSnapshot(path);
    if (!stats.exists) {
        return { kind, path, index: deps.index, exists: false, valid: false };
    }
    try {
        const storage = await deps.loadFlaggedAccountsFromPath(path);
        return {
            kind,
            path,
            index: deps.index,
            exists: true,
            valid: true,
            bytes: stats.bytes,
            mtimeMs: stats.mtimeMs,
            version: storage.version,
            flaggedCount: storage.accounts.length,
        };
    }
    catch (error) {
        const code = error.code;
        if (code !== "ENOENT") {
            deps.logWarn?.("Failed to inspect flagged snapshot", {
                path,
                error: String(error),
            });
        }
        return {
            kind,
            path,
            index: deps.index,
            exists: true,
            valid: false,
            bytes: stats.bytes,
            mtimeMs: stats.mtimeMs,
        };
    }
}
//# sourceMappingURL=snapshot-inspectors.js.map