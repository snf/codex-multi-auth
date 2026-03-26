import type { ConfigExplainReport } from "../../config.js";
export declare function runConfigExplainCommand(args: string[], deps: {
    getReport: () => ConfigExplainReport;
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
}): number;
//# sourceMappingURL=config-explain.d.ts.map