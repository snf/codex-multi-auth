/**
 * Zod schemas for runtime validation.
 * These are the single source of truth for data structures.
 * Types are inferred from schemas using z.infer.
 */
import { z } from "zod";
export declare const PluginConfigSchema: z.ZodObject<{
    codexMode: z.ZodOptional<z.ZodBoolean>;
    codexTuiV2: z.ZodOptional<z.ZodBoolean>;
    codexTuiColorProfile: z.ZodOptional<z.ZodEnum<{
        truecolor: "truecolor";
        ansi16: "ansi16";
        ansi256: "ansi256";
    }>>;
    codexTuiGlyphMode: z.ZodOptional<z.ZodEnum<{
        ascii: "ascii";
        unicode: "unicode";
        auto: "auto";
    }>>;
    fastSession: z.ZodOptional<z.ZodBoolean>;
    fastSessionStrategy: z.ZodOptional<z.ZodEnum<{
        hybrid: "hybrid";
        always: "always";
    }>>;
    fastSessionMaxInputItems: z.ZodOptional<z.ZodNumber>;
    retryAllAccountsRateLimited: z.ZodOptional<z.ZodBoolean>;
    retryAllAccountsMaxWaitMs: z.ZodOptional<z.ZodNumber>;
    retryAllAccountsMaxRetries: z.ZodOptional<z.ZodNumber>;
    unsupportedCodexPolicy: z.ZodOptional<z.ZodEnum<{
        strict: "strict";
        fallback: "fallback";
    }>>;
    fallbackOnUnsupportedCodexModel: z.ZodOptional<z.ZodBoolean>;
    fallbackToGpt52OnUnsupportedGpt53: z.ZodOptional<z.ZodBoolean>;
    unsupportedCodexFallbackChain: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    tokenRefreshSkewMs: z.ZodOptional<z.ZodNumber>;
    rateLimitToastDebounceMs: z.ZodOptional<z.ZodNumber>;
    toastDurationMs: z.ZodOptional<z.ZodNumber>;
    perProjectAccounts: z.ZodOptional<z.ZodBoolean>;
    sessionRecovery: z.ZodOptional<z.ZodBoolean>;
    autoResume: z.ZodOptional<z.ZodBoolean>;
    parallelProbing: z.ZodOptional<z.ZodBoolean>;
    parallelProbingMaxConcurrency: z.ZodOptional<z.ZodNumber>;
    emptyResponseMaxRetries: z.ZodOptional<z.ZodNumber>;
    emptyResponseRetryDelayMs: z.ZodOptional<z.ZodNumber>;
    pidOffsetEnabled: z.ZodOptional<z.ZodBoolean>;
    fetchTimeoutMs: z.ZodOptional<z.ZodNumber>;
    streamStallTimeoutMs: z.ZodOptional<z.ZodNumber>;
    liveAccountSync: z.ZodOptional<z.ZodBoolean>;
    liveAccountSyncDebounceMs: z.ZodOptional<z.ZodNumber>;
    liveAccountSyncPollMs: z.ZodOptional<z.ZodNumber>;
    sessionAffinity: z.ZodOptional<z.ZodBoolean>;
    sessionAffinityTtlMs: z.ZodOptional<z.ZodNumber>;
    sessionAffinityMaxEntries: z.ZodOptional<z.ZodNumber>;
    responseContinuation: z.ZodOptional<z.ZodBoolean>;
    backgroundResponses: z.ZodOptional<z.ZodBoolean>;
    proactiveRefreshGuardian: z.ZodOptional<z.ZodBoolean>;
    proactiveRefreshIntervalMs: z.ZodOptional<z.ZodNumber>;
    proactiveRefreshBufferMs: z.ZodOptional<z.ZodNumber>;
    networkErrorCooldownMs: z.ZodOptional<z.ZodNumber>;
    serverErrorCooldownMs: z.ZodOptional<z.ZodNumber>;
    storageBackupEnabled: z.ZodOptional<z.ZodBoolean>;
    preemptiveQuotaEnabled: z.ZodOptional<z.ZodBoolean>;
    preemptiveQuotaRemainingPercent5h: z.ZodOptional<z.ZodNumber>;
    preemptiveQuotaRemainingPercent7d: z.ZodOptional<z.ZodNumber>;
    preemptiveQuotaMaxDeferralMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type PluginConfigFromSchema = z.infer<typeof PluginConfigSchema>;
/**
 * Source of the accountId used for ChatGPT requests.
 */
export declare const AccountIdSourceSchema: z.ZodEnum<{
    token: "token";
    id_token: "id_token";
    org: "org";
    manual: "manual";
}>;
export type AccountIdSourceFromSchema = z.infer<typeof AccountIdSourceSchema>;
/**
 * Cooldown reason for temporary account suspension.
 */
export declare const CooldownReasonSchema: z.ZodEnum<{
    "auth-failure": "auth-failure";
    "network-error": "network-error";
    "rate-limit": "rate-limit";
}>;
export type CooldownReasonFromSchema = z.infer<typeof CooldownReasonSchema>;
/**
 * Reason an account needs a fresh OAuth login.
 */
export declare const AccountReauthReasonSchema: z.ZodEnum<{
    "access-token-invalidated": "access-token-invalidated";
    "refresh-token-reused": "refresh-token-reused";
    "refresh-token-invalid": "refresh-token-invalid";
    "refresh-failed": "refresh-failed";
}>;
export type AccountReauthReasonFromSchema = z.infer<typeof AccountReauthReasonSchema>;
/**
 * Last switch reason for account rotation tracking.
 */
export declare const SwitchReasonSchema: z.ZodEnum<{
    "rate-limit": "rate-limit";
    initial: "initial";
    rotation: "rotation";
    best: "best";
    restore: "restore";
}>;
export type SwitchReasonFromSchema = z.infer<typeof SwitchReasonSchema>;
/**
 * Rate limit state - maps model family to reset timestamp.
 */
export declare const RateLimitStateV3Schema: z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodNumber>>;
export type RateLimitStateV3FromSchema = z.infer<typeof RateLimitStateV3Schema>;
/**
 * Account metadata V3 - current storage format.
 */
export declare const AccountMetadataV3Schema: z.ZodObject<{
    accountId: z.ZodOptional<z.ZodString>;
    accountIdSource: z.ZodOptional<z.ZodEnum<{
        token: "token";
        id_token: "id_token";
        org: "org";
        manual: "manual";
    }>>;
    accountLabel: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodString;
    accessToken: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodNumber>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    addedAt: z.ZodNumber;
    lastUsed: z.ZodNumber;
    lastSwitchReason: z.ZodOptional<z.ZodEnum<{
        "rate-limit": "rate-limit";
        initial: "initial";
        rotation: "rotation";
        best: "best";
        restore: "restore";
    }>>;
    rateLimitResetTimes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodNumber>>>;
    coolingDownUntil: z.ZodOptional<z.ZodNumber>;
    cooldownReason: z.ZodOptional<z.ZodEnum<{
        "auth-failure": "auth-failure";
        "network-error": "network-error";
        "rate-limit": "rate-limit";
    }>>;
    requiresReauth: z.ZodOptional<z.ZodBoolean>;
    reauthReason: z.ZodOptional<z.ZodEnum<{
        "access-token-invalidated": "access-token-invalidated";
        "refresh-token-reused": "refresh-token-reused";
        "refresh-token-invalid": "refresh-token-invalid";
        "refresh-failed": "refresh-failed";
    }>>;
    reauthMessage: z.ZodOptional<z.ZodString>;
    reauthDetectedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type AccountMetadataV3FromSchema = z.infer<typeof AccountMetadataV3Schema>;
export declare const ActiveIndexByFamilySchema: z.ZodObject<{
    codex: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    "gpt-5-codex": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    "codex-max": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    "gpt-5.2": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    "gpt-5.1": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type ActiveIndexByFamilyFromSchema = z.infer<typeof ActiveIndexByFamilySchema>;
/**
 * Account storage V3 - current storage format with per-family active indices.
 */
export declare const AccountStorageV3Schema: z.ZodObject<{
    version: z.ZodLiteral<3>;
    accounts: z.ZodArray<z.ZodObject<{
        accountId: z.ZodOptional<z.ZodString>;
        accountIdSource: z.ZodOptional<z.ZodEnum<{
            token: "token";
            id_token: "id_token";
            org: "org";
            manual: "manual";
        }>>;
        accountLabel: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        refreshToken: z.ZodString;
        accessToken: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        addedAt: z.ZodNumber;
        lastUsed: z.ZodNumber;
        lastSwitchReason: z.ZodOptional<z.ZodEnum<{
            "rate-limit": "rate-limit";
            initial: "initial";
            rotation: "rotation";
            best: "best";
            restore: "restore";
        }>>;
        rateLimitResetTimes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodNumber>>>;
        coolingDownUntil: z.ZodOptional<z.ZodNumber>;
        cooldownReason: z.ZodOptional<z.ZodEnum<{
            "auth-failure": "auth-failure";
            "network-error": "network-error";
            "rate-limit": "rate-limit";
        }>>;
        requiresReauth: z.ZodOptional<z.ZodBoolean>;
        reauthReason: z.ZodOptional<z.ZodEnum<{
            "access-token-invalidated": "access-token-invalidated";
            "refresh-token-reused": "refresh-token-reused";
            "refresh-token-invalid": "refresh-token-invalid";
            "refresh-failed": "refresh-failed";
        }>>;
        reauthMessage: z.ZodOptional<z.ZodString>;
        reauthDetectedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    activeIndex: z.ZodNumber;
    activeIndexByFamily: z.ZodOptional<z.ZodObject<{
        codex: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "gpt-5-codex": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "codex-max": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "gpt-5.2": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "gpt-5.1": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AccountStorageV3FromSchema = z.infer<typeof AccountStorageV3Schema>;
/**
 * Legacy V1 account metadata for migration support.
 */
export declare const AccountMetadataV1Schema: z.ZodObject<{
    accountId: z.ZodOptional<z.ZodString>;
    accountIdSource: z.ZodOptional<z.ZodEnum<{
        token: "token";
        id_token: "id_token";
        org: "org";
        manual: "manual";
    }>>;
    accountLabel: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodString;
    accessToken: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodNumber>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    addedAt: z.ZodNumber;
    lastUsed: z.ZodNumber;
    lastSwitchReason: z.ZodOptional<z.ZodEnum<{
        "rate-limit": "rate-limit";
        initial: "initial";
        rotation: "rotation";
        best: "best";
        restore: "restore";
    }>>;
    rateLimitResetTime: z.ZodOptional<z.ZodNumber>;
    coolingDownUntil: z.ZodOptional<z.ZodNumber>;
    cooldownReason: z.ZodOptional<z.ZodEnum<{
        "auth-failure": "auth-failure";
        "network-error": "network-error";
        "rate-limit": "rate-limit";
    }>>;
}, z.core.$strip>;
export type AccountMetadataV1FromSchema = z.infer<typeof AccountMetadataV1Schema>;
/**
 * Legacy V1 storage format for migration support.
 */
export declare const AccountStorageV1Schema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    accounts: z.ZodArray<z.ZodObject<{
        accountId: z.ZodOptional<z.ZodString>;
        accountIdSource: z.ZodOptional<z.ZodEnum<{
            token: "token";
            id_token: "id_token";
            org: "org";
            manual: "manual";
        }>>;
        accountLabel: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        refreshToken: z.ZodString;
        accessToken: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        addedAt: z.ZodNumber;
        lastUsed: z.ZodNumber;
        lastSwitchReason: z.ZodOptional<z.ZodEnum<{
            "rate-limit": "rate-limit";
            initial: "initial";
            rotation: "rotation";
            best: "best";
            restore: "restore";
        }>>;
        rateLimitResetTime: z.ZodOptional<z.ZodNumber>;
        coolingDownUntil: z.ZodOptional<z.ZodNumber>;
        cooldownReason: z.ZodOptional<z.ZodEnum<{
            "auth-failure": "auth-failure";
            "network-error": "network-error";
            "rate-limit": "rate-limit";
        }>>;
    }, z.core.$strip>>;
    activeIndex: z.ZodNumber;
}, z.core.$strip>;
export type AccountStorageV1FromSchema = z.infer<typeof AccountStorageV1Schema>;
/**
 * Union of V1 and V3 storage formats for migration detection.
 */
export declare const AnyAccountStorageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    version: z.ZodLiteral<1>;
    accounts: z.ZodArray<z.ZodObject<{
        accountId: z.ZodOptional<z.ZodString>;
        accountIdSource: z.ZodOptional<z.ZodEnum<{
            token: "token";
            id_token: "id_token";
            org: "org";
            manual: "manual";
        }>>;
        accountLabel: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        refreshToken: z.ZodString;
        accessToken: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        addedAt: z.ZodNumber;
        lastUsed: z.ZodNumber;
        lastSwitchReason: z.ZodOptional<z.ZodEnum<{
            "rate-limit": "rate-limit";
            initial: "initial";
            rotation: "rotation";
            best: "best";
            restore: "restore";
        }>>;
        rateLimitResetTime: z.ZodOptional<z.ZodNumber>;
        coolingDownUntil: z.ZodOptional<z.ZodNumber>;
        cooldownReason: z.ZodOptional<z.ZodEnum<{
            "auth-failure": "auth-failure";
            "network-error": "network-error";
            "rate-limit": "rate-limit";
        }>>;
    }, z.core.$strip>>;
    activeIndex: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    version: z.ZodLiteral<3>;
    accounts: z.ZodArray<z.ZodObject<{
        accountId: z.ZodOptional<z.ZodString>;
        accountIdSource: z.ZodOptional<z.ZodEnum<{
            token: "token";
            id_token: "id_token";
            org: "org";
            manual: "manual";
        }>>;
        accountLabel: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        refreshToken: z.ZodString;
        accessToken: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        addedAt: z.ZodNumber;
        lastUsed: z.ZodNumber;
        lastSwitchReason: z.ZodOptional<z.ZodEnum<{
            "rate-limit": "rate-limit";
            initial: "initial";
            rotation: "rotation";
            best: "best";
            restore: "restore";
        }>>;
        rateLimitResetTimes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodNumber>>>;
        coolingDownUntil: z.ZodOptional<z.ZodNumber>;
        cooldownReason: z.ZodOptional<z.ZodEnum<{
            "auth-failure": "auth-failure";
            "network-error": "network-error";
            "rate-limit": "rate-limit";
        }>>;
        requiresReauth: z.ZodOptional<z.ZodBoolean>;
        reauthReason: z.ZodOptional<z.ZodEnum<{
            "access-token-invalidated": "access-token-invalidated";
            "refresh-token-reused": "refresh-token-reused";
            "refresh-token-invalid": "refresh-token-invalid";
            "refresh-failed": "refresh-failed";
        }>>;
        reauthMessage: z.ZodOptional<z.ZodString>;
        reauthDetectedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    activeIndex: z.ZodNumber;
    activeIndexByFamily: z.ZodOptional<z.ZodObject<{
        codex: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "gpt-5-codex": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "codex-max": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "gpt-5.2": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
        "gpt-5.1": z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
}, z.core.$strip>], "version">;
export type AnyAccountStorageFromSchema = z.infer<typeof AnyAccountStorageSchema>;
/**
 * Token failure reason codes.
 */
export declare const TokenFailureReasonSchema: z.ZodEnum<{
    missing_refresh: "missing_refresh";
    network_error: "network_error";
    unknown: "unknown";
    http_error: "http_error";
    invalid_response: "invalid_response";
}>;
export type TokenFailureReasonFromSchema = z.infer<typeof TokenFailureReasonSchema>;
/**
 * Successful token exchange result.
 */
export declare const TokenSuccessSchema: z.ZodObject<{
    type: z.ZodLiteral<"success">;
    access: z.ZodString;
    refresh: z.ZodString;
    expires: z.ZodNumber;
    idToken: z.ZodOptional<z.ZodString>;
    multiAccount: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type TokenSuccessFromSchema = z.infer<typeof TokenSuccessSchema>;
/**
 * Failed token exchange result.
 */
export declare const TokenFailureSchema: z.ZodObject<{
    type: z.ZodLiteral<"failed">;
    reason: z.ZodOptional<z.ZodEnum<{
        missing_refresh: "missing_refresh";
        network_error: "network_error";
        unknown: "unknown";
        http_error: "http_error";
        invalid_response: "invalid_response";
    }>>;
    statusCode: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TokenFailureFromSchema = z.infer<typeof TokenFailureSchema>;
/**
 * Token result - discriminated union of success/failure.
 */
export declare const TokenResultSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"success">;
    access: z.ZodString;
    refresh: z.ZodString;
    expires: z.ZodNumber;
    idToken: z.ZodOptional<z.ZodString>;
    multiAccount: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"failed">;
    reason: z.ZodOptional<z.ZodEnum<{
        missing_refresh: "missing_refresh";
        network_error: "network_error";
        unknown: "unknown";
        http_error: "http_error";
        invalid_response: "invalid_response";
    }>>;
    statusCode: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "type">;
export type TokenResultFromSchema = z.infer<typeof TokenResultSchema>;
/**
 * OAuth token response from OpenAI.
 */
export declare const OAuthTokenResponseSchema: z.ZodObject<{
    access_token: z.ZodString;
    refresh_token: z.ZodOptional<z.ZodString>;
    expires_in: z.ZodNumber;
    id_token: z.ZodOptional<z.ZodString>;
    token_type: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type OAuthTokenResponseFromSchema = z.infer<typeof OAuthTokenResponseSchema>;
/**
 * Safely parse plugin configuration with detailed error logging.
 * Returns null on failure, allowing graceful degradation.
 */
export declare function safeParsePluginConfig(data: unknown): PluginConfigFromSchema | null;
/**
 * Safely parse account storage (any version).
 * Returns null on failure, allowing graceful degradation.
 */
export declare function safeParseAccountStorage(data: unknown): AnyAccountStorageFromSchema | null;
/**
 * Safely parse V3 account storage specifically.
 * Returns null on failure.
 */
export declare function safeParseAccountStorageV3(data: unknown): AccountStorageV3FromSchema | null;
/**
 * Safely parse token result.
 * Returns null on failure.
 */
export declare function safeParseTokenResult(data: unknown): TokenResultFromSchema | null;
/**
 * Safely parse OAuth token response from API.
 * Returns null on failure.
 */
export declare function safeParseOAuthTokenResponse(data: unknown): OAuthTokenResponseFromSchema | null;
/**
 * Get validation errors as a flat array of strings.
 * Useful for logging and error messages.
 */
export declare function getValidationErrors(schema: z.ZodType, data: unknown): string[];
//# sourceMappingURL=schemas.d.ts.map