export const ACCOUNT_REAUTH_REASONS = [
	"access-token-invalidated",
	"refresh-token-reused",
	"refresh-token-invalid",
	"refresh-failed",
] as const;

export type AccountReauthReason = (typeof ACCOUNT_REAUTH_REASONS)[number];

export type AccountReauthMetadata = {
	requiresReauth?: boolean;
	reauthReason?: AccountReauthReason;
	reauthMessage?: string;
	reauthDetectedAt?: number;
};

type TokenFailureLike = {
	reason?: string;
	statusCode?: number;
	message?: string;
};

export type AccountReauthRequirement = {
	reason: AccountReauthReason;
	message: string;
};

function collapseWhitespace(value: string): string {
	return value.replace(/\s+/g, " ").trim();
}

function extractString(record: Record<string, unknown>, key: string): string {
	const value = record[key];
	return typeof value === "string" ? collapseWhitespace(value) : "";
}

function extractPayloadMessage(payload: unknown): string | undefined {
	if (!payload || typeof payload !== "object") return undefined;
	const record = payload as Record<string, unknown>;
	const message = extractString(record, "message");
	const code = extractString(record, "code");
	if (message) {
		if (code && !message.toLowerCase().includes(code.toLowerCase())) {
			return `${message} [${code}]`;
		}
		return message;
	}

	const nested = record.error;
	if (nested && typeof nested === "object") {
		return extractPayloadMessage(nested);
	}
	return undefined;
}

function extractPayloadCode(payload: unknown): string | undefined {
	if (!payload || typeof payload !== "object") return undefined;
	const record = payload as Record<string, unknown>;
	const code = extractString(record, "code");
	if (code) return code;

	for (const key of ["error", "detail"]) {
		const nested = record[key];
		if (nested && typeof nested === "object") {
			const nestedCode = extractPayloadCode(nested);
			if (nestedCode) return nestedCode;
		}
	}
	return undefined;
}

function parseJsonCandidate<T>(
	raw: string | undefined,
	extract: (payload: unknown) => T | undefined,
): T | undefined {
	const trimmed = raw?.trim();
	if (!trimmed) return undefined;
	const candidates = new Set<string>([trimmed]);
	const firstBrace = trimmed.indexOf("{");
	const lastBrace = trimmed.lastIndexOf("}");
	if (firstBrace >= 0 && lastBrace > firstBrace) {
		candidates.add(trimmed.slice(firstBrace, lastBrace + 1));
	}

	for (const candidate of candidates) {
		try {
			const parsed = JSON.parse(candidate) as unknown;
			const value = extract(parsed);
			if (value) return value;
		} catch {
			// Non-JSON OAuth errors are handled by text matching below.
		}
	}
	return undefined;
}

function formatReasonLabel(reason: string | undefined): string | undefined {
	if (!reason) return undefined;
	const normalized = collapseWhitespace(reason.replace(/_/g, " "));
	return normalized.length > 0 ? normalized : undefined;
}

function formatReauthMessage(failure: TokenFailureLike): string {
	const raw = failure.message?.trim();
	const structured = parseJsonCandidate(raw, extractPayloadMessage);
	const message = collapseWhitespace(
		structured ?? raw ?? formatReasonLabel(failure.reason) ?? "refresh failed",
	);
	if (!message) return "Refresh failed; re-login required.";
	return message.length > 260 ? `${message.slice(0, 257)}...` : message;
}

function collectFailureCodes(failure: TokenFailureLike): Set<string> {
	const codes = new Set<string>();
	const reason = failure.reason?.trim();
	if (reason) codes.add(reason.toLowerCase());
	const structuredCode = parseJsonCandidate(failure.message, extractPayloadCode);
	if (structuredCode) codes.add(structuredCode.toLowerCase());
	const bracketMatches = failure.message?.matchAll(/\[([a-z0-9_.-]+)\]/gi) ?? [];
	for (const match of bracketMatches) {
		const code = match[1]?.trim().toLowerCase();
		if (code) codes.add(code);
	}
	return codes;
}

function failureText(failure: TokenFailureLike): string {
	return [
		failure.reason,
		typeof failure.statusCode === "number" ? String(failure.statusCode) : "",
		failure.message,
	]
		.filter((value): value is string => typeof value === "string" && value.length > 0)
		.join(" ")
		.toLowerCase();
}

export function classifyRefreshFailureForReauth(
	failure: TokenFailureLike,
	options: { sessionUsable?: boolean } = {},
): AccountReauthRequirement | null {
	const codes = collectFailureCodes(failure);
	const text = failureText(failure);
	const message = formatReauthMessage(failure);

	if (
		codes.has("refresh_token_reused") ||
		text.includes("already been used to generate a new access token")
	) {
		return { reason: "refresh-token-reused", message };
	}

	if (
		failure.reason === "missing_refresh" ||
		codes.has("invalid_grant") ||
		text.includes("invalid refresh") ||
		text.includes("token has been revoked")
	) {
		return { reason: "refresh-token-invalid", message };
	}

	if (
		options.sessionUsable !== true &&
		(failure.statusCode === 400 ||
			failure.statusCode === 401 ||
			failure.statusCode === 403)
	) {
		return { reason: "refresh-token-invalid", message };
	}

	if (
		options.sessionUsable === false &&
		failure.reason !== "network_error" &&
		failure.reason !== "unknown"
	) {
		return { reason: "refresh-failed", message };
	}

	return null;
}

export function classifyAccessTokenFailureForReauth(
	failure: TokenFailureLike,
): AccountReauthRequirement | null {
	const codes = collectFailureCodes(failure);
	const text = failureText(failure);
	const message = formatReauthMessage(failure);

	if (
		codes.has("invalid_token") ||
		codes.has("token_invalidated") ||
		codes.has("access_token_invalidated") ||
		text.includes("authentication token has been invalidated") ||
		text.includes("access token has been invalidated") ||
		text.includes("oauth token has been invalidated") ||
		text.includes("token has been invalidated") ||
		text.includes("invalid bearer token")
	) {
		return { reason: "access-token-invalidated", message };
	}

	return null;
}

export function markAccountReauthRequired(
	account: AccountReauthMetadata,
	requirement: AccountReauthRequirement,
	now: number,
): boolean {
	const nextMessage = requirement.message.trim() || "Refresh failed; re-login required.";
	const changed =
		account.requiresReauth !== true ||
		account.reauthReason !== requirement.reason ||
		account.reauthMessage !== nextMessage ||
		account.reauthDetectedAt !== now;
	account.requiresReauth = true;
	account.reauthReason = requirement.reason;
	account.reauthMessage = nextMessage;
	account.reauthDetectedAt = now;
	return changed;
}

export function clearAccountReauthRequired(account: AccountReauthMetadata): boolean {
	const changed =
		account.requiresReauth !== undefined ||
		account.reauthReason !== undefined ||
		account.reauthMessage !== undefined ||
		account.reauthDetectedAt !== undefined;
	delete account.requiresReauth;
	delete account.reauthReason;
	delete account.reauthMessage;
	delete account.reauthDetectedAt;
	return changed;
}
