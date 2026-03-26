import type { NamedBackupSummary } from "../storage.js";
export declare function getNamedBackupsEntry(params: {
    getStoragePath: () => string;
    collectNamedBackups: (storagePath: string, deps: {
        loadAccountsFromPath: (path: string) => Promise<{
            normalized: {
                accounts: unknown[];
            } | null;
        }>;
        logDebug: (message: string, details: Record<string, unknown>) => void;
    }) => Promise<NamedBackupSummary[]>;
    loadAccountsFromPath: (path: string) => Promise<{
        normalized: {
            accounts: unknown[];
        } | null;
    }>;
    logDebug: (message: string, details: Record<string, unknown>) => void;
}): Promise<NamedBackupSummary[]>;
//# sourceMappingURL=named-backups-entry.d.ts.map