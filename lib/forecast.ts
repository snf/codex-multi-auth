import { formatAccountLabel, formatWaitTime } from "./accounts.js";
import type { CodexQuotaSnapshot, CodexQuotaWindow } from "./quota-probe.js";
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

function clampRisk(score: number): number {
	if (!Number.isFinite(score)) return 100;
	return Math.max(0, Math.min(100, Math.round(score)));
}

function maskEmail(value: string): string {
	const atIndex = value.indexOf("@");
	if (atIndex <= 0) return "***@***";
	const local = value.slice(0, atIndex);
	const domain = value.slice(atIndex + 1);
	const domainParts = domain.split(".");
	const tld = domainParts.pop() ?? "";
	const prefix = local.slice(0, Math.min(2, local.length));
	return `${prefix}***@***.${tld || "***"}`;
}

function redactEmails(value: string): string {
	return value.replace(
		/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
		(match) => maskEmail(match),
	);
}

function redactSensitiveReason(value: string): string {
	return redactEmails(
		value
			.replace(/Bearer\s+\S+/gi, "Bearer ***")
			.replace(/\b(sk-[A-Za-z0-9]{10,})\b/g, "***"),
	);
}

function summarizeRefreshFailure(failure: TokenFailure): string {
	const reasonCode = failure.reason?.trim();
	if (reasonCode && reasonCode.length > 0) {
		const statusCode =
			typeof failure.statusCode === "number" ? ` (${failure.statusCode})` : "";
		return `${reasonCode}${statusCode}`;
	}
	const fallback = failure.message?.trim() || "refresh failed";
	return redactSensitiveReason(fallback).slice(0, 160);
}

function getRiskLevel(score: number): ForecastRiskLevel {
	if (score >= 75) return "high";
	if (score >= 40) return "medium";
	return "low";
}

function getRateLimitResetTimeForFamily(
	account: AccountMetadataV3,
	now: number,
	family = "codex",
): number | null {
	const times = account.rateLimitResetTimes;
	if (!times) return null;

	let minReset: number | null = null;
	const prefix = `${family}:`;
	for (const [key, value] of Object.entries(times)) {
		if (typeof value !== "number") continue;
		if (value <= now) continue;
		if (key !== family && !key.startsWith(prefix)) continue;
		if (minReset === null || value < minReset) {
			minReset = value;
		}
	}
	return minReset;
}

function getLiveQuotaWaitMs(snapshot: CodexQuotaSnapshot, now: number): number {
	const waits: number[] = [];
	const primaryUsed = snapshot.primary.usedPercent ?? 0;
	const secondaryUsed = snapshot.secondary.usedPercent ?? 0;
	const primaryWait = getQuotaResetWaitMs(snapshot.primary.resetAtMs, now);
	const secondaryWait = getQuotaResetWaitMs(snapshot.secondary.resetAtMs, now);

	if (snapshot.status === 429) {
		if (primaryWait > 0) waits.push(primaryWait);
		if (secondaryWait > 0) waits.push(secondaryWait);
		return waits.length > 0 ? Math.max(...waits) : 0;
	}

	if (primaryUsed >= 90 && primaryWait > 0) {
		waits.push(primaryWait);
	}
	if (secondaryUsed >= 90 && secondaryWait > 0) {
		waits.push(secondaryWait);
	}
	return waits.length > 0 ? Math.max(...waits) : 0;
}

function describeQuotaUsage(
	label: string,
	usedPercent: number | undefined,
): string | null {
	if (typeof usedPercent !== "number" || !Number.isFinite(usedPercent))
		return null;
	const bounded = Math.max(0, Math.min(100, Math.round(usedPercent)));
	return `${label} quota ${bounded}% used`;
}

function quotaRemainingPercent(
	usedPercent: number | undefined,
): number | undefined {
	if (typeof usedPercent !== "number" || !Number.isFinite(usedPercent)) {
		return undefined;
	}
	return Math.max(0, Math.min(100, Math.round(100 - usedPercent)));
}

