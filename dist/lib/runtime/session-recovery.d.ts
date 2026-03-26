import type { PluginInput } from "@codex-ai/plugin";
export declare function createRuntimeSessionRecoveryHook(deps: {
    enabled: boolean;
    client: PluginInput["client"];
    directory: string;
    autoResume: boolean;
}): import("../recovery.js").SessionRecoveryHook | null;
//# sourceMappingURL=session-recovery.d.ts.map