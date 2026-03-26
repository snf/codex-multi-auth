import type { BackupSnapshotMetadata, SnapshotStats } from "./backup-metadata.js";
/**
 * Read size and mtime metadata for a backup candidate when it exists.
 */
export declare function statSnapshot(path: string, deps: {
    stat: typeof import("node:fs").promises.stat;
    logWarn: (message: string, meta: Record<string, unknown>) => void;
}): Promise<SnapshotStats>;
/**
 * Build backup metadata for an account snapshot, treating ENOENT load races as invalid snapshots
 * that were present when the initial stat succeeded.
 */
export declare function describeAccountSnapshot(path: string, kind: BackupSnapshotMetadata["kind"], deps: {
    index?: number;
    statSnapshot: (path: string) => Promise<SnapshotStats>;
    loadAccountsFromPath: (path: string) => Promise<{
        normalized: {
            accounts: unknown[];
        } | null;
        schemaErrors: string[];
        storedVersion?: unknown;
    }>;
    logWarn: (message: string, meta: Record<string, unknown>) => void;
}): Promise<BackupSnapshotMetadata>;
//# sourceMappingURL=account-snapshot.d.ts.map