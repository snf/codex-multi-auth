export declare const SETTINGS_WRITE_MAX_ATTEMPTS = 4;
export declare const SETTINGS_WRITE_BASE_DELAY_MS = 50;
export declare const SETTINGS_WRITE_MAX_DELAY_MS = 30000;
export declare const RETRYABLE_SETTINGS_WRITE_CODES: Set<string>;
export declare function readErrorNumber(value: unknown): number | undefined;
export declare function getErrorStatusCode(error: unknown): number | undefined;
export declare function getRetryAfterMs(error: unknown): number | undefined;
export declare function isRetryableSettingsWriteError(error: unknown): boolean;
export declare function resolveRetryDelayMs(error: unknown, attempt: number): number;
export declare function enqueueSettingsWrite<T>(pathKey: string, task: () => Promise<T>): Promise<T>;
export declare function withQueuedRetry<T>(pathKey: string, task: () => Promise<T>, deps: {
    sleep: (ms: number) => Promise<void>;
}): Promise<T>;
//# sourceMappingURL=settings-write-queue.d.ts.map