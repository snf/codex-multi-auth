export interface CheckCommandDeps {
    runHealthCheck: (options: {
        liveProbe: boolean;
    }) => Promise<void>;
}
export declare function runCheckCommand(deps: CheckCommandDeps): Promise<number>;
//# sourceMappingURL=check.d.ts.map