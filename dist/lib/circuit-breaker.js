export const DEFAULT_CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 3,
    failureWindowMs: 60_000,
    resetTimeoutMs: 30_000,
    halfOpenMaxAttempts: 1,
};
export class CircuitOpenError extends Error {
    constructor(message = "Circuit is open") {
        super(message);
        this.name = "CircuitOpenError";
    }
}
export class CircuitBreaker {
    state = "closed";
    failures = [];
    lastStateChange = Date.now();
    halfOpenAttempts = 0;
    config;
    constructor(config = {}) {
        this.config = { ...DEFAULT_CIRCUIT_BREAKER_CONFIG, ...config };
    }
    canExecute() {
        const now = Date.now();
        if (this.state === "open") {
            if (now - this.lastStateChange >= this.config.resetTimeoutMs) {
                this.transitionToHalfOpen(now);
            }
            else {
                throw new CircuitOpenError();
            }
        }
        if (this.state === "half-open") {
            if (this.halfOpenAttempts >= this.config.halfOpenMaxAttempts) {
                throw new CircuitOpenError("Circuit is half-open");
            }
            this.halfOpenAttempts += 1;
            return true;
        }
        return true;
    }
    recordSuccess() {
        const now = Date.now();
        if (this.state === "half-open") {
            this.resetToClosed(now);
            return;
        }
        if (this.state === "closed") {
            this.pruneFailures(now);
        }
    }
    recordFailure() {
        const now = Date.now();
        this.pruneFailures(now);
        this.failures.push(now);
        if (this.state === "half-open") {
            this.transitionToOpen(now);
            return;
        }
        if (this.state === "closed" && this.failures.length >= this.config.failureThreshold) {
            this.transitionToOpen(now);
        }
    }
    getState() {
        return this.state;
    }
    reset() {
        this.resetToClosed(Date.now());
    }
    getFailureCount() {
        this.pruneFailures(Date.now());
        return this.failures.length;
    }
    getTimeUntilReset() {
        if (this.state !== "open")
            return 0;
        const elapsed = Date.now() - this.lastStateChange;
        return Math.max(0, this.config.resetTimeoutMs - elapsed);
    }
    pruneFailures(now) {
        const cutoff = now - this.config.failureWindowMs;
        this.failures = this.failures.filter((timestamp) => timestamp >= cutoff);
    }
    transitionToOpen(now) {
        this.state = "open";
        this.lastStateChange = now;
        this.halfOpenAttempts = 0;
    }
    transitionToHalfOpen(now) {
        this.state = "half-open";
        this.lastStateChange = now;
        this.halfOpenAttempts = 0;
    }
    resetToClosed(now) {
        this.state = "closed";
        this.lastStateChange = now;
        this.halfOpenAttempts = 0;
        this.failures = [];
    }
}
const MAX_CIRCUIT_BREAKERS = 100;
const circuitBreakers = new Map();
export function getCircuitBreaker(key, config) {
    let breaker = circuitBreakers.get(key);
    if (!breaker) {
        if (circuitBreakers.size >= MAX_CIRCUIT_BREAKERS) {
            const firstKey = circuitBreakers.keys().next().value;
            // istanbul ignore next -- defensive: firstKey always exists when size >= MAX_CIRCUIT_BREAKERS
            if (firstKey)
                circuitBreakers.delete(firstKey);
        }
        breaker = new CircuitBreaker(config);
        circuitBreakers.set(key, breaker);
    }
    return breaker;
}
export function resetAllCircuitBreakers() {
    for (const breaker of circuitBreakers.values()) {
        breaker.reset();
    }
}
export function clearCircuitBreakers() {
    circuitBreakers.clear();
}
//# sourceMappingURL=circuit-breaker.js.map