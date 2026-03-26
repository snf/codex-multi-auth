import { dirname, join } from "node:path";
import { ACCOUNTS_BACKUP_SUFFIX, ACCOUNTS_WAL_SUFFIX, getAccountsBackupPath, getAccountsBackupPathAtIndex, getAccountsBackupRecoveryCandidates as getBackupRecoveryCandidates, getAccountsWalPath, getIntentionalResetMarkerPath, RESET_MARKER_SUFFIX, } from "./backup-paths.js";
const ACCOUNTS_BACKUP_HISTORY_DEPTH = 3;
export { ACCOUNTS_BACKUP_SUFFIX, ACCOUNTS_WAL_SUFFIX, getAccountsBackupPath, getAccountsBackupPathAtIndex, getAccountsWalPath, getIntentionalResetMarkerPath, RESET_MARKER_SUFFIX, };
export function getAccountsBackupRecoveryCandidates(path) {
    return getBackupRecoveryCandidates(path, ACCOUNTS_BACKUP_HISTORY_DEPTH);
}
export function getFlaggedAccountsPath(storagePath, fileName) {
    return buildSiblingStoragePath(storagePath, fileName);
}
function buildSiblingStoragePath(storagePath, fileName) {
    return join(dirname(storagePath), fileName);
}
export function getLegacyFlaggedAccountsPath(storagePath, legacyFileName) {
    return buildSiblingStoragePath(storagePath, legacyFileName);
}
//# sourceMappingURL=file-paths.js.map