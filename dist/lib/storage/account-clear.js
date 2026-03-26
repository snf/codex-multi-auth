import { promises as fs } from "node:fs";
export async function clearAccountStorageArtifacts(params) {
    await fs.writeFile(params.resetMarkerPath, JSON.stringify({ version: 1, createdAt: Date.now() }), { encoding: "utf-8", mode: 0o600 });
    const clearPath = async (targetPath) => {
        try {
            await fs.unlink(targetPath);
        }
        catch (error) {
            const code = error.code;
            if (code !== "ENOENT") {
                params.logError("Failed to clear account storage artifact", {
                    path: targetPath,
                    error: String(error),
                });
            }
        }
    };
    try {
        await Promise.all([
            clearPath(params.path),
            clearPath(params.walPath),
            ...params.backupPaths.map(clearPath),
        ]);
    }
    catch {
        // Individual path cleanup is already best-effort with per-artifact logging.
    }
}
//# sourceMappingURL=account-clear.js.map