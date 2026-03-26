const ACCOUNT_BACKUP_PREFERRED_KINDS = new Set([
    "accounts-discovered-backup",
    "accounts-backup-history",
    "accounts-backup",
]);
const ACCOUNT_SNAPSHOT_PRIORITY = new Map([
    ["accounts-discovered-backup", 4],
    ["accounts-backup-history", 3],
    ["accounts-backup", 2],
    ["accounts-wal", 1],
    ["accounts-primary", 0],
]);
function newestValidSnapshot(snapshots, options) {
    return snapshots
        .filter((snapshot) => snapshot.valid &&
        (!options?.kinds || options.kinds.has(snapshot.kind)))
        .sort((left, right) => {
        const rightPriority = options?.priorities?.get(right.kind) ?? 0;
        const leftPriority = options?.priorities?.get(left.kind) ?? 0;
        if (rightPriority !== leftPriority) {
            return rightPriority - leftPriority;
        }
        return (right.mtimeMs ?? 0) - (left.mtimeMs ?? 0);
    })[0];
}
function selectLatestValidAccountPath(snapshots) {
    return (newestValidSnapshot(snapshots, {
        kinds: ACCOUNT_BACKUP_PREFERRED_KINDS,
        priorities: ACCOUNT_SNAPSHOT_PRIORITY,
    })?.path ??
        newestValidSnapshot(snapshots, {
            kinds: new Set(["accounts-wal"]),
            priorities: ACCOUNT_SNAPSHOT_PRIORITY,
        })?.path ??
        newestValidSnapshot(snapshots, {
            priorities: ACCOUNT_SNAPSHOT_PRIORITY,
        })?.path);
}
export async function buildBackupMetadata(params) {
    const { storagePath, flaggedPath, walPath, getAccountsBackupRecoveryCandidatesWithDiscovery, describeAccountSnapshot, describeAccountsWalSnapshot, describeFlaggedSnapshot, buildMetadataSection, } = params;
    const accountCandidates = await getAccountsBackupRecoveryCandidatesWithDiscovery(storagePath);
    const accountSnapshots = [
        await describeAccountSnapshot(storagePath, "accounts-primary"),
        await describeAccountsWalSnapshot(walPath),
    ];
    for (const [index, candidate] of accountCandidates.entries()) {
        const kind = candidate === `${storagePath}.bak`
            ? "accounts-backup"
            : candidate.startsWith(`${storagePath}.bak.`)
                ? "accounts-backup-history"
                : "accounts-discovered-backup";
        accountSnapshots.push(await describeAccountSnapshot(candidate, kind, index));
    }
    const flaggedCandidates = await getAccountsBackupRecoveryCandidatesWithDiscovery(flaggedPath);
    const flaggedSnapshots = [
        await describeFlaggedSnapshot(flaggedPath, "flagged-primary"),
    ];
    for (const [index, candidate] of flaggedCandidates.entries()) {
        const kind = candidate === `${flaggedPath}.bak`
            ? "flagged-backup"
            : candidate.startsWith(`${flaggedPath}.bak.`)
                ? "flagged-backup-history"
                : "flagged-discovered-backup";
        flaggedSnapshots.push(await describeFlaggedSnapshot(candidate, kind, index));
    }
    const accountsMetadata = buildMetadataSection(storagePath, accountSnapshots);
    const flaggedMetadata = buildMetadataSection(flaggedPath, flaggedSnapshots);
    return {
        accounts: {
            ...accountsMetadata,
            latestValidPath: selectLatestValidAccountPath(accountSnapshots) ??
                accountsMetadata.latestValidPath,
        },
        flaggedAccounts: flaggedMetadata,
    };
}
//# sourceMappingURL=backup-metadata-builder.js.map