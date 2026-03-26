import type { TokenResult } from "../types.js";
import { type TokenSuccessWithAccount } from "./account-selection.js";
type TokenSuccess = Extract<TokenResult, {
    type: "success";
}>;
type RuntimeResolvedToken = TokenSuccessWithAccount<TokenSuccess>;
type ManualOAuthFlow<TResolved extends TokenSuccess> = {
    url: string;
    method: "code";
    instructions: string;
    validate: (input: string) => string | undefined;
    callback: (input: string) => Promise<TokenResult | TResolved>;
};
type ManualOAuthFlowParams<TResolved extends TokenSuccess> = {
    pkce: {
        verifier: string;
    };
    url: string;
    expectedState: string;
    redirectUri: string;
    parseAuthorizationInput: (input: string) => {
        code?: string;
        state?: string;
    };
    exchangeAuthorizationCode: (code: string, verifier: string, redirectUri: string) => Promise<TokenResult>;
    resolveTokenSuccess: (tokens: TokenSuccess) => TResolved;
    onSuccess?: (tokens: TResolved) => Promise<void>;
    instructions: string;
};
type RuntimeManualOAuthFlowDeps = {
    instructions: string;
    logInfo: (message: string) => void;
    onSuccess?: (tokens: RuntimeResolvedToken) => Promise<void>;
};
export declare function buildManualOAuthFlow<TResolved extends TokenSuccess>(params: ManualOAuthFlowParams<TResolved>): ManualOAuthFlow<TResolved>;
export declare function buildManualOAuthFlow(pkce: {
    verifier: string;
}, url: string, expectedState: string, deps: RuntimeManualOAuthFlowDeps): ManualOAuthFlow<RuntimeResolvedToken>;
export {};
//# sourceMappingURL=manual-oauth-flow.d.ts.map