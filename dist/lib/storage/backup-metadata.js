export function latestValidSnapshot(snapshots) {
    return snapshots
        .filter((snapshot) => snapshot.valid)
        .sort((left, right) => (right.mtimeMs ?? 0) - (left.mtimeMs ?? 0))[0];
}
export function buildMetadataSection(storagePath, snapshots) {
    const latestValid = latestValidSnapshot(snapshots);
    return {
        storagePath,
        latestValidPath: latestValid?.path,
        snapshotCount: snapshots.length,
        validSnapshotCount: snapshots.filter((snapshot) => snapshot.valid).length,
        snapshots,
    };
}
//# sourceMappingURL=backup-metadata.js.map