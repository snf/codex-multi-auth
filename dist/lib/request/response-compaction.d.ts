import type { RequestBody } from "../types.js";
export interface DeferredFastSessionInputTrim {
    maxItems: number;
    preferLatestUserOnly: boolean;
}
export interface ResponseCompactionResult {
    body: RequestBody;
    mode: "compacted" | "trimmed" | "unchanged";
}
export interface ApplyResponseCompactionParams {
    body: RequestBody;
    requestUrl: string;
    headers: Headers;
    trim: DeferredFastSessionInputTrim;
    fetchImpl: typeof fetch;
    signal?: AbortSignal | null;
    timeoutMs?: number;
}
export declare function applyResponseCompaction(params: ApplyResponseCompactionParams): Promise<ResponseCompactionResult>;
//# sourceMappingURL=response-compaction.d.ts.map