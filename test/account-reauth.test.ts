import { describe, expect, it } from "vitest";
import {
	classifyAccessTokenFailureForReauth,
	classifyRefreshFailureForReauth,
} from "../lib/account-reauth.js";

describe("account reauth classification", () => {
	it("marks invalidated OAuth access tokens as requiring re-login", () => {
		const result = classifyAccessTokenFailureForReauth({
			message:
				"Your authentication token has been invalidated. Please try signing in again.",
		});

		expect(result).toEqual({
			reason: "access-token-invalidated",
			message:
				"Your authentication token has been invalidated. Please try signing in again.",
		});
	});

	it("does not treat workspace-disabled probe failures as token reauth failures", () => {
		const result = classifyAccessTokenFailureForReauth({
			message: '{"detail":{"code":"deactivated_workspace"}}',
		});

		expect(result).toBeNull();
	});

	it("keeps refresh-token reuse classification unchanged", () => {
		const result = classifyRefreshFailureForReauth({
			reason: "http_error",
			statusCode: 400,
			message:
				'{"error":{"message":"Your refresh token has already been used to generate a new access token.","code":"refresh_token_reused"}}',
		});

		expect(result?.reason).toBe("refresh-token-reused");
	});
});
