export declare function clearAccountsEntry(params: {
    path: string;
    withStorageLock: <T>(fn: () => Promise<T>) => Promise<T>;
    resetMarkerPath: string;
    walPath: string;
    getBackupPaths: () => Promise<string[]>;
    clearAccountStorageArtifacts: (args: {
        path: string;
        resetMarkerPath: string;
        walPath: string;
        backupPaths: string[];
        logError: (message: string, details: Record<string, unknown>) => void;
    }) => Promise<void>;
    logError: (message: string, details: Record<string, unknown>) => void;
}): Promise<void>;
//# sourceMappingURL=account-clear-entry.d.ts.map