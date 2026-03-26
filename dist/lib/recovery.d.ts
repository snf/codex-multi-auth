import type { PluginInput } from "@codex-ai/plugin";
import type { PluginConfig } from "./types.js";
import type { MessageInfo, MessageData, RecoveryErrorType, ResumeConfig } from "./recovery/types.js";
export type { RecoveryErrorType, MessageInfo, MessageData, ResumeConfig };
type PluginClient = PluginInput["client"];
export declare function detectErrorType(error: unknown): RecoveryErrorType;
export declare function isRecoverableError(error: unknown): boolean;
export declare function getRecoveryToastContent(errorType: RecoveryErrorType): {
    title: string;
    message: string;
};
export declare function getRecoverySuccessToast(): {
    title: string;
    message: string;
};
export declare function getRecoveryFailureToast(): {
    title: string;
    message: string;
};
export interface SessionRecoveryHook {
    handleSessionRecovery: (info: MessageInfo) => Promise<boolean>;
    isRecoverableError: (error: unknown) => boolean;
    setOnAbortCallback: (callback: (sessionID: string) => void) => void;
    setOnRecoveryCompleteCallback: (callback: (sessionID: string) => void) => void;
}
export interface SessionRecoveryContext {
    client: PluginClient;
    directory: string;
}
export declare function createSessionRecoveryHook(ctx: SessionRecoveryContext, config: PluginConfig): SessionRecoveryHook | null;
//# sourceMappingURL=recovery.d.ts.map