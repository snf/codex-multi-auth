export declare function resolvePluginConfigSavePathKey(): string;
export declare function formatPersistError(error: unknown): string;
export declare function warnPersistFailure(scope: string, error: unknown): void;
export declare function readFileWithRetry(path: string, deps: {
    retryableCodes: ReadonlySet<string>;
    maxAttempts: number;
    sleep: (ms: number) => Promise<void>;
}): Promise<string>;
//# sourceMappingURL=settings-persist-utils.d.ts.map