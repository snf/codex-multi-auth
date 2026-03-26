import type { ModelFamily } from "../prompts/codex.js";
export declare function resolveActiveIndex(storage: {
    activeIndex: number;
    activeIndexByFamily?: Partial<Record<ModelFamily, number>>;
    accounts: unknown[];
}, family?: ModelFamily): number;
export declare function getRateLimitResetTimeForFamily(account: {
    rateLimitResetTimes?: Record<string, number | undefined>;
}, now: number, family: ModelFamily): number | null;
export declare function formatRateLimitEntry(account: {
    rateLimitResetTimes?: Record<string, number | undefined>;
}, now: number, family?: ModelFamily): string | null;
//# sourceMappingURL=account-state.d.ts.map