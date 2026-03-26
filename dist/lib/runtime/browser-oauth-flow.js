export async function runBrowserOAuthFlow(params) {
    const { pkce, state, url } = await params.createAuthorizationFlow({
        forceNewLogin: params.forceNewLogin ?? false,
    });
    params.logInfo(`OAuth URL: ${params.redactOAuthUrlForLog(url)}`);
    let serverInfo = null;
    try {
        serverInfo = await params.startLocalOAuthServer({ state });
    }
    catch (err) {
        params.logDebug(`[${params.pluginName}] Failed to start OAuth server: ${err?.message ?? String(err)}`);
        serverInfo = null;
    }
    if (!serverInfo || !serverInfo.ready) {
        serverInfo?.close();
        params.logWarn(`\n[${params.pluginName}] OAuth callback server failed to start. Please retry with "${params.authManualLabel}".\n`);
        return { type: "failed" };
    }
    params.openBrowserUrl(url);
    const result = await serverInfo.waitForCode(state);
    serverInfo.close();
    if (!result) {
        return {
            type: "failed",
            reason: "unknown",
            message: "OAuth callback timeout or cancelled",
        };
    }
    return params.exchangeAuthorizationCode(result.code, pkce.verifier, params.redirectUri);
}
//# sourceMappingURL=browser-oauth-flow.js.map