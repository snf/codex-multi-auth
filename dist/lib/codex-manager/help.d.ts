export declare function printUsage(): void;
export type AuthLoginOptions = {
    manual: boolean;
};
export type ParsedAuthLoginArgs = {
    ok: true;
    options: AuthLoginOptions;
} | {
    ok: false;
    reason: "help";
} | {
    ok: false;
    reason: "error";
    message: string;
};
export declare function parseAuthLoginArgs(args: string[]): ParsedAuthLoginArgs;
export interface BestCliOptions {
    live: boolean;
    json: boolean;
    model: string;
    modelProvided: boolean;
}
export type ParsedBestArgs = {
    ok: true;
    options: BestCliOptions;
} | {
    ok: false;
    reason: "help";
} | {
    ok: false;
    reason: "error";
    message: string;
};
export declare function printBestUsage(): void;
export declare function parseBestArgs(args: string[]): ParsedBestArgs;
//# sourceMappingURL=help.d.ts.map