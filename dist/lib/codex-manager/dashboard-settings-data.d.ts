import { type DashboardDisplaySettings } from "../dashboard-settings.js";
export declare function cloneDashboardSettingsData(settings: DashboardDisplaySettings, deps: {
    resolveMenuLayoutMode: (settings: DashboardDisplaySettings) => "compact-details" | "expanded-rows";
    normalizeStatuslineFields: (fields: DashboardDisplaySettings["menuStatuslineFields"]) => DashboardDisplaySettings["menuStatuslineFields"];
}): DashboardDisplaySettings;
export declare function dashboardSettingsDataEqual(left: DashboardDisplaySettings, right: DashboardDisplaySettings, deps: {
    resolveMenuLayoutMode: (settings: DashboardDisplaySettings) => "compact-details" | "expanded-rows";
    normalizeStatuslineFields: (fields: DashboardDisplaySettings["menuStatuslineFields"]) => DashboardDisplaySettings["menuStatuslineFields"];
}): boolean;
//# sourceMappingURL=dashboard-settings-data.d.ts.map