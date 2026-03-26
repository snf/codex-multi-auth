import type { ConfigExplainReport } from "../../config.js";
export declare function runDebugBundleCommand(args: string[], deps: {
    getConfigReport: () => ConfigExplainReport;
    getStoragePath: () => string;
    loadAccounts: () => Promise<{
        accounts: Array<{
            enabled?: boolean;
        }>;
        activeIndex?: number;
    } | null>;
    loadFlaggedAccounts: () => Promise<{
        accounts: unknown[];
    }>;
    loadCodexCliState: (options: {
        forceRefresh: boolean;
    }) => Promise<{
        path: string;
        accounts: unknown[];
        activeEmail?: string;
        activeAccountId?: string;
        syncVersion?: number;
        sourceUpdatedAtMs?: number;
    } | null>;
    getLastAccountsSaveTimestamp: () => number;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
}): Promise<number>;
//# sourceMappingURL=debug-bundle.d.ts.map