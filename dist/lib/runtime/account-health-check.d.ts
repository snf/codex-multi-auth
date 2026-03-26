import type { ModelFamily } from "../prompts/codex.js";
import type { AccountStorageV3 } from "../storage.js";
import type { TokenResult } from "../types.js";
export declare function clampRuntimeActiveIndices(storage: AccountStorageV3, modelFamilies: readonly ModelFamily[]): void;
export declare function isRuntimeFlaggableFailure(failure: Extract<TokenResult, {
    type: "failed";
}>): boolean;
//# sourceMappingURL=account-health-check.d.ts.map