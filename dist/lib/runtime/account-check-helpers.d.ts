import type { ModelFamily } from "../prompts/codex.js";
import type { AccountStorageV3 } from "../storage.js";
import type { TokenResult } from "../types.js";
export declare function clampActiveIndices(storage: AccountStorageV3, families: readonly ModelFamily[]): void;
export declare function isFlaggableFailure(failure: Extract<TokenResult, {
    type: "failed";
}>): boolean;
//# sourceMappingURL=account-check-helpers.d.ts.map