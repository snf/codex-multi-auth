/**
 * Token utility functions for JWT parsing and account ID extraction.
 * Extracted from accounts.ts to reduce module size and improve cohesion.
 */
import type { AccountIdSource } from "../types.js";
/**
 * Account ID candidate from token or organization data.
 */
export interface AccountIdCandidate {
    accountId: string;
    label: string;
    source: AccountIdSource;
    isDefault?: boolean;
    isPersonal?: boolean;
}
/**
 * Select the best workspace candidate for OAuth account binding.
 * Preference order:
 * 1) org default that is not personal
 * 2) org default (any)
 * 3) id_token candidate
 * 4) non-personal org candidate
 * 5) token candidate
 * 6) first candidate
 */
export declare function selectBestAccountCandidate(candidates: AccountIdCandidate[]): AccountIdCandidate | undefined;
/**
 * Extracts the ChatGPT account ID from a JWT access token.
 * @param accessToken - JWT access token from OAuth flow
 * @returns Account ID string or undefined if not found
 */
export declare function extractAccountId(accessToken?: string): string | undefined;
/**
 * Extracts the email address from OAuth tokens.
 * Checks id_token first (where OpenAI puts email), then falls back to access_token.
 */
export declare function extractAccountEmail(accessToken?: string, idToken?: string): string | undefined;
/**
 * Extracts all accountId candidates from access/id tokens.
 * Used to support business workspaces/organizations that are not the token default.
 */
export declare function getAccountIdCandidates(accessToken?: string, idToken?: string): AccountIdCandidate[];
/**
 * Determines if accountId should be updated from a token-derived value.
 * We keep org/manual selections stable across refreshes.
 */
export declare function shouldUpdateAccountIdFromToken(source: AccountIdSource | undefined, currentAccountId?: string): boolean;
/**
 * Resolve which accountId to use for runtime API calls.
 * Preserves explicit org/manual selections; only token/id_token sources auto-follow token changes.
 */
export declare function resolveRequestAccountId(storedAccountId: string | undefined, source: AccountIdSource | undefined, tokenAccountId: string | undefined): string | undefined;
export interface RuntimeRequestIdentity {
    accountId?: string;
    email?: string;
    tokenAccountId?: string;
}
/**
 * Resolve the live request identity for an account using the stored workspace binding
 * plus the freshest token-derived hints available for this request.
 */
export declare function resolveRuntimeRequestIdentity(input: {
    storedAccountId?: string;
    source?: AccountIdSource;
    storedEmail?: string;
    accessToken?: string;
    idToken?: string;
}): RuntimeRequestIdentity;
/**
 * Sanitizes an email address by trimming whitespace and lowercasing.
 * @param email - Email string to sanitize
 * @returns Sanitized email or undefined if invalid
 */
export declare function sanitizeEmail(email: string | undefined): string | undefined;
//# sourceMappingURL=token-utils.d.ts.map