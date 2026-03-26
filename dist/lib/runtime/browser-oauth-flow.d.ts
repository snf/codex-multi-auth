import type { TokenResult } from "../types.js";
export declare function runBrowserOAuthFlow(params: {
    forceNewLogin?: boolean;
    createAuthorizationFlow: (options: {
        forceNewLogin: boolean;
    }) => Promise<{
        pkce: {
            verifier: string;
        };
        state: string;
        url: string;
    }>;
    logInfo: (message: string) => void;
    redactOAuthUrlForLog: (url: string) => string;
    startLocalOAuthServer: (options: {
        state: string;
    }) => Promise<{
        ready: boolean;
        close: () => void;
        waitForCode: (state: string) => Promise<{
            code: string;
        } | null>;
    }>;
    logDebug: (message: string) => void;
    openBrowserUrl: (url: string) => void;
    pluginName: string;
    authManualLabel: string;
    logWarn: (message: string) => void;
    exchangeAuthorizationCode: (code: string, verifier: string, redirectUri: string) => Promise<TokenResult>;
    redirectUri: string;
}): Promise<TokenResult>;
//# sourceMappingURL=browser-oauth-flow.d.ts.map