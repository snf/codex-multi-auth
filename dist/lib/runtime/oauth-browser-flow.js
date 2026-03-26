import { createAuthorizationFlow, exchangeAuthorizationCode, REDIRECT_URI, redactOAuthUrlForLog, } from "../auth/auth.js";
import { openBrowserUrl } from "../auth/browser.js";
import { startLocalOAuthServer } from "../auth/server.js";
export async function runOAuthBrowserFlow(deps) {
    const { pkce, state, url } = await createAuthorizationFlow({
        forceNewLogin: deps.forceNewLogin ?? false,
    });
    deps.logInfo(`OAuth URL: ${redactOAuthUrlForLog(url)}`);
    let serverInfo = null;
    try {
        serverInfo = await startLocalOAuthServer({ state });
    }
    catch (err) {
        deps.logDebug(`Failed to start OAuth server: ${err?.message ?? String(err)}`);
        serverInfo = null;
    }
    if (!serverInfo || !serverInfo.ready) {
        serverInfo?.close();
        deps.logWarn(`OAuth callback server failed to start. Please retry with "${deps.manualModeLabel}".\n`);
        return { type: "failed" };
    }
    openBrowserUrl(url);
    const result = await serverInfo.waitForCode(state);
    serverInfo.close();
    if (!result) {
        return {
            type: "failed",
            reason: "unknown",
            message: "OAuth callback timeout or cancelled",
        };
    }
    return exchangeAuthorizationCode(result.code, pkce.verifier, REDIRECT_URI);
}
//# sourceMappingURL=oauth-browser-flow.js.map