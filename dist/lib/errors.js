/**
 * Typed error hierarchy for the Codex plugin.
 * Provides structured error types with codes, causes, and context.
 */
/**
 * Error codes for categorizing errors.
 */
export const ErrorCode = {
    NETWORK_ERROR: "CODEX_NETWORK_ERROR",
    API_ERROR: "CODEX_API_ERROR",
    AUTH_ERROR: "CODEX_AUTH_ERROR",
    VALIDATION_ERROR: "CODEX_VALIDATION_ERROR",
    RATE_LIMIT: "CODEX_RATE_LIMIT",
    TIMEOUT: "CODEX_TIMEOUT",
};
/**
 * Base error class for all Codex plugin errors.
 * Supports error chaining via `cause` and arbitrary context data.
 */
export class CodexError extends Error {
    name = "CodexError";
    code;
    context;
    constructor(message, options) {
        super(message, { cause: options?.cause });
        this.code = options?.code ?? ErrorCode.API_ERROR;
        this.context = options?.context;
        // istanbul ignore next -- Error.captureStackTrace always exists in Node.js
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
/**
 * Error for HTTP/API response errors.
 */
export class CodexApiError extends CodexError {
    name = "CodexApiError";
    status;
    headers;
    constructor(message, options) {
        super(message, { ...options, code: options.code ?? ErrorCode.API_ERROR });
        this.status = options.status;
        this.headers = options.headers;
    }
}
/**
 * Error for authentication failures.
 */
export class CodexAuthError extends CodexError {
    name = "CodexAuthError";
    accountId;
    retryable;
    constructor(message, options) {
        super(message, { ...options, code: options?.code ?? ErrorCode.AUTH_ERROR });
        this.accountId = options?.accountId;
        this.retryable = options?.retryable ?? false;
    }
}
/**
 * Error for network/connection failures.
 */
export class CodexNetworkError extends CodexError {
    name = "CodexNetworkError";
    retryable;
    constructor(message, options) {
        super(message, {
            ...options,
            code: options?.code ?? ErrorCode.NETWORK_ERROR,
        });
        this.retryable = options?.retryable ?? true;
    }
}
/**
 * Error for input validation failures.
 */
export class CodexValidationError extends CodexError {
    name = "CodexValidationError";
    field;
    expected;
    constructor(message, options) {
        super(message, {
            ...options,
            code: options?.code ?? ErrorCode.VALIDATION_ERROR,
        });
        this.field = options?.field;
        this.expected = options?.expected;
    }
}
/**
 * Error for rate limit exceeded.
 */
export class CodexRateLimitError extends CodexError {
    name = "CodexRateLimitError";
    retryAfterMs;
    accountId;
    constructor(message, options) {
        super(message, { ...options, code: options?.code ?? ErrorCode.RATE_LIMIT });
        this.retryAfterMs = options?.retryAfterMs;
        this.accountId = options?.accountId;
    }
}
/**
 * Storage-specific error with a filesystem code, target path, and user-facing hint.
 */
export class StorageError extends CodexError {
    name = "StorageError";
    path;
    hint;
    constructor(message, code, path, hint, cause) {
        super(message, { code, cause });
        this.path = path;
        this.hint = hint;
    }
}
//# sourceMappingURL=errors.js.map