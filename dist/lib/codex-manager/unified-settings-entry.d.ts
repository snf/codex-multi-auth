import type { DashboardDisplaySettings } from "../dashboard-settings.js";
import type { UnifiedSettingsControllerDeps } from "./unified-settings-controller.js";
export declare function configureUnifiedSettingsEntry(initialSettings: DashboardDisplaySettings | undefined, deps: {
    configureUnifiedSettingsController: (initialSettings: DashboardDisplaySettings | undefined, deps: UnifiedSettingsControllerDeps) => Promise<DashboardDisplaySettings>;
} & UnifiedSettingsControllerDeps): Promise<DashboardDisplaySettings>;
//# sourceMappingURL=unified-settings-entry.d.ts.map