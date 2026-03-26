type OcChatgptTargetScope = "global" | "project";
type OcChatgptTargetSource = "explicit" | "default-global" | "project";
type OcChatgptTargetCandidate = {
    scope: OcChatgptTargetScope;
    source: OcChatgptTargetSource;
    root: string;
    accountPath: string;
    backupRoot: string;
    hasAccountArtifacts: boolean;
    hasSignals: boolean;
};
export type OcChatgptTargetDescriptor = {
    scope: OcChatgptTargetScope;
    root: string;
    accountPath: string;
    backupRoot: string;
    source: OcChatgptTargetSource;
    resolution: "accounts" | "signals";
};
export type OcChatgptTargetAmbiguous = {
    kind: "ambiguous";
    reason: string;
    candidates: Array<Pick<OcChatgptTargetCandidate, "scope" | "root" | "accountPath" | "backupRoot" | "source" | "hasAccountArtifacts" | "hasSignals">>;
};
export type OcChatgptTargetNone = {
    kind: "none";
    reason: string;
    tried: Array<Pick<OcChatgptTargetCandidate, "scope" | "root" | "accountPath" | "backupRoot" | "source">>;
};
export type OcChatgptTargetFound = {
    kind: "target";
    descriptor: OcChatgptTargetDescriptor;
};
export type OcChatgptTargetDetectionResult = OcChatgptTargetFound | OcChatgptTargetAmbiguous | OcChatgptTargetNone;
/**
 * Detects the oc-chatgpt multi-auth storage target by evaluating explicit, canonical, and per-project candidate roots.
 *
 * Examines an explicit override (OC_CHATGPT_MULTI_AUTH_DIR or options.explicitRoot), the canonical user store (~/.opencode),
 * and a per-project storage location (derived from options.projectRoot or the current working directory). For each candidate
 * it checks for account artifacts and storage signals and returns a single resolved target, an ambiguity listing multiple
 * matching candidates, or a "none" result with the attempted candidates. This function performs synchronous filesystem checks
 * and tolerates unreadable directories; callers should treat it as a blocking operation. On Windows, path normalization and
 * deduplication are case-insensitive and drive-root variants (e.g. `C:` vs `C:\`) are normalized consistently. Returned
 * descriptors include normalized paths but do not contain authentication tokens or other secret material.
 *
 * @param options - Optional overrides:
 *   - explicitRoot: absolute path to force as the candidate root (use `null` to explicitly disable); if omitted the
 *     OC_CHATGPT_MULTI_AUTH_DIR environment variable is considered.
 *   - projectRoot: explicit project root to derive per-project storage; if omitted the current working directory is used to
 *     discover the project root.
 * @returns An OcChatgptTargetDetectionResult describing either a resolved `target` (with `descriptor` and a `resolution`
 *   of `"accounts"` or `"signals"`), an `ambiguous` outcome listing conflicting candidates, or `none` with the tried candidates.
 */
export declare function detectOcChatgptMultiAuthTarget(options?: {
    explicitRoot?: string | null;
    projectRoot?: string | null;
}): OcChatgptTargetDetectionResult;
export {};
//# sourceMappingURL=oc-chatgpt-target-detection.d.ts.map