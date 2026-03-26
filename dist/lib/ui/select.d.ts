import type { UiTheme } from "./theme.js";
export interface MenuItem<T = string> {
    label: string;
    selectedLabel?: string;
    value: T;
    hint?: string;
    disabled?: boolean;
    hideUnavailableSuffix?: boolean;
    separator?: boolean;
    kind?: "heading";
    color?: "red" | "green" | "yellow" | "cyan";
}
export interface SelectOptions<T = string> {
    message: string;
    subtitle?: string;
    dynamicSubtitle?: () => string | undefined;
    help?: string;
    clearScreen?: boolean;
    theme?: UiTheme;
    selectedEmphasis?: "chip" | "minimal";
    focusStyle?: "row-invert" | "chip";
    showHintsForUnselected?: boolean;
    refreshIntervalMs?: number;
    initialCursor?: number;
    allowEscape?: boolean;
    onCursorChange?: (context: {
        cursor: number;
        items: MenuItem<T>[];
        requestRerender: () => void;
    }) => void;
    onInput?: (input: string, context: {
        cursor: number;
        items: MenuItem<T>[];
        requestRerender: () => void;
    }) => T | null | undefined;
}
/**
 * Present an interactive TTY menu, let the user navigate and choose an item.
 *
 * Mutates terminal state (raw mode, cursor visibility) and drives stdin/stdout until the
 * prompt finishes. Emits ANSI control sequences; on Windows the result depends on the
 * host terminal's ANSI support. Callers must not run this concurrently with other code
 * that expects normal terminal stdin/stdout state and must redact any sensitive tokens
 * in item labels/hints before calling.
 *
 * @param items - Menu items to display. Items with `disabled`, `separator`, or `kind === "heading"`
 *                are non-selectable. If exactly one selectable item exists its `value` is returned
 *                immediately.
 * @param options - Configuration for the prompt (message, subtitle or `dynamicSubtitle`, theme,
 *                  `focusStyle`, `initialCursor`, `allowEscape`, `onCursorChange`, `onInput`,
 *                  `refreshIntervalMs`, `help`, `clearScreen`, and related display behavior).
 *                  - `onInput` receives decoded hotkey input and may return a `T` to finish early
 *                    or `undefined` to continue; it may call `requestRerender` via the provided context.
 *                  - `onCursorChange` is invoked when the highlighted cursor changes and may request rerender.
 * @returns The selected item's `value`, or `null` if the prompt was cancelled or could not be started.
 *
 * @throws If not running on a TTY, if `items` is empty, or if all menu items are non-selectable.
 */
export declare function select<T>(items: MenuItem<T>[], options: SelectOptions<T>): Promise<T | null>;
//# sourceMappingURL=select.d.ts.map