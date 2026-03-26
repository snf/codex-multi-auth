import { exchangeAuthorizationCode, parseAuthorizationInput, REDIRECT_URI, } from "../auth/auth.js";
import { getAccountIdCandidates, selectBestAccountCandidate, } from "../auth/token-utils.js";
import { resolveAccountSelection, } from "./account-selection.js";
function buildManualOAuthFlowFromParams(params) {
    return {
        url: params.url,
        method: "code",
        instructions: params.instructions,
        validate: (input) => {
            const parsed = params.parseAuthorizationInput(input);
            if (!parsed.code) {
                return `No authorization code found. Paste the full callback URL (e.g., ${params.redirectUri}?code=...)`;
            }
            if (!parsed.state) {
                return "Missing OAuth state. Paste the full callback URL including both code and state parameters.";
            }
            if (parsed.state !== params.expectedState) {
                return "OAuth state mismatch. Restart login and paste the callback URL generated for this login attempt.";
            }
            return undefined;
        },
        callback: async (input) => {
            const parsed = params.parseAuthorizationInput(input);
            if (!parsed.code || !parsed.state) {
                return {
                    type: "failed",
                    reason: "invalid_response",
                    message: "Missing authorization code or OAuth state",
                };
            }
            if (parsed.state !== params.expectedState) {
                return {
                    type: "failed",
                    reason: "invalid_response",
                    message: "OAuth state mismatch. Restart login and try again.",
                };
            }
            const tokens = await params.exchangeAuthorizationCode(parsed.code, params.pkce.verifier, params.redirectUri);
            if (tokens?.type === "success") {
                const resolved = params.resolveTokenSuccess(tokens);
                if (params.onSuccess) {
                    await params.onSuccess(resolved);
                }
                return resolved;
            }
            return tokens?.type === "failed" ? tokens : { type: "failed" };
        },
    };
}
export function buildManualOAuthFlow(paramsOrPkce, url, expectedState, deps) {
    if (typeof url === "string" && typeof expectedState === "string" && deps) {
        return buildManualOAuthFlowFromParams({
            pkce: paramsOrPkce,
            url,
            expectedState,
            redirectUri: REDIRECT_URI,
            parseAuthorizationInput,
            exchangeAuthorizationCode,
            resolveTokenSuccess: (tokens) => resolveAccountSelection(tokens, {
                envAccountId: process.env.CODEX_AUTH_ACCOUNT_ID,
                logInfo: deps.logInfo,
                getAccountIdCandidates,
                selectBestAccountCandidate,
            }),
            onSuccess: deps.onSuccess,
            instructions: deps.instructions,
        });
    }
    return buildManualOAuthFlowFromParams(paramsOrPkce);
}
//# sourceMappingURL=manual-oauth-flow.js.map