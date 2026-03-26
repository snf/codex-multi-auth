import type { CodexQuotaSnapshot } from "./quota-probe.js";
import type { AccountMetadataV3 } from "./storage.js";
import type { TokenFailure } from "./types.js";
export type ForecastAvailability = "ready" | "delayed" | "unavailable";
export type ForecastRiskLevel = "low" | "medium" | "high";
export interface ForecastAccountInput {
    index: number;
    account: AccountMetadataV3;
    isCurrent: boolean;
    now: number;
    refreshFailure?: TokenFailure;
    liveQuota?: CodexQuotaSnapshot;
}
export interface ForecastAccountResult {
    index: number;
    label: string;
    isCurrent: boolean;
    availability: ForecastAvailability;
    riskScore: number;
    riskLevel: ForecastRiskLevel;
    waitMs: number;
    reasons: string[];
    hardFailure: boolean;
    disabled: boolean;
    remainingPercent5h?: number;
    remainingPercent7d?: number;
}
export interface ForecastRecommendation {
    recommendedIndex: number | null;
    reason: string;
}
export interface ForecastExplanationAccount {
    index: number;
    label: string;
    isCurrent: boolean;
    availability: ForecastAvailability;
    riskScore: number;
    riskLevel: ForecastRiskLevel;
    waitMs: number;
    reasons: string[];
    selected: boolean;
    remainingPercent5h?: number;
    remainingPercent7d?: number;
}
export interface ForecastExplanation {
    recommendedIndex: number | null;
    recommendationReason: string;
    considered: ForecastExplanationAccount[];
}
export interface ForecastSummary {
    total: number;
    ready: number;
    delayed: number;
    unavailable: number;
    highRisk: number;
}
export declare function isHardRefreshFailure(failure: TokenFailure): boolean;
export declare function evaluateForecastAccount(input: ForecastAccountInput): ForecastAccountResult;
export declare function evaluateForecastAccounts(inputs: ForecastAccountInput[]): ForecastAccountResult[];
export declare function recommendForecastAccount(results: ForecastAccountResult[]): ForecastRecommendation;
export declare function summarizeForecast(results: ForecastAccountResult[]): ForecastSummary;
export declare function buildForecastExplanation(results: ForecastAccountResult[], recommendation: ForecastRecommendation): ForecastExplanation;
//# sourceMappingURL=forecast.d.ts.map