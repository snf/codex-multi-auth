import type { AccountIdSource } from "./types.js";
import { isTTY, type AccountStatus } from "./ui/auth-menu.js";
/**
 * Detect if running in host Desktop/TUI mode where readline prompts don't work.
 * In TUI mode, stdin/stdout are controlled by the TUI renderer, so readline breaks.
 * Exported for testing purposes.
 */
export declare function isNonInteractiveMode(): boolean;
export declare function promptAddAnotherAccount(currentCount: number): Promise<boolean>;
export type LoginMode = "add" | "forecast" | "fix" | "settings" | "fresh" | "manage" | "check" | "deep-check" | "verify-flagged" | "cancel";
export interface ExistingAccountInfo {
    accountId?: string;
    accountLabel?: string;
    email?: string;
    index: number;
    sourceIndex?: number;
    quickSwitchNumber?: number;
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
export interface LoginMenuOptions {
    flaggedCount?: number;
    statusMessage?: string | (() => string | undefined);
}
export interface LoginMenuResult {
    mode: LoginMode;
    deleteAccountIndex?: number;
    refreshAccountIndex?: number;
    toggleAccountIndex?: number;
    switchAccountIndex?: number;
    deleteAll?: boolean;
}
export declare function promptLoginMode(existingAccounts: ExistingAccountInfo[], options?: LoginMenuOptions): Promise<LoginMenuResult>;
export interface AccountSelectionCandidate {
    accountId: string;
    label: string;
    source?: AccountIdSource;
    isDefault?: boolean;
}
export interface AccountSelectionOptions {
    defaultIndex?: number;
    title?: string;
}
export declare function promptAccountSelection(candidates: AccountSelectionCandidate[], options?: AccountSelectionOptions): Promise<AccountSelectionCandidate | null>;
export { isTTY };
export type { AccountStatus };
//# sourceMappingURL=cli.d.ts.map