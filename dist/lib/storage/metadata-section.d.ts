export declare function latestValidSnapshot<TSnapshot extends {
    valid: boolean;
    mtimeMs?: number;
}>(snapshots: TSnapshot[]): TSnapshot | undefined;
export declare function buildMetadataSection<TSnapshot extends {
    path: string;
    valid: boolean;
    mtimeMs?: number;
}>(storagePath: string, snapshots: TSnapshot[]): {
    storagePath: string;
    latestValidPath?: string;
    snapshotCount: number;
    validSnapshotCount: number;
    snapshots: TSnapshot[];
};
//# sourceMappingURL=metadata-section.d.ts.map