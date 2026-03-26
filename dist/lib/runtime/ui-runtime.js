import { getCodexTuiColorProfile, getCodexTuiGlyphMode, getCodexTuiV2, } from "../config.js";
export function applyUiRuntimeFromConfig(pluginConfig, setUiRuntimeOptions) {
    return setUiRuntimeOptions({
        v2Enabled: getCodexTuiV2(pluginConfig),
        colorProfile: getCodexTuiColorProfile(pluginConfig),
        glyphMode: getCodexTuiGlyphMode(pluginConfig),
    });
}
export function getStatusMarker(ui, status) {
    if (!ui.v2Enabled) {
        if (status === "ok")
            return "✓";
        if (status === "warning")
            return "!";
        return "✗";
    }
    if (status === "ok")
        return ui.theme.glyphs.check;
    if (status === "warning")
        return "!";
    return ui.theme.glyphs.cross;
}
//# sourceMappingURL=ui-runtime.js.map