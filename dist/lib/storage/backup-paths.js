const ACCOUNTS_BACKUP_SUFFIX = ".bak";
const ACCOUNTS_WAL_SUFFIX = ".wal";
const RESET_MARKER_SUFFIX = ".reset-intent";
export function getAccountsBackupPath(path) {
    return `${path}${ACCOUNTS_BACKUP_SUFFIX}`;
}
export function getAccountsBackupPathAtIndex(path, index) {
    if (index <= 0) {
        return getAccountsBackupPath(path);
    }
    return `${path}${ACCOUNTS_BACKUP_SUFFIX}.${index}`;
}
export function getAccountsBackupRecoveryCandidates(path, depth) {
    const candidates = [];
    for (let i = 0; i < depth; i += 1) {
        candidates.push(getAccountsBackupPathAtIndex(path, i));
    }
    return candidates;
}
export function getAccountsWalPath(path) {
    return `${path}${ACCOUNTS_WAL_SUFFIX}`;
}
export function getIntentionalResetMarkerPath(path) {
    return `${path}${RESET_MARKER_SUFFIX}`;
}
export { ACCOUNTS_BACKUP_SUFFIX, ACCOUNTS_WAL_SUFFIX, RESET_MARKER_SUFFIX };
//# sourceMappingURL=backup-paths.js.map