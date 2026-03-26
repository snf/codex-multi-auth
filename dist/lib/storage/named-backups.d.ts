export interface NamedBackupSummary {
    path: string;
    fileName: string;
    accountCount: number;
    mtimeMs: number;
}
export declare function collectNamedBackups(storagePath: string, deps: {
    loadAccountsFromPath: (path: string) => Promise<{
        normalized: {
            accounts: unknown[];
        } | null;
    }>;
    logDebug: (message: string, details: Record<string, unknown>) => void;
}): Promise<NamedBackupSummary[]>;
//# sourceMappingURL=named-backups.d.ts.map