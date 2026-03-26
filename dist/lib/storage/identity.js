import { createHash } from "node:crypto";
function normalizeAccountIdKey(accountId) {
    if (!accountId)
        return undefined;
    const trimmed = accountId.trim();
    return trimmed || undefined;
}
export function normalizeEmailKey(email) {
    if (!email)
        return undefined;
    const trimmed = email.trim();
    if (!trimmed)
        return undefined;
    return trimmed.toLowerCase();
}
function normalizeRefreshTokenKey(refreshToken) {
    if (!refreshToken)
        return undefined;
    const trimmed = refreshToken.trim();
    return trimmed || undefined;
}
function hashRefreshTokenKey(refreshToken) {
    return createHash("sha256").update(refreshToken).digest("hex");
}
export function toAccountIdentityRef(account) {
    return {
        accountId: normalizeAccountIdKey(account?.accountId),
        emailKey: normalizeEmailKey(account?.email),
        refreshToken: normalizeRefreshTokenKey(account?.refreshToken),
    };
}
export function getAccountIdentityKey(account) {
    const ref = toAccountIdentityRef(account);
    if (ref.accountId && ref.emailKey) {
        return `account:${ref.accountId}::email:${ref.emailKey}`;
    }
    if (ref.accountId)
        return `account:${ref.accountId}`;
    if (ref.emailKey)
        return `email:${ref.emailKey}`;
    if (ref.refreshToken) {
        // Legacy refresh-only identity keys embedded raw tokens. Hashing preserves
        // deterministic fallback matching without exposing token material in logs.
        return `refresh:${hashRefreshTokenKey(ref.refreshToken)}`;
    }
    return undefined;
}
//# sourceMappingURL=identity.js.map