import type { DashboardDisplaySettings, DashboardStatuslineField } from "../dashboard-settings.js";
import type { UiRuntimeOptions } from "../ui/runtime.js";
export declare const DEFAULT_STATUSLINE_FIELDS: DashboardStatuslineField[];
export type PreviewFocusKey = DashboardStatuslineField | "menuShowStatusBadge" | "menuShowCurrentBadge" | "menuShowLastUsed" | "menuShowQuotaSummary" | "menuShowQuotaCooldown" | "menuShowFetchStatus" | "menuShowDetailsForUnselectedRows" | "menuHighlightCurrentRow" | "menuSortEnabled" | "menuSortPinCurrent" | "menuSortQuickSwitchVisibleRow" | "menuSortMode" | "menuLayoutMode" | null;
export declare function highlightPreviewToken(text: string, ui: UiRuntimeOptions): string;
export declare function normalizeStatuslineFields(fields: DashboardStatuslineField[] | undefined): DashboardStatuslineField[];
export declare function buildSummaryPreviewText(settings: DashboardDisplaySettings, ui: UiRuntimeOptions, resolveMenuLayoutMode: (settings: DashboardDisplaySettings) => "compact-details" | "expanded-rows", focus?: PreviewFocusKey): string;
export declare function buildAccountListPreview(settings: DashboardDisplaySettings, ui: UiRuntimeOptions, resolveMenuLayoutMode: (settings: DashboardDisplaySettings) => "compact-details" | "expanded-rows", focus?: PreviewFocusKey): {
    label: string;
    hint: string;
};
//# sourceMappingURL=settings-preview.d.ts.map