import type { AccountStorageV3 } from "../../storage.js";
type LoadedStorage = AccountStorageV3 | null;
type PersistAndSyncSelectedAccount = (params: {
    storage: AccountStorageV3;
    targetIndex: number;
    parsed: number;
    switchReason: "rotation" | "best" | "restore";
}) => Promise<{
    synced: boolean;
    wasDisabled: boolean;
}>;
export interface SwitchCommandDeps {
    setStoragePath: (path: string | null) => void;
    loadAccounts: () => Promise<LoadedStorage>;
    persistAndSyncSelectedAccount: PersistAndSyncSelectedAccount;
    logError?: (message: string) => void;
    logWarn?: (message: string) => void;
    logInfo?: (message: string) => void;
}
export declare function runSwitchCommand(args: string[], deps: SwitchCommandDeps): Promise<number>;
export {};
//# sourceMappingURL=switch.d.ts.map