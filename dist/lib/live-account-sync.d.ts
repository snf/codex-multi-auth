export interface LiveAccountSyncOptions {
    debounceMs?: number;
    pollIntervalMs?: number;
}
export interface LiveAccountSyncSnapshot {
    path: string | null;
    running: boolean;
    lastKnownMtimeMs: number | null;
    lastSyncAt: number | null;
    reloadCount: number;
    errorCount: number;
}
/**
 * Watches account storage and triggers a reload callback when file content
 * changes. Uses fs.watch + polling fallback for Windows reliability.
 */
export declare class LiveAccountSync {
    private readonly reload;
    private readonly debounceMs;
    private readonly pollIntervalMs;
    private watcher;
    private pollTimer;
    private debounceTimer;
    private currentPath;
    private running;
    private lastKnownMtimeMs;
    private lastSyncAt;
    private reloadCount;
    private errorCount;
    private reloadInFlight;
    constructor(reload: () => Promise<void>, options?: LiveAccountSyncOptions);
    syncToPath(path: string): Promise<void>;
    stop(): void;
    getSnapshot(): LiveAccountSyncSnapshot;
    private scheduleReload;
    private pollOnce;
    private runReload;
}
//# sourceMappingURL=live-account-sync.d.ts.map