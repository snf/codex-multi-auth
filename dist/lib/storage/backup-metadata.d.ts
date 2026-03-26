export type BackupSnapshotKind = "accounts-primary" | "accounts-wal" | "accounts-backup" | "accounts-backup-history" | "accounts-discovered-backup" | "flagged-primary" | "flagged-backup" | "flagged-backup-history" | "flagged-discovered-backup";
export type BackupSnapshotMetadata = {
    kind: BackupSnapshotKind;
    path: string;
    index?: number;
    exists: boolean;
    valid: boolean;
    bytes?: number;
    mtimeMs?: number;
    version?: number;
    accountCount?: number;
    flaggedCount?: number;
    schemaErrors?: string[];
};
export type BackupMetadataSection = {
    storagePath: string;
    latestValidPath?: string;
    snapshotCount: number;
    validSnapshotCount: number;
    snapshots: BackupSnapshotMetadata[];
};
export declare function latestValidSnapshot(snapshots: BackupSnapshotMetadata[]): BackupSnapshotMetadata | undefined;
export declare function buildMetadataSection(storagePath: string, snapshots: BackupSnapshotMetadata[]): BackupMetadataSection;
export type SnapshotStats = {
    exists: boolean;
    bytes?: number;
    mtimeMs?: number;
};
//# sourceMappingURL=backup-metadata.d.ts.map