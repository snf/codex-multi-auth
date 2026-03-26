import { type ModelFamily } from "../prompts/codex.js";
import { type AccountStorageV3 } from "../storage.js";
/**
 * Preserves one-way mirror semantics for Codex CLI compatibility state.
 *
 * Multi-auth storage is the canonical source of truth. Codex CLI account files are mirrors only
 * and must never seed, merge into, or restore the canonical account pool. This helper is kept for
 * older call sites that still use the historical reconcile entry point, but it now only normalizes
 * the existing local indexes and never reads or applies Codex CLI account data.
 *
 * @param current - The current canonical AccountStorageV3, or null when no canonical storage exists.
 * @returns The original storage when no local normalization is needed, a normalized clone when index
 * values need clamping, or null when canonical storage is missing.
 */
export declare function syncAccountStorageFromCodexCli(current: AccountStorageV3 | null): Promise<{
    storage: AccountStorageV3 | null;
    changed: boolean;
}>;
export declare function getActiveSelectionForFamily(storage: AccountStorageV3, family: ModelFamily): number;
//# sourceMappingURL=sync.d.ts.map