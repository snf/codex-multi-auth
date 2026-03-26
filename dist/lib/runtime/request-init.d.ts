export declare function normalizeRuntimeRequestInit(requestInput: Request | string | URL, requestInit: RequestInit | undefined): Promise<RequestInit | undefined>;
export declare function parseRuntimeRequestBody(body: unknown, deps: {
    logWarn: (message: string) => void;
}): Promise<Record<string, unknown>>;
//# sourceMappingURL=request-init.d.ts.map