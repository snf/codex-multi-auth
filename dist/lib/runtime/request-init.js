export async function normalizeRuntimeRequestInit(requestInput, requestInit) {
    if (requestInit)
        return requestInit;
    if (!(requestInput instanceof Request))
        return requestInit;
    const method = requestInput.method || "GET";
    const normalized = {
        method,
        headers: new Headers(requestInput.headers),
    };
    if (method !== "GET" && method !== "HEAD") {
        try {
            const bodyText = await requestInput.clone().text();
            if (bodyText) {
                normalized.body = bodyText;
            }
        }
        catch {
            // Body may be unreadable; proceed without it.
        }
    }
    return normalized;
}
export async function parseRuntimeRequestBody(body, deps) {
    if (!body)
        return {};
    try {
        if (typeof body === "string") {
            return JSON.parse(body);
        }
        if (body instanceof Uint8Array) {
            return JSON.parse(new TextDecoder().decode(body));
        }
        if (body instanceof ArrayBuffer) {
            return JSON.parse(new TextDecoder().decode(new Uint8Array(body)));
        }
        if (ArrayBuffer.isView(body)) {
            const view = new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
            return JSON.parse(new TextDecoder().decode(view));
        }
        if (typeof Blob !== "undefined" && body instanceof Blob) {
            return JSON.parse(await body.text());
        }
    }
    catch {
        deps.logWarn("Failed to parse request body, using empty object");
    }
    return {};
}
//# sourceMappingURL=request-init.js.map