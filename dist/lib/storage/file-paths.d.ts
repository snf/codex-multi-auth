import { ACCOUNTS_BACKUP_SUFFIX, ACCOUNTS_WAL_SUFFIX, getAccountsBackupPath, getAccountsBackupPathAtIndex, getAccountsWalPath, getIntentionalResetMarkerPath, RESET_MARKER_SUFFIX } from "./backup-paths.js";
export { ACCOUNTS_BACKUP_SUFFIX, ACCOUNTS_WAL_SUFFIX, getAccountsBackupPath, getAccountsBackupPathAtIndex, getAccountsWalPath, getIntentionalResetMarkerPath, RESET_MARKER_SUFFIX, };
export declare function getAccountsBackupRecoveryCandidates(path: string): string[];
export declare function getFlaggedAccountsPath(storagePath: string, fileName: string): string;
export declare function getLegacyFlaggedAccountsPath(storagePath: string, legacyFileName: string): string;
//# sourceMappingURL=file-paths.d.ts.map