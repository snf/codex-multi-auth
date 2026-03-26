export function formatDashboardSettingState(value) {
    return value ? "[x]" : "[ ]";
}
export function formatMenuSortMode(mode) {
    return mode === "ready-first" ? "Ready-First" : "Manual";
}
export function formatMenuLayoutMode(mode) {
    return mode === "expanded-rows" ? "Expanded Rows" : "Compact + Details Pane";
}
export function formatMenuQuotaTtl(ttlMs) {
    if (ttlMs >= 60_000 && ttlMs % 60_000 === 0) {
        return `${Math.round(ttlMs / 60_000)}m`;
    }
    if (ttlMs >= 1_000 && ttlMs % 1_000 === 0) {
        return `${Math.round(ttlMs / 1_000)}s`;
    }
    return `${ttlMs}ms`;
}
//# sourceMappingURL=dashboard-formatters.js.map