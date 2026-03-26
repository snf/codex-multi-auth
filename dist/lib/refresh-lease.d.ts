import { promises as fs } from "node:fs";
import type { TokenResult } from "./types.js";
type LeaseFsOps = Pick<typeof fs, "mkdir" | "open" | "writeFile" | "rename" | "unlink" | "readFile" | "stat" | "readdir">;
export interface RefreshLeaseCoordinatorOptions {
    enabled?: boolean;
    leaseDir?: string;
    leaseTtlMs?: number;
    waitTimeoutMs?: number;
    pollIntervalMs?: number;
    resultTtlMs?: number;
    fsOps?: LeaseFsOps;
}
export interface RefreshLeaseHandle {
    role: "owner" | "follower" | "bypass";
    result?: TokenResult;
    release: (result?: TokenResult) => Promise<void>;
}
export declare class RefreshLeaseCoordinator {
    private readonly enabled;
    private readonly leaseDir;
    private readonly leaseTtlMs;
    private readonly waitTimeoutMs;
    private readonly pollIntervalMs;
    private readonly resultTtlMs;
    private readonly fsOps;
    constructor(options?: RefreshLeaseCoordinatorOptions);
    static fromEnvironment(): RefreshLeaseCoordinator;
    acquire(refreshToken: string): Promise<RefreshLeaseHandle>;
    private createBypassHandle;
    private createOwnerHandle;
    private writeResult;
    private readFreshResult;
    private assessLockStaleness;
    private pruneExpiredArtifacts;
}
export {};
//# sourceMappingURL=refresh-lease.d.ts.map