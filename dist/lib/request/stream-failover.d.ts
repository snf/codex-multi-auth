export interface StreamFailoverOptions {
    maxFailovers?: number;
    stallTimeoutMs?: number;
    softTimeoutMs?: number;
    hardTimeoutMs?: number;
    requestInstanceId?: string;
}
/**
 * Wraps an SSE-like streaming Response so the stream can switch to fallback sources on stalls or errors to keep the client session alive.
 *
 * The returned Response streams bytes from the initialResponse body and, when the stream stalls or errors, will attempt up to `maxFailovers` failovers by calling `getFallbackResponse(attempt, emittedBytes)`. On each successful failover a textual marker is injected into the stream identifying the failover attempt (and `requestInstanceId` when provided). The function performs best-effort cleanup of underlying readers and enforces soft/hard read timeouts as configured via `options`.
 *
 * Concurrency assumptions: the implementation expects a single consumer reading the returned Response body; callers must not concurrently read the same stream body from multiple consumers. Filesystem/platform note: behavior is platform-agnostic; no filesystem access is performed (Windows-specific filesystem semantics do not apply). Token redaction: any request identifiers embedded in the injected marker are limited to the normalized `requestInstanceId` (trimmed and truncated to 64 chars) to avoid leaking long tokens.
 *
 * @param initialResponse - The original Response whose body will be streamed and monitored for stalls/errors.
 * @param getFallbackResponse - Async function invoked for each failover attempt with the 1-based attempt number and total emitted bytes; should return a Response with a streaming body to switch to, or `null`/a Response without a body to indicate no fallback.
 * @param options - Optional failover configuration (maxFailovers, stall/soft/hard timeout overrides, requestInstanceId). `requestInstanceId` will be normalized and truncated to 64 characters.
 * @returns A new Response that streams data from the initial response but may switch to fallback responses on stall/error, preserving the original status, statusText, and content-type header.
 */
export declare function withStreamingFailover(initialResponse: Response, getFallbackResponse: (attempt: number, emittedBytes: number) => Promise<Response | null>, options?: StreamFailoverOptions): Response;
//# sourceMappingURL=stream-failover.d.ts.map