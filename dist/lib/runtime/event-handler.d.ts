import type { ModelFamily } from "../prompts/codex.js";
import type { AccountStorageV3 } from "../storage.js";
export declare function createRuntimeEventHandler<TLoadedStorage, TSavedStorage, TModelFamily extends string, TManager>(deps: {
    handleAccountSelectEvent: (input: {
        event: {
            type: string;
            properties?: unknown;
        };
        providerId: string;
        loadAccounts: () => Promise<TLoadedStorage>;
        saveAccounts: (storage: TSavedStorage) => Promise<void>;
        modelFamilies: readonly TModelFamily[];
        cachedAccountManager: TManager;
        reloadAccountManagerFromDisk: () => Promise<void>;
        setLastCodexCliActiveSyncIndex: (index: number) => void;
        showToast: (message: string, variant?: "info" | "success" | "warning" | "error") => Promise<void>;
    }) => Promise<boolean>;
    providerId: string;
    loadAccounts: () => Promise<TLoadedStorage>;
    saveAccounts: (storage: TSavedStorage) => Promise<void>;
    modelFamilies: readonly TModelFamily[];
    getCachedAccountManager: () => TManager;
    reloadAccountManagerFromDisk: () => Promise<void>;
    setLastCodexCliActiveSyncIndex: (index: number) => void;
    showToast: (message: string, variant?: "info" | "success" | "warning" | "error") => Promise<void>;
    logDebug: (message: string) => void;
    pluginName: string;
}): (input: {
    event: {
        type: string;
        properties?: unknown;
    };
}) => Promise<void>;
export declare function handleRuntimeEvent(params: {
    input: {
        event: {
            type: string;
            properties?: unknown;
        };
    };
    providerId: string;
    modelFamilies: readonly ModelFamily[];
    loadAccounts: () => Promise<AccountStorageV3 | null>;
    saveAccounts: (storage: AccountStorageV3) => Promise<void>;
    hasCachedAccountManager: () => boolean;
    syncCodexCliActiveSelectionForIndex: (index: number) => Promise<void>;
    setLastCodexCliActiveSyncIndex: (index: number) => void;
    reloadAccountManagerFromDisk: () => Promise<unknown>;
    showToast: (message: string, variant?: "info" | "success" | "warning" | "error") => Promise<void>;
    logDebug: (message: string) => void;
    pluginName: string;
}): Promise<void>;
//# sourceMappingURL=event-handler.d.ts.map