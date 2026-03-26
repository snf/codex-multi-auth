import { type CodexQuotaSnapshot } from "../../quota-probe.js";
import type { AccountStorageV3 } from "../../storage.js";
import type { TokenResult } from "../../types.js";
export interface ReportCommandDeps {
    setStoragePath: (path: string | null) => void;
    getStoragePath: () => string;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    resolveActiveIndex: (storage: AccountStorageV3, family?: "codex") => number;
    queuedRefresh: (refreshToken: string) => Promise<TokenResult>;
    fetchCodexQuotaSnapshot: (input: {
        accountId: string;
        accessToken: string;
        model: string;
    }) => Promise<CodexQuotaSnapshot>;
    formatRateLimitEntry: (account: AccountStorageV3["accounts"][number], now: number, family: "codex") => string | null;
    normalizeFailureDetail: (message: string | undefined, reason: string | undefined) => string;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
    getNow?: () => number;
    getCwd?: () => string;
    writeFile?: (path: string, contents: string) => Promise<void>;
}
export declare function runReportCommand(args: string[], deps: ReportCommandDeps): Promise<number>;
//# sourceMappingURL=report.d.ts.map