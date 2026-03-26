export async function loadNormalizedStorageFromPath(path, label, deps) {
    try {
        const { normalized, schemaErrors } = await deps.loadAccountsFromPath(path);
        if (schemaErrors.length > 0) {
            deps.logWarn(`${label} schema validation warnings`, {
                path,
                errors: schemaErrors.slice(0, 5),
            });
        }
        return normalized;
    }
    catch (error) {
        const code = error.code;
        if (code !== "ENOENT") {
            deps.logWarn(`Failed to load ${label}`, {
                path,
                error: String(error),
            });
        }
        return null;
    }
}
export function mergeStorageForMigration(current, incoming, normalizeAccountStorage) {
    if (!current) {
        return incoming;
    }
    const merged = normalizeAccountStorage({
        version: 3,
        activeIndex: current.activeIndex,
        activeIndexByFamily: current.activeIndexByFamily,
        accounts: [...current.accounts, ...incoming.accounts],
    });
    if (!merged) {
        return current;
    }
    return merged;
}
//# sourceMappingURL=project-migration.js.map