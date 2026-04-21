/**
 * Storage migration utilities for account data format upgrades.
 * Extracted from storage.ts to reduce module size.
 */
import type { AccountReauthReason } from "../account-reauth.js";
import { type ModelFamily } from "../prompts/codex.js";
import type { AccountIdSource } from "../types.js";
import type { Workspace } from "../accounts.js";
export type CooldownReason = "auth-failure" | "network-error" | "rate-limit";
export interface RateLimitStateV3 {
    [key: string]: number | undefined;
}
export interface AccountMetadataV1 {
    accountId?: string;
    accountIdSource?: AccountIdSource;
    accountLabel?: string;
    email?: string;
    refreshToken: string;
    /** Optional cached access token (Codex CLI parity). */
    accessToken?: string;
    /** Optional access token expiry timestamp (ms since epoch). */
    expiresAt?: number;
    enabled?: boolean;
    addedAt: number;
    lastUsed: number;
    lastSwitchReason?: "rate-limit" | "initial" | "rotation" | "best" | "restore";
    rateLimitResetTime?: number;
    coolingDownUntil?: number;
    cooldownReason?: CooldownReason;
    requiresReauth?: boolean;
    reauthReason?: AccountReauthReason;
    reauthMessage?: string;
    reauthDetectedAt?: number;
}
export interface AccountStorageV1 {
    version: 1;
    accounts: AccountMetadataV1[];
    activeIndex: number;
}
export interface AccountMetadataV3 {
    accountId?: string;
    accountIdSource?: AccountIdSource;
    accountLabel?: string;
    email?: string;
    refreshToken: string;
    /** Optional cached access token (Codex CLI parity). */
    accessToken?: string;
    /** Optional access token expiry timestamp (ms since epoch). */
    expiresAt?: number;
    enabled?: boolean;
    addedAt: number;
    lastUsed: number;
    lastSwitchReason?: "rate-limit" | "initial" | "rotation" | "best" | "restore";
    rateLimitResetTimes?: RateLimitStateV3;
    coolingDownUntil?: number;
    cooldownReason?: CooldownReason;
    requiresReauth?: boolean;
    reauthReason?: AccountReauthReason;
    reauthMessage?: string;
    reauthDetectedAt?: number;
    workspaces?: Workspace[];
    currentWorkspaceIndex?: number;
}
export interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: Partial<Record<ModelFamily, number>>;
}
export declare function migrateV1ToV3(v1: AccountStorageV1): AccountStorageV3;
//# sourceMappingURL=migrations.d.ts.map