import type { FlaggedAccountStorageV1 } from "../storage.js";
import type { BackupSnapshotMetadata, SnapshotStats } from "./backup-metadata.js";
export declare function describeAccountsWalSnapshot(path: string, deps: {
    statSnapshot: (path: string) => Promise<SnapshotStats>;
    readFile: typeof import("node:fs").promises.readFile;
    isRecord: (value: unknown) => boolean;
    computeSha256: (content: string) => string;
    parseAndNormalizeStorage: (data: unknown) => {
        normalized: {
            accounts: unknown[];
        } | null;
        storedVersion?: unknown;
        schemaErrors: string[];
    };
}): Promise<BackupSnapshotMetadata>;
export declare function describeFlaggedSnapshot(path: string, kind: BackupSnapshotMetadata["kind"], deps: {
    index?: number;
    statSnapshot: (path: string) => Promise<SnapshotStats>;
    loadFlaggedAccountsFromPath: (path: string) => Promise<FlaggedAccountStorageV1>;
    logWarn?: (message: string, meta: Record<string, unknown>) => void;
}): Promise<BackupSnapshotMetadata>;
//# sourceMappingURL=snapshot-inspectors.d.ts.map