export interface UpdateCheckResult {
    hasUpdate: boolean;
    currentVersion: string;
    latestVersion: string | null;
    updateCommand: string;
}
export declare function checkForUpdates(force?: boolean): Promise<UpdateCheckResult>;
export declare function checkAndNotify(showToast?: (message: string, variant: "info" | "warning") => Promise<void>): Promise<void>;
export declare function clearUpdateCache(): void;
//# sourceMappingURL=auto-update-checker.d.ts.map