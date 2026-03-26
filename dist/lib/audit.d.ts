export declare enum AuditAction {
    ACCOUNT_ADD = "account.add",
    ACCOUNT_REMOVE = "account.remove",
    ACCOUNT_SWITCH = "account.switch",
    ACCOUNT_REFRESH = "account.refresh",
    ACCOUNT_EXPORT = "account.export",
    ACCOUNT_IMPORT = "account.import",
    AUTH_LOGIN = "auth.login",
    AUTH_LOGOUT = "auth.logout",
    AUTH_REFRESH = "auth.refresh",
    AUTH_FAILURE = "auth.failure",
    CONFIG_LOAD = "config.load",
    CONFIG_CHANGE = "config.change",
    REQUEST_START = "request.start",
    REQUEST_SUCCESS = "request.success",
    REQUEST_FAILURE = "request.failure",
    CIRCUIT_OPEN = "circuit.open",
    CIRCUIT_CLOSE = "circuit.close"
}
export declare enum AuditOutcome {
    SUCCESS = "success",
    FAILURE = "failure",
    PARTIAL = "partial"
}
export interface AuditEntry {
    timestamp: string;
    correlationId: string | null;
    action: AuditAction;
    actor: string;
    resource: string;
    outcome: AuditOutcome;
    metadata?: Record<string, unknown>;
}
export interface AuditConfig {
    enabled: boolean;
    logDir: string;
    maxFileSizeBytes: number;
    maxFiles: number;
}
export declare function configureAudit(config: Partial<AuditConfig>): void;
export declare function getAuditConfig(): AuditConfig;
export declare function auditLog(action: AuditAction, actor: string, resource: string, outcome: AuditOutcome, metadata?: Record<string, unknown>): void;
export declare function getAuditLogPath(): string;
export declare function listAuditLogFiles(): string[];
//# sourceMappingURL=audit.d.ts.map