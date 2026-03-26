import type { CodexQuotaSnapshot } from "../quota-probe.js";
export type { CodexQuotaSnapshot, CodexQuotaWindow } from "../quota-probe.js";
export type ParsedCodexQuotaSnapshot = Omit<CodexQuotaSnapshot, "model">;
export declare function parseFiniteNumberHeader(headers: Headers, name: string): number | undefined;
export declare function parseFiniteIntHeader(headers: Headers, name: string): number | undefined;
export declare function parseResetAtMs(headers: Headers, prefix: string): number | undefined;
export declare function hasCodexQuotaHeaders(headers: Headers): boolean;
export declare function parseCodexQuotaSnapshot(headers: Headers, status: number): ParsedCodexQuotaSnapshot | null;
export declare function formatQuotaWindowLabel(windowMinutes: number | undefined): string;
export declare function formatResetAt(resetAtMs: number | undefined): string | undefined;
export declare function formatCodexQuotaLine(snapshot: Pick<CodexQuotaSnapshot, "status" | "planType" | "activeLimit" | "primary" | "secondary">): string;
//# sourceMappingURL=quota-headers.d.ts.map