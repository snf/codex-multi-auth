import { promises as fs } from "node:fs";
import { AnyAccountStorageSchema, getValidationErrors } from "../schemas.js";
export function parseAndNormalizeStorage(data, normalizeAccountStorage, isRecord) {
    const schemaErrors = getValidationErrors(AnyAccountStorageSchema, data);
    const normalized = normalizeAccountStorage(data);
    const storedVersion = isRecord(data)
        ? data.version
        : undefined;
    return { normalized, storedVersion, schemaErrors };
}
export async function loadAccountsFromPath(path, deps) {
    const content = await fs.readFile(path, "utf-8");
    const data = JSON.parse(content);
    return parseAndNormalizeStorage(data, deps.normalizeAccountStorage, deps.isRecord);
}
//# sourceMappingURL=storage-parser.js.map