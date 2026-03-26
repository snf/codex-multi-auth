export declare function createAbortableSleep(abortSignal?: AbortSignal | null): (ms: number) => Promise<void>;
export declare function sleepWithCountdown(params: {
    totalMs: number;
    message: string;
    sleep: (ms: number) => Promise<void>;
    showToast: (message: string, variant: "warning", options: {
        duration: number;
    }) => Promise<void>;
    formatWaitTime: (ms: number) => string;
    toastDurationMs: number;
    abortSignal?: AbortSignal | null;
    intervalMs?: number;
}): Promise<void>;
//# sourceMappingURL=wait-utils.d.ts.map