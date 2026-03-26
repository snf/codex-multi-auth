import type { OAuthServerInfo } from "../types.js";
/**
 * Start a local HTTP server that captures an OAuth authorization code sent to /auth/callback.
 *
 * The server validates the `state` query parameter, serves a static success page for valid callbacks,
 * and retains a single authorization code on the server instance until consumed via `waitForCode`.
 * Only one code is stored at a time; call `close` to abort polling and shut down the server.
 *
 * On platforms such as Windows, binding to localhost:1455 may fail if another process holds the port
 * or if firewall/antivirus restrictions prevent local binding; in that case the returned `ready`
 * flag is `false` to allow a manual paste fallback.
 *
 * Captured authorization codes are secrets and must be treated accordingly; callers should redact
 * them from logs and error messages.
 *
 * @param options - Object with a `state` string used to validate the OAuth redirect
 * @returns An OAuthServerInfo describing the server: `port` (1455), `ready` (boolean), a `close`
 *          function to abort polling and close the server, and `waitForCode` which returns
 *          `{ code: string }` when a code becomes available or `null` on timeout/abort.
 */
export declare function startLocalOAuthServer({ state }: {
    state: string;
}): Promise<OAuthServerInfo>;
//# sourceMappingURL=server.d.ts.map