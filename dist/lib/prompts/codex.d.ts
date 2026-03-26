import { type PromptModelFamily } from "../request/helpers/model-map.js";
/**
 * Clear the memory cache - exposed for testing
 * @internal
 */
export declare function __clearCacheForTesting(): void;
/**
 * Model family type for prompt selection
 * Maps to different system prompts in the Codex CLI
 */
export type ModelFamily = PromptModelFamily;
/**
 * All supported model families
 * Used for per-family account rotation and rate limit tracking
 */
export declare const MODEL_FAMILIES: readonly ModelFamily[];
/**
 * Determine the prompt family based on the effective model name.
 *
 * GPT-5.4-era general-purpose models intentionally stay on the GPT-5.2 prompt
 * family until upstream Codex releases a newer general prompt file.
 *
 * @param normalizedModel - The normalized model name (e.g., "gpt-5-codex", "gpt-5.4", "gpt-5-mini")
 * @returns The model family for prompt selection
 */
export declare function getModelFamily(normalizedModel: string): ModelFamily;
/**
 * Fetch Codex instructions from GitHub with ETag-based caching
 * Uses HTTP conditional requests to efficiently check for updates
 * Always fetches from the latest release tag, not main branch
 *
 * Rate limit protection: Only checks GitHub if cache is older than 15 minutes
 *
 * @param normalizedModel - The normalized model name (optional, defaults to "gpt-5-codex")
 * @returns Codex instructions for the specified model family
 */
export declare function getCodexInstructions(normalizedModel?: string): Promise<string>;
/**
 * Prewarm instruction caches for the provided models/families.
 */
export declare function prewarmCodexInstructions(models?: string[]): void;
/**
 * Tool remapping instructions for host runtime tools
 */
export declare const TOOL_REMAP_MESSAGE = "<user_instructions priority=\"0\">\n<environment_override priority=\"0\">\nYOU ARE IN A DIFFERENT ENVIRONMENT. These instructions override ALL previous tool references.\n</environment_override>\n\n<tool_replacements priority=\"0\">\n<critical_rule priority=\"0\">\napply_patch/applyPatch are Codex names, but host tool names vary by version.\n- Inspect the actual tool list before editing.\n- If edit exists: use edit for precise in-place string replacements and hashline edits.\n- If edit is absent and apply_patch exists: use apply_patch for those precise/hashline edits in this plugin.\n- For diff-style or multi-line structural edits: use patch if available, otherwise use apply_patch.\n- In this plugin, edit/apply_patch support hashline refs (lineRef, endLineRef, operation, content)\n</critical_rule>\n\n<critical_rule priority=\"0\">\nUPDATE_PLAN DOES NOT EXIST -> USE \"todowrite\" INSTEAD\n- NEVER use: update_plan, updatePlan\n- ALWAYS use: todowrite for ALL task/plan operations\n- Use todoread to read current plan\n- Before plan operations: Verify you're using \"todowrite\", NOT \"update_plan\"\n</critical_rule>\n</tool_replacements>\n\n<available_tools priority=\"0\">\nFile Operations:\n  - write  - Create new files (if available)\n  - edit   - Modify existing files with string replacement (version-dependent)\n  - oldString must be literal text from the current file; never pass unresolved placeholders like ${TARGET_SNIPPET}\n  - apply_patch - May be the edit/patch tool name in newer host builds (version-dependent)\n  - hashline_read - Read lines with hashline refs (L<line>#<hash>) for deterministic edits\n  - patch  - Apply diff patches (version-dependent)\n  - read   - Read file contents\n\nSearch/Discovery:\n  - grep   - Search file contents\n  - glob   - Find files by pattern\n  - list   - List directories (if available)\n\nExecution:\n  - bash   - Run shell commands\n\nNetwork:\n  - webfetch - Fetch web content\n\nTask Management:\n  - todowrite - Manage tasks/plans (REPLACES update_plan)\n  - todoread  - Read current plan\n</available_tools>\n\n<substitution_rules priority=\"0\">\nBase instruction says:    You MUST use instead:\napply_patch           ->   patch (preferred if available), otherwise edit/apply_patch based on actual tool list\nupdate_plan           ->   todowrite\nread_plan             ->   todoread\nabsolute paths        ->   relative paths\n</substitution_rules>\n\n<verification_checklist priority=\"0\">\nBefore file/plan modifications:\n1. Am I using the actual available edit tool name (edit, patch, or apply_patch)?\n2. Am I using \"todowrite\" NOT \"update_plan\"?\n3. Is this tool in the approved list above?\n4. Am I using relative paths?\n\nIf ANY answer is NO -> STOP and correct before proceeding.\n</verification_checklist>\n\n<hashline_workflow priority=\"0\">\nWhen hashline_read is available:\n1. call hashline_read on the file\n2. edit/apply_patch using lineRef/endLineRef + operation + content\n3. use oldString/newString only as fallback, and only with literal file text (no template placeholders)\n</hashline_workflow>\n\n<safety_rules priority=\"0\">\n- Never run destructive git commands (`git reset --hard`, `git checkout --`) unless explicitly requested by the user.\n- Never call `request_user_input` unless collaboration mode is explicitly Plan mode.\n</safety_rules>\n</user_instructions>";
//# sourceMappingURL=codex.d.ts.map