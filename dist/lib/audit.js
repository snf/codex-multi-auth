import { writeFileSync, mkdirSync, existsSync, statSync, renameSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { getCorrelationId, maskEmail } from "./logger.js";
import { getCodexLogDir } from "./runtime-paths.js";
export var AuditAction;
(function (AuditAction) {
    AuditAction["ACCOUNT_ADD"] = "account.add";
    AuditAction["ACCOUNT_REMOVE"] = "account.remove";
    AuditAction["ACCOUNT_SWITCH"] = "account.switch";
    AuditAction["ACCOUNT_REFRESH"] = "account.refresh";
    AuditAction["ACCOUNT_EXPORT"] = "account.export";
    AuditAction["ACCOUNT_IMPORT"] = "account.import";
    AuditAction["AUTH_LOGIN"] = "auth.login";
    AuditAction["AUTH_LOGOUT"] = "auth.logout";
    AuditAction["AUTH_REFRESH"] = "auth.refresh";
    AuditAction["AUTH_FAILURE"] = "auth.failure";
    AuditAction["CONFIG_LOAD"] = "config.load";
    AuditAction["CONFIG_CHANGE"] = "config.change";
    AuditAction["REQUEST_START"] = "request.start";
    AuditAction["REQUEST_SUCCESS"] = "request.success";
    AuditAction["REQUEST_FAILURE"] = "request.failure";
    AuditAction["CIRCUIT_OPEN"] = "circuit.open";
    AuditAction["CIRCUIT_CLOSE"] = "circuit.close";
})(AuditAction || (AuditAction = {}));
export var AuditOutcome;
(function (AuditOutcome) {
    AuditOutcome["SUCCESS"] = "success";
    AuditOutcome["FAILURE"] = "failure";
    AuditOutcome["PARTIAL"] = "partial";
})(AuditOutcome || (AuditOutcome = {}));
const DEFAULT_CONFIG = {
    enabled: true,
    logDir: getCodexLogDir(),
    maxFileSizeBytes: 10 * 1024 * 1024,
    maxFiles: 5,
};
let auditConfig = { ...DEFAULT_CONFIG };
export function configureAudit(config) {
    auditConfig = { ...auditConfig, ...config };
}
export function getAuditConfig() {
    return { ...auditConfig };
}
function ensureLogDir() {
    if (!existsSync(auditConfig.logDir)) {
        mkdirSync(auditConfig.logDir, { recursive: true, mode: 0o700 });
    }
}
function getLogFilePath() {
    return join(auditConfig.logDir, "audit.log");
}
function rotateLogsIfNeeded() {
    const logPath = getLogFilePath();
    if (!existsSync(logPath))
        return;
    const stats = statSync(logPath);
    if (stats.size < auditConfig.maxFileSizeBytes)
        return;
    for (let i = auditConfig.maxFiles - 1; i >= 1; i--) {
        const older = join(auditConfig.logDir, `audit.${i}.log`);
        const newer = i === 1 ? logPath : join(auditConfig.logDir, `audit.${i - 1}.log`);
        if (i === auditConfig.maxFiles - 1 && existsSync(older)) {
            unlinkSync(older);
        }
        if (existsSync(newer)) {
            renameSync(newer, older);
        }
    }
}
function sanitizeActor(actor) {
    if (actor.includes("@")) {
        return maskEmail(actor);
    }
    return actor;
}
function sanitizeMetadata(metadata) {
    if (!metadata)
        return undefined;
    const sanitized = {};
    for (const [key, value] of Object.entries(metadata)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes("token") || lowerKey.includes("secret") || lowerKey.includes("password")) {
            sanitized[key] = "***REDACTED***";
        }
        else if (typeof value === "string" && value.includes("@")) {
            sanitized[key] = maskEmail(value);
        }
        else if (typeof value === "object" && value !== null) {
            sanitized[key] = sanitizeMetadata(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
export function auditLog(action, actor, resource, outcome, metadata) {
    if (!auditConfig.enabled)
        return;
    try {
        ensureLogDir();
        rotateLogsIfNeeded();
        const entry = {
            timestamp: new Date().toISOString(),
            correlationId: getCorrelationId(),
            action,
            actor: sanitizeActor(actor),
            resource,
            outcome,
            metadata: sanitizeMetadata(metadata),
        };
        const logPath = getLogFilePath();
        const line = JSON.stringify(entry) + "\n";
        writeFileSync(logPath, line, { flag: "a" });
    }
    catch {
        // Audit logging should never break the application
    }
}
export function getAuditLogPath() {
    return getLogFilePath();
}
export function listAuditLogFiles() {
    ensureLogDir();
    const files = readdirSync(auditConfig.logDir);
    return files
        .filter((f) => f.startsWith("audit") && f.endsWith(".log"))
        .map((f) => join(auditConfig.logDir, f))
        .sort();
}
//# sourceMappingURL=audit.js.map