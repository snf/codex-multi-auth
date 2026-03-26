export function applyLoaderRuntimeSetup(params) {
    params.applyUiRuntimeFromConfig(params.pluginConfig);
    params.applyAccountStorageScope(params.pluginConfig);
    params.ensureSessionAffinity(params.pluginConfig);
    params.ensureRefreshGuardian(params.pluginConfig);
    params.applyPreemptiveQuotaSettings(params.pluginConfig);
}
//# sourceMappingURL=loader-setup.js.map