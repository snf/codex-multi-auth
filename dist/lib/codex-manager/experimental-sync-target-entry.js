export async function loadExperimentalSyncTargetEntry(params) {
    return params.loadExperimentalSyncTargetState({
        detectTarget: params.detectTarget,
        readJson: async (path) => JSON.parse(await params.readFileWithRetry(path, {
            retryableCodes: new Set([
                "EBUSY",
                "EPERM",
                "EAGAIN",
            ]),
            maxAttempts: 4,
            sleep: params.sleep,
        })),
        normalizeAccountStorage: params.normalizeAccountStorage,
    });
}
//# sourceMappingURL=experimental-sync-target-entry.js.map