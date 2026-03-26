declare const TEMPLATE_MAP: {
    readonly modern: "codex-modern.json";
    readonly legacy: "codex-legacy.json";
    readonly minimal: "minimal-codex.json";
};
type TemplateName = keyof typeof TEMPLATE_MAP;
export declare function runInitConfigCommand(args: string[], deps?: {
    logInfo?: (message: string) => void;
    logError?: (message: string) => void;
    readTemplate?: (template: TemplateName) => Promise<string>;
    writeTemplate?: (path: string, content: string) => Promise<void>;
    cwd?: () => string;
}): Promise<number>;
export {};
//# sourceMappingURL=init-config.d.ts.map