/**
 * Browser utilities for OAuth flow
 * Handles platform-specific browser opening
 */
/**
 * Gets the platform-specific command to open a URL in the default browser
 * @returns Browser opener command for the current platform
 */
export declare function getBrowserOpener(): string;
export declare function isBrowserLaunchSuppressed(): boolean;
/**
 * Launches the user's default browser to open the provided URL using a platform-appropriate command.
 *
 * This is a best-effort, fire-and-forget launcher: it attempts a platform-specific spawn and ignores
 * child-process errors. On Windows it uses PowerShell `Start-Process` with PowerShell meta-character
 * escaping to reduce shell/filesystem quirks. Callers must redact any sensitive tokens (for example,
 * OAuth codes) from `url` before calling. Invocations are not atomic—concurrent calls may race but are
 * safe to perform.
 *
 * @param url - The URL to open; redact sensitive tokens (e.g., OAuth codes) before passing.
 * @returns `true` if a browser launch was attempted, `false` if no suitable opener was available or an exception occurred.
 */
export declare function openBrowserUrl(url: string): boolean;
/**
 * Copy text into the system clipboard using a best-effort, platform-specific command.
 *
 * On Windows the text is escaped for PowerShell to avoid interpretation of special characters.
 * This function makes no guarantees of atomicity across processes; concurrent invocations may interleave.
 * Clipboard contents are not redacted or logged — callers must mask or remove sensitive tokens before calling.
 *
 * @param text - The text to copy; falsy or empty values produce no action
 * @returns `true` if a clipboard command was launched, `false` otherwise
 */
export declare function copyTextToClipboard(text: string): boolean;
//# sourceMappingURL=browser.d.ts.map