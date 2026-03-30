import { isTTY } from "./ansi.js";
export type AccountStatus = "active" | "ok" | "rate-limited" | "cooldown" | "workspace-disabled" | "disabled" | "error" | "flagged" | "unknown";
export interface AccountInfo {
    index: number;
    sourceIndex?: number;
    quickSwitchNumber?: number;
    accountId?: string;
    accountLabel?: string;
    email?: string;
    addedAt?: number;
    lastUsed?: number;
    status?: AccountStatus;
    quotaSummary?: string;
    quota5hLeftPercent?: number;
    quota5hResetAtMs?: number;
    quota7dLeftPercent?: number;
    quota7dResetAtMs?: number;
    quotaRateLimited?: boolean;
    isCurrentAccount?: boolean;
    enabled?: boolean;
    showStatusBadge?: boolean;
    showCurrentBadge?: boolean;
    showLastUsed?: boolean;
    showQuotaCooldown?: boolean;
    showHintsForUnselectedRows?: boolean;
    highlightCurrentRow?: boolean;
    focusStyle?: "row-invert" | "chip";
    statuslineFields?: string[];
}
export interface AuthMenuOptions {
    flaggedCount?: number;
    statusMessage?: string | (() => string | undefined);
}
export type AuthMenuAction = {
    type: "add";
} | {
    type: "forecast";
} | {
    type: "fix";
} | {
    type: "settings";
} | {
    type: "fresh";
} | {
    type: "check";
} | {
    type: "deep-check";
} | {
    type: "verify-flagged";
} | {
    type: "select-account";
    account: AccountInfo;
} | {
    type: "set-current-account";
    account: AccountInfo;
} | {
    type: "refresh-account";
    account: AccountInfo;
} | {
    type: "toggle-account";
    account: AccountInfo;
} | {
    type: "delete-account";
    account: AccountInfo;
} | {
    type: "search";
} | {
    type: "delete-all";
} | {
    type: "cancel";
};
export type AccountAction = "back" | "delete" | "refresh" | "toggle" | "set-current" | "cancel";
export declare function showAuthMenu(accounts: AccountInfo[], options?: AuthMenuOptions): Promise<AuthMenuAction>;
export declare function showAccountDetails(account: AccountInfo): Promise<AccountAction>;
export { isTTY };
//# sourceMappingURL=auth-menu.d.ts.map