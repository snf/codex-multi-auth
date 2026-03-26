import type { AccountStorageV3 } from "../storage.js";
type ExperimentalTargetDetection = ReturnType<typeof import("../oc-chatgpt-target-detection.js").detectOcChatgptMultiAuthTarget>;
export type ExperimentalSyncTargetState = {
    kind: "blocked-ambiguous";
    detection: ExperimentalTargetDetection;
} | {
    kind: "blocked-none";
    detection: ExperimentalTargetDetection;
} | {
    kind: "error";
    message: string;
} | {
    kind: "target";
    detection: ExperimentalTargetDetection;
    destination: AccountStorageV3 | null;
};
export declare function loadExperimentalSyncTargetState(deps: {
    detectTarget: () => ExperimentalTargetDetection;
    readJson: (path: string) => Promise<unknown>;
    normalizeAccountStorage: (value: unknown) => AccountStorageV3 | null;
}): Promise<ExperimentalSyncTargetState>;
export {};
//# sourceMappingURL=experimental-sync-target.d.ts.map