function getQuotaResetWaitMs(resetAtMs: number | undefined, now: number): number {
	if (typeof resetAtMs !== "number" || !Number.isFinite(resetAtMs)) {
		return 0;
	}
	return Math.max(0, Math.floor(resetAtMs - now));
}

function hasQuotaSignal(window: CodexQuotaWindow | undefined): boolean {
	if (!window) return false;
	return (
		(typeof window.usedPercent === "number" && Number.isFinite(window.usedPercent)) ||
		(typeof window.windowMinutes === "number" &&
			Number.isFinite(window.windowMinutes) &&
			window.windowMinutes > 0) ||
		(typeof window.resetAtMs === "number" && Number.isFinite(window.resetAtMs))
	);
}

function markQuotaUnavailable(
	currentAvailability: ForecastAvailability,
	waitMs: number,
): ForecastAvailability {
	if (currentAvailability === "unavailable") {
		return "unavailable";
	}
	return waitMs > 0 ? "delayed" : "unavailable";
}

export function isHardRefreshFailure(failure: TokenFailure): boolean {
	if (failure.reason === "missing_refresh") return true;
	if (failure.statusCode === 401) return true;
	if (failure.statusCode !== 400) return false;
	const message = (failure.message ?? "").toLowerCase();
	return (
		message.includes("invalid_grant") ||
		message.includes("invalid refresh") ||
		message.includes("token has been revoked")
	);
}

function appendWaitReason(
	reasons: string[],
	prefix: string,
	waitMs: number,
): void {
	if (waitMs <= 0) return;
	reasons.push(`${prefix} ${formatWaitTime(waitMs)}`);
}

