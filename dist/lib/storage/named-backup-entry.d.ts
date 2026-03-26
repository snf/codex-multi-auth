export declare function exportNamedBackupEntry(params: {
    name: string;
    options?: {
        force?: boolean;
    };
    exportNamedBackupFile: (name: string, deps: {
        getStoragePath: () => string;
        exportAccounts: (filePath: string, force?: boolean, beforeCommit?: (resolvedPath: string) => Promise<void> | void) => Promise<void>;
    }, options?: {
        force?: boolean;
    }) => Promise<string>;
    getStoragePath: () => string;
    exportAccounts: (filePath: string, force?: boolean, beforeCommit?: (resolvedPath: string) => Promise<void> | void) => Promise<void>;
}): Promise<string>;
//# sourceMappingURL=named-backup-entry.d.ts.map