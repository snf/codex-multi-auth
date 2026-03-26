/**
 * Shared terminal theme primitives for legacy and Codex-style TUI rendering.
 */
const ansi16 = (code) => `\x1b[${code}m`;
const ansi256 = (code) => `\x1b[38;5;${code}m`;
const truecolor = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
const ansi256Bg = (code) => `\x1b[48;5;${code}m`;
const truecolorBg = (r, g, b) => `\x1b[48;2;${r};${g};${b}m`;
/**
 * Resolve a glyph mode, interpreting `"auto"` to choose `"unicode"` or `"ascii"` based on the environment.
 *
 * Safe for concurrent use, performs no filesystem operations (including on Windows), and does not expose or log sensitive tokens.
 *
 * @param mode - The requested glyph mode ("ascii", "unicode", or "auto")
 * @returns `"unicode"` when Unicode is likely safe, `"ascii"` otherwise; if `mode` is not `"auto"`, returns it unchanged
 */
function resolveGlyphMode(mode) {
    if (mode !== "auto")
        return mode;
    const isLikelyUnicodeSafe = process.env.WT_SESSION !== undefined ||
        process.env.TERM_PROGRAM === "vscode" ||
        process.env.TERM?.toLowerCase().includes("xterm") === true;
    return isLikelyUnicodeSafe ? "unicode" : "ascii";
}
/**
 * Selects a glyph set appropriate for the given glyph mode.
 *
 * This function has no concurrency implications, performs no filesystem I/O (including on Windows), and does not perform any token redaction.
 *
 * @param mode - The resolved glyph mode; `'unicode'` yields Unicode glyphs, otherwise ASCII glyphs
 * @returns The `UiGlyphSet` matching the requested `mode`
 */
function getGlyphs(mode) {
    if (mode === "unicode") {
        return {
            selected: "◆",
            unselected: "○",
            bullet: "•",
            check: "✓",
            cross: "✗",
        };
    }
    return {
        selected: ">",
        unselected: "o",
        bullet: "-",
        check: "+",
        cross: "x",
    };
}
/**
 * Selects the ANSI escape sequence for the requested accent color according to the color profile.
 *
 * This function is pure and has no side effects: it is safe for concurrent use, performs no filesystem operations (including on Windows), and does not perform any token redaction.
 *
 * @param profile - The color profile to use (`"truecolor"`, `"ansi256"`, or `"ansi16"`)
 * @param accent - The accent name to resolve (`"green"`, `"cyan"`, `"blue"`, or `"yellow"`)
 * @returns The escape sequence for the accent color suitable for use as a foreground color
 */
function accentColorForProfile(profile, accent) {
    switch (profile) {
        case "truecolor":
            switch (accent) {
                case "cyan":
                    return truecolor(34, 211, 238);
                case "blue":
                    return truecolor(59, 130, 246);
                case "yellow":
                    return truecolor(245, 158, 11);
                default:
                    return truecolor(74, 222, 128);
            }
        case "ansi256":
            switch (accent) {
                case "cyan":
                    return ansi256(51);
                case "blue":
                    return ansi256(75);
                case "yellow":
                    return ansi256(214);
                default:
                    return ansi256(83);
            }
        default:
            switch (accent) {
                case "cyan":
                    return ansi16(96);
                case "blue":
                    return ansi16(94);
                case "yellow":
                    return ansi16(93);
                default:
                    return ansi16(92);
            }
    }
}
/**
 * Produce a set of terminal color tokens and focus/background values appropriate for the given color profile, palette, and accent.
 *
 * This function is safe for concurrent use (no shared mutable state), performs no filesystem operations (including on Windows), and returns color tokens that may contain ANSI escape sequences — treat those sequences as sensitive when logging or emitting to external telemetry and redact them as needed.
 *
 * @param profile - The color capability profile to target (`"ansi16" | "ansi256" | "truecolor"`)
 * @param palette - The UI palette selection that influences primary/success/border colors (`"green" | "blue"`)
 * @param accent - The accent color choice used for the `accent` token (`"green" | "cyan" | "blue" | "yellow"`)
 * @returns A UiThemeColors object containing resolved color tokens (e.g., `reset`, `dim`, `muted`, `heading`, `primary`, `accent`, `success`, `warning`, `danger`, `border`, `focusBg`, and `focusText`)
 */
function getColors(profile, palette, accent) {
    const accentColor = accentColorForProfile(profile, accent);
    const isBluePalette = palette === "blue";
    switch (profile) {
        case "truecolor":
            return {
                reset: "\x1b[0m",
                dim: "\x1b[2m",
                muted: truecolor(148, 163, 184),
                heading: truecolor(240, 253, 244),
                primary: isBluePalette ? truecolor(96, 165, 250) : truecolor(74, 222, 128),
                accent: accentColor,
                success: isBluePalette ? truecolor(96, 165, 250) : truecolor(74, 222, 128),
                warning: truecolor(245, 158, 11),
                danger: truecolor(239, 68, 68),
                border: isBluePalette ? truecolor(59, 130, 246) : truecolor(34, 197, 94),
                focusBg: isBluePalette ? truecolorBg(37, 99, 235) : truecolorBg(22, 101, 52),
                focusText: truecolor(248, 250, 252),
            };
        case "ansi256":
            return {
                reset: "\x1b[0m",
                dim: "\x1b[2m",
                muted: ansi256(102),
                heading: ansi256(255),
                primary: isBluePalette ? ansi256(75) : ansi256(83),
                accent: accentColor,
                success: isBluePalette ? ansi256(75) : ansi256(83),
                warning: ansi256(214),
                danger: ansi256(196),
                border: isBluePalette ? ansi256(27) : ansi256(40),
                focusBg: isBluePalette ? ansi256Bg(26) : ansi256Bg(28),
                focusText: ansi256(231),
            };
        default:
            return {
                reset: "\x1b[0m",
                dim: "\x1b[2m",
                muted: ansi16(37),
                heading: ansi16(97),
                primary: isBluePalette ? ansi16(94) : ansi16(92),
                accent: accentColor,
                success: isBluePalette ? ansi16(94) : ansi16(92),
                warning: ansi16(93),
                danger: ansi16(91),
                border: isBluePalette ? ansi16(94) : ansi16(92),
                focusBg: isBluePalette ? "\x1b[104m" : "\x1b[102m",
                focusText: "\x1b[30m",
            };
    }
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
export function createUiTheme(options) {
    const profile = options?.profile ?? "truecolor";
    const glyphMode = options?.glyphMode ?? "ascii";
    const palette = options?.palette ?? "green";
    const accent = options?.accent ?? "green";
    const resolvedGlyphMode = resolveGlyphMode(glyphMode);
    return {
        profile,
        glyphMode,
        glyphs: getGlyphs(resolvedGlyphMode),
        colors: getColors(profile, palette, accent),
    };
}
//# sourceMappingURL=theme.js.map