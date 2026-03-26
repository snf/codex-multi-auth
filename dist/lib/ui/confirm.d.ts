/**
 * Prompt the user with a Yes/No choice.
 *
 * Assumes a single interactive UI context; concurrent prompts may interleave. Does not access the filesystem (no Windows-specific filesystem effects). Callers should redact sensitive tokens from `message` before passing it to this prompt.
 *
 * @param message - The prompt text shown to the user
 * @param defaultYes - If true, "Yes" is presented first and treated as the default ordering
 * @returns `true` if the user selects "Yes", `false` otherwise
 */
export declare function confirm(message: string, defaultYes?: boolean): Promise<boolean>;
//# sourceMappingURL=confirm.d.ts.map