export function evaluateForecastAccount(
	input: ForecastAccountInput,
): ForecastAccountResult {
	const { account, index, isCurrent, now } = input;
	const reasons: string[] = [];
	let availability: ForecastAvailability = "ready";
	let riskScore = isCurrent ? -5 : 0;
	let waitMs = 0;
	let hardFailure = false;
	const disabled = account.enabled === false;

	if (disabled) {
		availability = "unavailable";
		riskScore += 95;
		reasons.push("account is disabled");
	}

	if (account.requiresReauth === true) {
		availability = "unavailable";
		riskScore += 95;
		hardFailure = true;
		reasons.push(
			account.reauthMessage
				? `re-login required: ${redactSensitiveReason(account.reauthMessage).slice(0, 160)}`
				: "re-login required",
		);
	}

	if (input.refreshFailure) {
		const hard = isHardRefreshFailure(input.refreshFailure);
		hardFailure = hard;
		const detail = summarizeRefreshFailure(input.refreshFailure);
		if (hard) {
			availability = "unavailable";
			riskScore += 90;
			reasons.push(`hard auth failure: ${detail}`);
		} else {
			riskScore += 25;
			reasons.push(`refresh warning: ${detail}`);
		}
	}

	if (
		typeof account.coolingDownUntil === "number" &&
		account.coolingDownUntil > now
	) {
		const remaining = account.coolingDownUntil - now;
		waitMs = Math.max(waitMs, remaining);
		if (availability === "ready") availability = "delayed";
		riskScore += 45;
		appendWaitReason(reasons, "cooldown remaining", remaining);
	}

	const rateLimitResetAt = getRateLimitResetTimeForFamily(
		account,
		now,
		"codex",
	);
	if (typeof rateLimitResetAt === "number") {
		const remaining = Math.max(0, rateLimitResetAt - now);
		waitMs = Math.max(waitMs, remaining);
		if (availability === "ready") availability = "delayed";
		riskScore += 35;
		appendWaitReason(reasons, "rate limit resets in", remaining);
	}

	const quota = input.liveQuota;
	const remainingPercent5h = quotaRemainingPercent(quota?.primary.usedPercent);
	const remainingPercent7d = quotaRemainingPercent(quota?.secondary.usedPercent);
	if (quota) {
		const primaryUsed = quota.primary.usedPercent ?? 0;
		const secondaryUsed = quota.secondary.usedPercent ?? 0;
		const hasPrimaryQuota = hasQuotaSignal(quota.primary);
		const hasSecondaryQuota = hasQuotaSignal(quota.secondary);
		const quotaPressure =
			quota.status === 429 || primaryUsed >= 90 || secondaryUsed >= 90;

		if (quota.status === 429) {
			availability = availability === "unavailable" ? "unavailable" : "delayed";
			riskScore += 35;
			reasons.push("live probe returned 429");
		}
		const liveWait = quotaPressure ? getLiveQuotaWaitMs(quota, now) : 0;
		waitMs = Math.max(waitMs, liveWait);
		if (liveWait > 0 && availability === "ready") {
			availability = "delayed";
		}

		const primaryUsage = describeQuotaUsage(
			"primary",
			quota.primary.usedPercent,
		);
		if (primaryUsage) reasons.push(primaryUsage);
		const secondaryUsage = describeQuotaUsage(
			"secondary",
			quota.secondary.usedPercent,
		);
		if (secondaryUsage) reasons.push(secondaryUsage);

		const wait5h = getQuotaResetWaitMs(quota.primary.resetAtMs, now);
		const wait7d = getQuotaResetWaitMs(quota.secondary.resetAtMs, now);
		if (hasPrimaryQuota && !hasSecondaryQuota) {
			waitMs = Math.max(waitMs, wait7d);
			availability = markQuotaUnavailable(availability, wait7d);
			riskScore += 60;
			reasons.push("7d quota status unavailable");
			appendWaitReason(reasons, "7d quota resets in", wait7d);
		} else if (
			typeof remainingPercent7d === "number" &&
			remainingPercent7d <= 0
		) {
			waitMs = Math.max(waitMs, wait7d);
			availability = markQuotaUnavailable(availability, wait7d);
			reasons.push("7d quota unavailable now");
			appendWaitReason(reasons, "7d quota resets in", wait7d);
		} else if (typeof remainingPercent5h === "number" && remainingPercent5h <= 0) {
			waitMs = Math.max(waitMs, wait5h);
			availability = markQuotaUnavailable(availability, wait5h);
			reasons.push("5h quota unavailable now");
			appendWaitReason(reasons, "5h quota resets in", wait5h);
		}

		if (typeof remainingPercent7d === "number" && remainingPercent7d < 5) {
			riskScore += 25;
			reasons.push(`7d remaining low (${remainingPercent7d}% left)`);
		}
		if (typeof remainingPercent5h === "number" && remainingPercent5h < 10) {
			riskScore += 15;
			reasons.push(`5h remaining low (${remainingPercent5h}% left)`);
		}

		if (primaryUsed >= 98 || secondaryUsed >= 98) {
			riskScore += 55;
		} else if (primaryUsed >= 90 || secondaryUsed >= 90) {
			riskScore += 35;
		} else if (primaryUsed >= 80 || secondaryUsed >= 80) {
			riskScore += 20;
		} else if (primaryUsed >= 70 || secondaryUsed >= 70) {
			riskScore += 10;
		}
	}

	const hasLastUsed =
		typeof account.lastUsed === "number" &&
		Number.isFinite(account.lastUsed) &&
		account.lastUsed > 0;
	const lastUsedAge = hasLastUsed ? now - account.lastUsed : null;
	if (
		lastUsedAge !== null &&
		(!Number.isFinite(lastUsedAge) || lastUsedAge < 0)
	) {
		riskScore += 5;
	} else if (lastUsedAge !== null && lastUsedAge > 7 * 24 * 60 * 60 * 1000) {
		riskScore += 10;
	}

	const finalRisk = clampRisk(riskScore);
	return {
		index,
		label: redactEmails(formatAccountLabel(account, index)),
		isCurrent,
		availability,
		riskScore: finalRisk,
		riskLevel: getRiskLevel(finalRisk),
		waitMs: Math.max(0, Math.floor(waitMs)),
		reasons,
		hardFailure,
		disabled,
		remainingPercent5h,
		remainingPercent7d,
	};
}

