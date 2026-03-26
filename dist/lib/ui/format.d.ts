import type { UiRuntimeOptions } from "./runtime.js";
export type UiTextTone = "primary" | "heading" | "accent" | "muted" | "success" | "warning" | "danger" | "normal";
/**
 * Colorize a text string according to the UI theme and tone.
 *
 * If `ui.v2Enabled` is false or the tone maps to no color, the original `text` is returned unchanged.
 *
 * Concurrency: pure and side-effect-free; safe to call concurrently.
 * Filesystem: performs no I/O and behaves identically on Windows and other platforms.
 * Token redaction: this function only wraps `text` with theme color tokens and does not redact or alter token contents.
 *
 * @param ui - Runtime UI options (used to determine theme colors and whether v2 styling is enabled)
 * @param text - The text to colorize
 * @param tone - The text tone to apply; when the tone maps to no color (e.g., "normal") the text is returned as-is
 * @returns The input `text` wrapped with the theme color start token for `tone` and the theme reset token, or the original `text` if no color is applied
 */
export declare function paintUiText(ui: UiRuntimeOptions, text: string, tone?: UiTextTone): string;
export declare function formatUiHeader(ui: UiRuntimeOptions, title: string): string[];
export declare function formatUiSection(ui: UiRuntimeOptions, title: string): string[];
export declare function formatUiItem(ui: UiRuntimeOptions, text: string, tone?: UiTextTone): string;
/**
 * Format a key/value pair for display, applying muted styling to the key and a configurable tone to the value when v2 UI is enabled.
 *
 * @param ui - Runtime UI options that control theming and v2 behavior
 * @param key - The label for the value; a trailing colon is added when v2 is enabled
 * @param value - The value text to display
 * @param valueTone - Tone to apply to the value (e.g., "accent", "success"); "normal" leaves the value uncolored
 *
 * Concurrency: pure and safe to call concurrently.
 * Windows: ANSI or truecolor sequences may not be interpreted on older Windows terminals.
 * Redaction: this function does not redact sensitive tokens; callers must provide already-redacted values if needed.
 *
 * @returns The formatted key/value string, optionally wrapped with theme color sequences when v2 is enabled
 */
export declare function formatUiKeyValue(ui: UiRuntimeOptions, key: string, value: string, valueTone?: UiTextTone): string;
/**
 * Format a badge label for the UI, applying tone-specific styling when v2 UI is enabled.
 *
 * @param ui - Runtime UI options that control styling, color profile, and v2 enablement
 * @param label - Text to display inside the badge (will be wrapped in square brackets)
 * @param tone - Visual tone for the badge; must not be `"normal"` or `"heading"`
 * @returns The badge string; when v2 is disabled this is `"[label]"`, otherwise the label wrapped with start/end styling sequences
 *
 * @remarks
 * Concurrency: safe to call concurrently; function is pure with respect to provided inputs.
 * Windows filesystem: output contains ANSI/ANSI256/truecolor escape sequences when v2 is enabled—terminal support may vary on Windows consoles.
 * Token redaction: this function does not perform any secret/token redaction; callers should redact sensitive values in `label` before calling if needed.
 */
export declare function formatUiBadge(ui: UiRuntimeOptions, label: string, tone?: Exclude<UiTextTone, "normal" | "heading">): string;
/**
 * Selects a UI tone representing quota health based on remaining percentage.
 *
 * @param leftPercent - Percentage of quota remaining (typically 0–100)
 * @returns `'success'` if `leftPercent` > 35, `'warning'` if `leftPercent` ≤ 35 and > 15, `'danger'` if `leftPercent` ≤ 15
 *
 * @remarks
 * Concurrency: pure and side-effect-free; safe to call from concurrent contexts.
 * Windows filesystem: no filesystem interaction.
 * Token redaction: does not handle or emit sensitive tokens.
 */
export declare function quotaToneFromLeftPercent(leftPercent: number): Extract<UiTextTone, "success" | "warning" | "danger">;
//# sourceMappingURL=format.d.ts.map