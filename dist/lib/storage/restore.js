import { isAbsolute, relative } from "node:path";
export async function restoreAccountsFromBackupFile(path, deps, options) {
    const backupRoot = deps.getNamedBackupRoot(deps.getStoragePath());
    let resolvedBackupRoot;
    try {
        resolvedBackupRoot = await deps.realpath(backupRoot);
    }
    catch (error) {
        const code = error.code;
        if (code === "ENOENT") {
            throw new Error(`Backup root does not exist: ${backupRoot}`);
        }
        throw error;
    }
    let resolvedBackupPath;
    try {
        resolvedBackupPath = await deps.realpath(path);
    }
    catch (error) {
        const code = error.code;
        if (code === "ENOENT") {
            throw new Error(`Backup file no longer exists: ${path}`);
        }
        throw error;
    }
    const relativePath = relative(resolvedBackupRoot, resolvedBackupPath);
    const isInsideBackupRoot = relativePath.length > 0 &&
        !relativePath.startsWith("..") &&
        !isAbsolute(relativePath);
    if (!isInsideBackupRoot) {
        throw new Error(`Backup path must stay inside ${resolvedBackupRoot}: ${path}`);
    }
    const { normalized } = await (async () => {
        try {
            return await deps.loadAccountsFromPath(resolvedBackupPath);
        }
        catch (error) {
            const code = error.code;
            if (code === "ENOENT") {
                throw new Error(`Backup file no longer exists: ${path}`);
            }
            throw error;
        }
    })();
    if (!normalized || normalized.accounts.length === 0) {
        throw new Error(`Backup does not contain any accounts: ${resolvedBackupPath}`);
    }
    if (options?.persist !== false) {
        await deps.saveAccounts(normalized);
    }
    return normalized;
}
//# sourceMappingURL=restore.js.map