export function evaluateForecastAccounts(
	inputs: ForecastAccountInput[],
): ForecastAccountResult[] {
	return inputs.map((input) => evaluateForecastAccount(input));
}

function compareForecastResults(
	a: ForecastAccountResult,
	b: ForecastAccountResult,
): number {
	if (a.availability !== b.availability) {
		const rank: Record<ForecastAvailability, number> = {
			ready: 0,
			delayed: 1,
			unavailable: 2,
		};
		return rank[a.availability] - rank[b.availability];
	}

	if (
		a.availability === "delayed" &&
		b.availability === "delayed" &&
		a.waitMs !== b.waitMs
	) {
		return a.waitMs - b.waitMs;
	}

	if (
		a.availability === "ready" &&
		b.availability === "ready" &&
		a.remainingPercent7d !== b.remainingPercent7d
	) {
		return (b.remainingPercent7d ?? -1) - (a.remainingPercent7d ?? -1);
	}

	if (
		a.availability === "ready" &&
		b.availability === "ready" &&
		a.remainingPercent5h !== b.remainingPercent5h
	) {
		return (b.remainingPercent5h ?? -1) - (a.remainingPercent5h ?? -1);
	}

	if (a.riskScore !== b.riskScore) {
		return a.riskScore - b.riskScore;
	}

	if (a.isCurrent !== b.isCurrent) {
		return a.isCurrent ? -1 : 1;
	}

	return a.index - b.index;
}

export function recommendForecastAccount(
	results: ForecastAccountResult[],
): ForecastRecommendation {
	const candidates = results.filter(
		(result) => !result.disabled && !result.hardFailure,
	);
	if (candidates.length === 0) {
		return {
			recommendedIndex: null,
			reason:
				"No healthy accounts are available. Run `codex auth login` to add a fresh account.",
		};
	}

	const sorted = [...candidates].sort(compareForecastResults);
	const best = sorted[0];
	if (!best) {
		return {
			recommendedIndex: null,
			reason: "No recommendation available.",
		};
	}

	if (best.availability === "ready") {
		return {
			recommendedIndex: best.index,
			reason: `Lowest risk ready account (${best.riskLevel}, score ${best.riskScore}).`,
		};
	}

	return {
		recommendedIndex: best.index,
		reason: `No account is immediately ready; pick shortest wait (${formatWaitTime(best.waitMs)}).`,
	};
}

export function summarizeForecast(
	results: ForecastAccountResult[],
): ForecastSummary {
	return {
		total: results.length,
		ready: results.filter((result) => result.availability === "ready").length,
		delayed: results.filter((result) => result.availability === "delayed")
			.length,
		unavailable: results.filter(
			(result) => result.availability === "unavailable",
		).length,
		highRisk: results.filter((result) => result.riskLevel === "high").length,
	};
}

export function buildForecastExplanation(
	results: ForecastAccountResult[],
	recommendation: ForecastRecommendation,
): ForecastExplanation {
	return {
		recommendedIndex: recommendation.recommendedIndex,
		recommendationReason: recommendation.reason,
		considered: results.map((result) => ({
			index: result.index,
			label: result.label,
			isCurrent: result.isCurrent,
			availability: result.availability,
			riskScore: result.riskScore,
			riskLevel: result.riskLevel,
			waitMs: result.waitMs,
			reasons: result.reasons,
			selected: recommendation.recommendedIndex === result.index,
			remainingPercent5h: result.remainingPercent5h,
			remainingPercent7d: result.remainingPercent7d,
		})),
	};
}
