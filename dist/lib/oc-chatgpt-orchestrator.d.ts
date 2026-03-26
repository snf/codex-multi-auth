import { type OcChatgptMergePreview, type OcChatgptPreviewPayload, previewOcChatgptImportMerge } from "./oc-chatgpt-import-adapter.js";
import { detectOcChatgptMultiAuthTarget, type OcChatgptTargetAmbiguous, type OcChatgptTargetDescriptor, type OcChatgptTargetNone } from "./oc-chatgpt-target-detection.js";
import { type AccountStorageV3, exportNamedBackup } from "./storage.js";
type BlockedAmbiguous = {
    kind: "blocked-ambiguous";
    detection: OcChatgptTargetAmbiguous;
};
type BlockedNone = {
    kind: "blocked-none";
    detection: OcChatgptTargetNone;
};
type BlockedDetection = BlockedAmbiguous | BlockedNone;
type OcChatgptSyncPlanReady = {
    kind: "ready";
    target: OcChatgptTargetDescriptor;
    preview: OcChatgptMergePreview;
    payload: OcChatgptPreviewPayload;
    destination: AccountStorageV3 | null;
};
export type OcChatgptSyncPlanResult = OcChatgptSyncPlanReady | BlockedDetection;
type DetectOptions = {
    explicitRoot?: string | null;
    projectRoot?: string | null;
};
type PlanDependencies = {
    detectTarget?: typeof detectOcChatgptMultiAuthTarget;
    previewMerge?: typeof previewOcChatgptImportMerge;
    loadTargetStorage?: (target: OcChatgptTargetDescriptor) => Promise<AccountStorageV3 | null>;
};
export type PlanOcChatgptSyncOptions = {
    source: AccountStorageV3 | null;
    destination?: AccountStorageV3 | null;
    detectOptions?: DetectOptions;
    dependencies?: PlanDependencies;
};
export declare function planOcChatgptSync(options: PlanOcChatgptSyncOptions): Promise<OcChatgptSyncPlanResult>;
type ApplyDependencies = PlanDependencies & {
    persistMerged?: (target: OcChatgptTargetDescriptor, merged: AccountStorageV3) => Promise<string | void>;
};
export type ApplyOcChatgptSyncOptions = {
    source: AccountStorageV3 | null;
    destination?: AccountStorageV3 | null;
    detectOptions?: DetectOptions;
    dependencies?: ApplyDependencies;
};
export type OcChatgptSyncApplyResult = BlockedDetection | {
    kind: "applied";
    target: OcChatgptTargetDescriptor;
    preview: OcChatgptMergePreview;
    merged: AccountStorageV3;
    destination: AccountStorageV3 | null;
    persistedPath?: string | void;
} | {
    kind: "error";
    target: OcChatgptTargetDescriptor;
    error: unknown;
};
export declare function applyOcChatgptSync(options: ApplyOcChatgptSyncOptions): Promise<OcChatgptSyncApplyResult>;
type BackupDependencies = {
    exportBackup?: typeof exportNamedBackup;
};
export type RunNamedBackupExportOptions = {
    name: string;
    force?: boolean;
    dependencies?: BackupDependencies;
};
export type RunNamedBackupExportResult = {
    kind: "exported";
    path: string;
} | {
    kind: "collision";
    path: string;
} | {
    kind: "error";
    path?: string;
    error: unknown;
};
export declare function runNamedBackupExport(options: RunNamedBackupExportOptions): Promise<RunNamedBackupExportResult>;
export {};
//# sourceMappingURL=oc-chatgpt-orchestrator.d.ts.map