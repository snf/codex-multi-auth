import type { TokenResult } from "../types.js";
export declare function runOAuthBrowserFlow(deps: {
    forceNewLogin?: boolean;
    manualModeLabel: string;
    logInfo: (message: string) => void;
    logDebug: (message: string) => void;
    logWarn: (message: string) => void;
}): Promise<TokenResult>;
//# sourceMappingURL=oauth-browser-flow.d.ts.map