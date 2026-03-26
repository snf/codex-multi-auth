import { getCodexTuiColorProfile, getCodexTuiGlyphMode } from "../config.js";
import type { UiRuntimeOptions } from "../ui/runtime.js";
export declare function applyUiRuntimeFromConfig(pluginConfig: ReturnType<typeof import("../config.js").loadPluginConfig>, setUiRuntimeOptions: (options: {
    v2Enabled: boolean;
    colorProfile: ReturnType<typeof getCodexTuiColorProfile>;
    glyphMode: ReturnType<typeof getCodexTuiGlyphMode>;
}) => UiRuntimeOptions): UiRuntimeOptions;
export declare function getStatusMarker(ui: UiRuntimeOptions, status: "ok" | "warning" | "error"): string;
//# sourceMappingURL=ui-runtime.d.ts.map