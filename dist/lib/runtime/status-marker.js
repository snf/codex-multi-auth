export function getRuntimeStatusMarker(ui, status) {
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
//# sourceMappingURL=status-marker.js.map