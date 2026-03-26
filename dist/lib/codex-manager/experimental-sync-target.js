export async function loadExperimentalSyncTargetState(deps) {
    const detection = deps.detectTarget();
    if (detection.kind === "ambiguous") {
        return { kind: "blocked-ambiguous", detection };
    }
    if (detection.kind === "none") {
        return { kind: "blocked-none", detection };
    }
    try {
        const raw = await deps.readJson(detection.descriptor.accountPath);
        const normalized = deps.normalizeAccountStorage(raw);
        if (!normalized) {
            return {
                kind: "error",
                message: "Invalid target account storage format",
            };
        }
        return {
            kind: "target",
            detection,
            destination: normalized,
        };
    }
    catch (error) {
        const code = error.code;
        if (code === "ENOENT") {
            return {
                kind: "target",
                detection,
                destination: null,
            };
        }
        return {
            kind: "error",
            message: error instanceof Error ? error.message : String(error),
        };
    }
}
//# sourceMappingURL=experimental-sync-target.js.map