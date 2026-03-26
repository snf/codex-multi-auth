export interface CircuitBreakerConfig {
    failureThreshold: number;
    failureWindowMs: number;
    resetTimeoutMs: number;
    halfOpenMaxAttempts: number;
}
export declare const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig;
export type CircuitState = "closed" | "open" | "half-open";
export declare class CircuitOpenError extends Error {
    constructor(message?: string);
}
export declare class CircuitBreaker {
    private state;
    private failures;
    private lastStateChange;
    private halfOpenAttempts;
    private config;
    constructor(config?: Partial<CircuitBreakerConfig>);
    canExecute(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
    getState(): CircuitState;
    reset(): void;
    getFailureCount(): number;
    getTimeUntilReset(): number;
    private pruneFailures;
    private transitionToOpen;
    private transitionToHalfOpen;
    private resetToClosed;
}
export declare function getCircuitBreaker(key: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker;
export declare function resetAllCircuitBreakers(): void;
export declare function clearCircuitBreakers(): void;
//# sourceMappingURL=circuit-breaker.d.ts.map