export type AccountSnapshotCandidate = {
    index: number;
    email?: string;
    accountId?: string;
    accountLabel?: string;
    currentWorkspaceIndex?: number;
    workspaces?: Array<{
        id: string;
        name?: string;
        enabled?: boolean;
        isDefault?: boolean;
        disabledAt?: number;
    }>;
};
export declare function buildCapabilityBoostByAccount(input: {
    accountCount: number;
    model?: string;
    modelFamily: string;
    accountSnapshotSource: {
        getAccountsSnapshot?: () => AccountSnapshotCandidate[];
        getAccountByIndex?: (index: number) => AccountSnapshotCandidate | null;
    };
    getBoost: (accountKey: string, capabilityKey: string) => number;
}): number[];
//# sourceMappingURL=capability-boost.d.ts.map