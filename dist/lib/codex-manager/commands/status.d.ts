import type { ModelFamily } from "../../prompts/codex.js";
import type { AccountStorageV3 } from "../../storage.js";
type LoadedStorage = AccountStorageV3 | null;
export interface StatusCommandDeps {
    setStoragePath: (path: string | null) => void;
    getStoragePath: () => string | null;
    loadAccounts: () => Promise<LoadedStorage>;
    resolveActiveIndex: (storage: AccountStorageV3, family?: ModelFamily) => number;
    formatRateLimitEntry: (account: AccountStorageV3["accounts"][number], now: number, family: ModelFamily) => string | null;
    getNow?: () => number;
    logInfo?: (message: string) => void;
}
export declare function runStatusCommand(deps: StatusCommandDeps): Promise<number>;
export interface FeaturesCommandDeps {
    implementedFeatures: ReadonlyArray<{
        id: number;
        name: string;
    }>;
    logInfo?: (message: string) => void;
}
export declare function runFeaturesCommand(deps: FeaturesCommandDeps): number;
export {};
//# sourceMappingURL=status.d.ts.map