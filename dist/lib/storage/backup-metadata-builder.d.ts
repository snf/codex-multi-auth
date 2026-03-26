import type { BackupMetadata } from "../storage.js";
type Snapshot = {
    kind: "accounts-primary" | "accounts-wal" | "accounts-backup" | "accounts-backup-history" | "accounts-discovered-backup" | "flagged-primary" | "flagged-backup" | "flagged-backup-history" | "flagged-discovered-backup";
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
export declare function buildBackupMetadata(params: {
    storagePath: string;
    flaggedPath: string;
    walPath: string;
    getAccountsBackupRecoveryCandidatesWithDiscovery: (path: string) => Promise<string[]>;
    describeAccountSnapshot: (path: string, kind: "accounts-primary" | "accounts-backup" | "accounts-backup-history" | "accounts-discovered-backup", index?: number) => Promise<Snapshot>;
    describeAccountsWalSnapshot: (path: string) => Promise<Snapshot>;
    describeFlaggedSnapshot: (path: string, kind: "flagged-primary" | "flagged-backup" | "flagged-backup-history" | "flagged-discovered-backup", index?: number) => Promise<Snapshot>;
    buildMetadataSection: (storagePath: string, snapshots: Snapshot[]) => {
        storagePath: string;
        latestValidPath?: string;
        snapshotCount: number;
        validSnapshotCount: number;
        snapshots: Snapshot[];
    };
}): Promise<BackupMetadata>;
export {};
//# sourceMappingURL=backup-metadata-builder.d.ts.map