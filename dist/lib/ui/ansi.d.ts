/**
 * ANSI escape helpers and keyboard parsing for interactive TUI menus.
 */
export declare const ANSI: {
    readonly hide: "\u001B[?25l";
    readonly show: "\u001B[?25h";
    readonly altScreenOn: "\u001B[?1049h";
    readonly altScreenOff: "\u001B[?1049l";
    readonly up: (lines?: number) => string;
    readonly clearLine: "\u001B[2K";
    readonly clearScreen: "\u001B[2J";
    readonly moveTo: (row: number, col: number) => string;
    readonly black: "\u001B[30m";
    readonly white: "\u001B[97m";
    readonly cyan: "\u001B[36m";
    readonly green: "\u001B[32m";
    readonly red: "\u001B[31m";
    readonly yellow: "\u001B[33m";
    readonly bgBlue: "\u001B[44m";
    readonly bgBrightBlue: "\u001B[104m";
    readonly bgGreen: "\u001B[42m";
    readonly bgYellow: "\u001B[43m";
    readonly bgRed: "\u001B[41m";
    readonly inverse: "\u001B[7m";
    readonly dim: "\u001B[2m";
    readonly bold: "\u001B[1m";
    readonly reset: "\u001B[0m";
};
export type KeyAction = "up" | "down" | "home" | "end" | "enter" | "escape" | "escape-start" | null;
/**
 * Maps a raw stdin Buffer to a normalized keyboard action token.
 *
 * Interprets common ANSI/terminal key sequences; safe to call concurrently (stateless). On some Windows terminals sequences may differ from POSIX terminals. Returned tokens are suitable for logging or control flow; redact or avoid logging raw `data` buffers when handling sensitive input.
 *
 * @param data - Buffer containing the bytes read from stdin for a single key event
 * @returns The corresponding `KeyAction` value: `up`, `down`, `home`, `end`, `enter`, `escape`, `escape-start`, or `null` if the input is not recognized
 */
export declare function parseKey(data: Buffer): KeyAction;
export declare function isTTY(): boolean;
//# sourceMappingURL=ansi.d.ts.map