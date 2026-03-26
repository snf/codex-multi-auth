import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { previewOcChatgptImportMerge, } from "./oc-chatgpt-import-adapter.js";
import { detectOcChatgptMultiAuthTarget, } from "./oc-chatgpt-target-detection.js";
import { exportNamedBackup, normalizeAccountStorage, } from "./storage.js";
function mapDetectionToBlocked(detection) {
    if (detection.kind === "ambiguous") {
        return { kind: "blocked-ambiguous", detection };
    }
    if (detection.kind === "none") {
        return { kind: "blocked-none", detection };
    }
    return null;
}
async function loadTargetStorageDefault(target) {
    try {
        const raw = JSON.parse(await fs.readFile(target.accountPath, "utf-8"));
        return normalizeAccountStorage(raw);
    }
    catch (error) {
        const code = error?.code;
        if (code === "ENOENT")
            return null;
        throw error;
    }
}
export async function planOcChatgptSync(options) {
    const detectTarget = options.dependencies?.detectTarget ?? detectOcChatgptMultiAuthTarget;
    const previewMerge = options.dependencies?.previewMerge ?? previewOcChatgptImportMerge;
    const detection = detectTarget(options.detectOptions);
    const blocked = mapDetectionToBlocked(detection);
    if (blocked) {
        return blocked;
    }
    if (detection.kind !== "target") {
        throw new Error("Unexpected oc target detection result");
    }
    const descriptor = detection.descriptor;
    const destination = options.destination === undefined
        ? await (options.dependencies?.loadTargetStorage ?? loadTargetStorageDefault)(descriptor)
        : options.destination;
    const preview = previewMerge({
        source: options.source,
        destination,
    });
    return {
        kind: "ready",
        target: descriptor,
        preview,
        payload: preview.payload,
        destination,
    };
}
async function persistMergedDefault(target, merged) {
    const path = target.accountPath;
    await fs.mkdir(dirname(path), { recursive: true });
    await fs.writeFile(path, `${JSON.stringify(merged, null, 2)}\n`, "utf-8");
    return path;
}
export async function applyOcChatgptSync(options) {
    const dependencies = options.dependencies ?? {};
    try {
        const plan = await planOcChatgptSync({
            source: options.source,
            destination: options.destination,
            detectOptions: options.detectOptions,
            dependencies: {
                detectTarget: dependencies.detectTarget,
                previewMerge: dependencies.previewMerge,
                loadTargetStorage: dependencies.loadTargetStorage,
            },
        });
        if (plan.kind !== "ready") {
            return plan;
        }
        const persistMerged = dependencies.persistMerged ?? persistMergedDefault;
        const persistedPath = await persistMerged(plan.target, plan.preview.merged);
        return {
            kind: "applied",
            target: plan.target,
            preview: plan.preview,
            merged: plan.preview.merged,
            destination: plan.destination,
            persistedPath,
        };
    }
    catch (error) {
        const detection = dependencies.detectTarget?.(options.detectOptions) ??
            detectOcChatgptMultiAuthTarget(options.detectOptions);
        const blocked = mapDetectionToBlocked(detection);
        if (blocked) {
            return blocked;
        }
        if (detection.kind !== "target") {
            throw new Error("Unexpected oc target detection result");
        }
        return { kind: "error", target: detection.descriptor, error };
    }
}
function extractCollisionPath(error) {
    const asErr = error;
    if (asErr?.code === "EEXIST" &&
        typeof asErr?.path === "string" &&
        asErr.path.trim().length > 0) {
        return asErr.path;
    }
    const message = (asErr?.message ?? "").trim();
    if (message.length === 0)
        return undefined;
    const match = message.match(/already exists: (?<path>.+)$/i);
    if (match?.groups?.path) {
        return match.groups.path.trim();
    }
    return undefined;
}
export async function runNamedBackupExport(options) {
    const exportBackup = options.dependencies?.exportBackup ?? exportNamedBackup;
    try {
        const path = await exportBackup(options.name, { force: options.force });
        return { kind: "exported", path };
    }
    catch (error) {
        const path = extractCollisionPath(error);
        if (path) {
            return { kind: "collision", path };
        }
        return { kind: "error", path, error };
    }
}
//# sourceMappingURL=oc-chatgpt-orchestrator.js.map