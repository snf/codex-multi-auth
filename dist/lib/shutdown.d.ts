type CleanupFn = () => void | Promise<void>;
export declare function registerCleanup(fn: CleanupFn): void;
export declare function unregisterCleanup(fn: CleanupFn): void;
export declare function runCleanup(): Promise<void>;
export declare function getCleanupCount(): number;
export {};
//# sourceMappingURL=shutdown.d.ts.map