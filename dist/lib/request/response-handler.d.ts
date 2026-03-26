/**
 * Convert SSE stream response to JSON for generateText()
 * @param response - Fetch response with SSE stream
 * @param headers - Response headers
 * @returns Response with JSON body
 */
export declare function convertSseToJson(response: Response, headers: Headers, options?: {
    onResponseId?: (responseId: string) => void;
    streamStallTimeoutMs?: number;
}): Promise<Response>;
/**
 * Ensure response has content-type header
 * @param headers - Response headers
 * @returns Headers with content-type set
 */
export declare function ensureContentType(headers: Headers): Headers;
/**
 * Check if a non-streaming response is empty or malformed.
 * Returns true if the response body is empty, null, or lacks meaningful content.
 * @param body - Parsed JSON body from the response
 * @returns True if response should be considered empty/malformed
 */
export declare function isEmptyResponse(body: unknown): boolean;
export declare function attachResponseIdCapture(response: Response, headers: Headers, onResponseId?: (responseId: string) => void): Response;
//# sourceMappingURL=response-handler.d.ts.map