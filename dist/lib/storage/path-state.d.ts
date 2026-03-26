export type StoragePathState = {
    currentStoragePath: string | null;
    currentLegacyProjectStoragePath: string | null;
    currentLegacyWorktreeStoragePath: string | null;
    currentProjectRoot: string | null;
};
export declare function getStoragePathState(): StoragePathState;
export declare function setStoragePathState(state: StoragePathState): void;
//# sourceMappingURL=path-state.d.ts.map