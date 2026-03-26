import type { CodexQuotaSnapshot } from "../quota-probe.js";
import type { ParsedCodexQuotaSnapshot } from "./quota-headers.js";
export declare function fetchRuntimeCodexQuotaSnapshot(params: {
    accountId: string;
    accessToken: string;
    baseUrl: string;
    fetchImpl: typeof fetch;
    getCodexInstructions: (model: string) => Promise<string>;
    createCodexHeaders: (init: RequestInit | undefined, accountId: string, accessToken: string, meta: {
        model: string;
    }) => Headers;
    parseCodexQuotaSnapshot: (headers: Headers, status: number) => ParsedCodexQuotaSnapshot | null;
    getUnsupportedCodexModelInfo: (errorBody: unknown) => {
        isUnsupported: boolean;
        message?: string;
    };
}): Promise<CodexQuotaSnapshot>;
//# sourceMappingURL=quota-probe.d.ts.map