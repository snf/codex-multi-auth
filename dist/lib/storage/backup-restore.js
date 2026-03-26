import { isAbsolute, relative } from "node:path";
export async function restoreAccountsFromBackupPath(path, options) {
    let resolvedBackupRoot;
    try {
        resolvedBackupRoot = await options.realpath(options.backupRoot);
    }
    catch (error) {
        const code = error.code;
        if (code === "ENOENT") {
            throw new Error(`Backup root does not exist: ${options.backupRoot}`);
        }
        throw error;
    }
    let resolvedBackupPath;
    try {
        resolvedBackupPath = await options.realpath(path);
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
            return await options.loadAccountsFromPath(resolvedBackupPath);
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
    if (options.persist !== false) {
        await options.saveAccounts(normalized);
    }
    return normalized;
}
//# sourceMappingURL=backup-restore.js.map