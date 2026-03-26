/**
 * Shared terminal theme primitives for legacy and Codex-style TUI rendering.
 */
export type UiColorProfile = "ansi16" | "ansi256" | "truecolor";
export type UiGlyphMode = "ascii" | "unicode" | "auto";
export type UiPalette = "green" | "blue";
export type UiAccent = "green" | "cyan" | "blue" | "yellow";
export interface UiGlyphSet {
    selected: string;
    unselected: string;
    bullet: string;
    check: string;
    cross: string;
}
export interface UiThemeColors {
    reset: string;
    dim: string;
    muted: string;
    heading: string;
    primary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    focusBg: string;
    focusText: string;
}
export interface UiTheme {
    profile: UiColorProfile;
    glyphMode: UiGlyphMode;
    glyphs: UiGlyphSet;
    colors: UiThemeColors;
}
/**
 * Create a UI theme object for terminal rendering.
 *
 * @param options - Optional configuration:
 *   - profile: color profile to use; defaults to `"truecolor"`.
 *   - glyphMode: glyph rendering mode; defaults to `"ascii"`.
 *   - palette: overall palette variant; defaults to `"green"`.
 *   - accent: accent color selection; defaults to `"green"`.
 * @returns The constructed UiTheme object containing `profile`, `glyphMode`, `glyphs`, and `colors`.
 *
 * @remarks
 * - Concurrency: creation is pure and side-effect free, safe to call concurrently.
 * - Windows filesystem: theme creation does not access the filesystem and has no platform-specific file behavior.
 * - Token redaction: this function does not handle or emit secrets or sensitive tokens.
 */
export declare function createUiTheme(options?: {
    profile?: UiColorProfile;
    glyphMode?: UiGlyphMode;
    palette?: UiPalette;
    accent?: UiAccent;
}): UiTheme;
//# sourceMappingURL=theme.d.ts.map