export type LogLevel = "debug" | "info" | "warn" | "error";
export interface LogClient {
    app?: {
        log?: (options: {
            body: {
                service: string;
                level: LogLevel;
                message: string;
                extra?: Record<string, unknown>;
            };
        }) => unknown;
    };
}
declare function maskEmail(email: string): string;
export declare const LOGGING_ENABLED: boolean;
export declare const REQUEST_BODY_LOGGING_ENABLED: boolean;
export declare const DEBUG_ENABLED: boolean;
export declare const LOG_LEVEL: LogLevel;
export declare function setCorrelationId(id?: string): string;
export declare function getCorrelationId(): string | null;
export declare function clearCorrelationId(): void;
export declare function initLogger(newClient: LogClient): void;
declare function formatDuration(ms: number): string;
export declare function logRequest(stage: string, data: Record<string, unknown>): void;
export declare function logDebug(message: string, data?: unknown): void;
export declare function logInfo(message: string, data?: unknown): void;
export declare function logWarn(message: string, data?: unknown): void;
export declare function logError(message: string, data?: unknown): void;
export interface ScopedLogger {
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
    time(label: string): () => number;
    timeEnd(label: string, startTime: number): void;
}
export declare function createLogger(scope: string): ScopedLogger;
export declare function getRequestId(): number;
export { formatDuration, maskEmail };
//# sourceMappingURL=logger.d.ts.map