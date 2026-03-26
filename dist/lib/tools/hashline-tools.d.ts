import { type ToolDefinition } from "@codex-ai/plugin/tool";
type HashlineOperation = "replace" | "insert_before" | "insert_after" | "delete";
export interface ParsedHashlineRef {
    lineNumber: number;
    hash: string;
    raw: string;
}
type HashlineEditFailure = {
    ok: false;
    message: string;
};
type HashlineEditSuccess = {
    ok: true;
    updatedContent: string;
    operation: HashlineOperation;
    changedStartLine: number;
    changedEndLine: number;
};
type HashlineEditResult = HashlineEditFailure | HashlineEditSuccess;
type LegacyEditFailure = {
    ok: false;
    message: string;
};
type LegacyEditSuccess = {
    ok: true;
    updatedContent: string;
    replacements: number;
};
type LegacyEditResult = LegacyEditFailure | LegacyEditSuccess;
type HashlineEditArgs = {
    lineRef?: string;
    endLineRef?: string;
    operation?: string;
    content?: string;
    newString?: string;
};
type LegacyEditArgs = {
    oldString?: string;
    newString?: string;
    replaceAll?: boolean;
};
export declare function computeHashline(text: string): string;
export declare function formatHashlineRef(lineNumber: number, text: string): string;
export declare function parseHashlineRef(value: string): ParsedHashlineRef | null;
export declare function renderHashlineSlice(content: string, startLine?: number, maxLines?: number): string;
export declare function applyLegacyEdit(content: string, args: LegacyEditArgs): LegacyEditResult;
export declare function applyHashlineEdit(content: string, args: HashlineEditArgs): HashlineEditResult;
export declare function createHashlineReadTool(): ToolDefinition;
export declare function createHashlineEditTool(): ToolDefinition;
export {};
//# sourceMappingURL=hashline-tools.d.ts.map