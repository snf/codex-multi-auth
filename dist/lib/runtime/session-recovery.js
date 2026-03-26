import { createSessionRecoveryHook } from "../recovery.js";
export function createRuntimeSessionRecoveryHook(deps) {
    return deps.enabled
        ? createSessionRecoveryHook({ client: deps.client, directory: deps.directory }, { sessionRecovery: true, autoResume: deps.autoResume })
        : null;
}
//# sourceMappingURL=session-recovery.js.map