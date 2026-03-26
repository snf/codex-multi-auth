export { saveFlaggedAccountsEntry } from "./flagged-save-entry.js";
export declare function clearFlaggedAccountsEntry(params: {
    path: string;
    withStorageLock: <T>(fn: () => Promise<T>) => Promise<T>;
    markerPath: string;
    getBackupPaths: () => Promise<string[]>;
    clearFlaggedAccountsOnDisk: (args: {
        path: string;
        markerPath: string;
        backupPaths: string[];
        logError: (message: string, details: Record<string, unknown>) => void;
    }) => Promise<void>;
    logError: (message: string, details: Record<string, unknown>) => void;
}): Promise<void>;
//# sourceMappingURL=flagged-entry.d.ts.map