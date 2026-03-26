import type { ModelFamily } from "../prompts/codex.js";
import type { AccountStorageV3 } from "../storage.js";
export declare function handleAccountSelectEvent(input: {
    event: {
        type: string;
        properties?: unknown;
    };
    providerId: string;
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    modelFamilies: readonly ModelFamily[];
    getCachedAccountManager: () => {
        syncCodexCliActiveSelectionForIndex(index: number): Promise<void>;
    } | null;
    reloadAccountManagerFromDisk: () => Promise<unknown>;
    setLastCodexCliActiveSyncIndex: (index: number) => void;
    showToast: (message: string, variant?: "info" | "success" | "warning" | "error") => Promise<void>;
}): Promise<boolean>;
//# sourceMappingURL=account-select-event.d.ts.map