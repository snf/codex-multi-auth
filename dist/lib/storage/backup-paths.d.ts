declare const ACCOUNTS_BACKUP_SUFFIX = ".bak";
declare const ACCOUNTS_WAL_SUFFIX = ".wal";
declare const RESET_MARKER_SUFFIX = ".reset-intent";
export declare function getAccountsBackupPath(path: string): string;
export declare function getAccountsBackupPathAtIndex(path: string, index: number): string;
export declare function getAccountsBackupRecoveryCandidates(path: string, depth: number): string[];
export declare function getAccountsWalPath(path: string): string;
export declare function getIntentionalResetMarkerPath(path: string): string;
export { ACCOUNTS_BACKUP_SUFFIX, ACCOUNTS_WAL_SUFFIX, RESET_MARKER_SUFFIX };
//# sourceMappingURL=backup-paths.d.ts.map