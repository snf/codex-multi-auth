export async function runCheckCommand(deps) {
    await deps.runHealthCheck({ liveProbe: true });
    return 0;
}
//# sourceMappingURL=check.js.map