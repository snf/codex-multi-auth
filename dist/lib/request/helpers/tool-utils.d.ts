import type { RequestToolDefinition } from "../../types.js";
/**
 * Cleans up tool definitions to ensure strict JSON Schema compliance.
 *
 * Implements "require" logic and advanced normalization:
 * 1. Filters 'required' array to remove properties that don't exist in 'properties'.
 * 2. Injects a placeholder property for empty parameter objects.
 * 3. Flattens 'anyOf' with 'const' values into 'enum'.
 * 4. Normalizes nullable types (array types) to single type + description.
 * 5. Removes unsupported keywords (additionalProperties, const, etc.).
 *
 * @param tools - Array of tool definitions
 * @returns Cleaned array of tool definitions
 */
export declare function cleanupToolDefinitions(tools: RequestToolDefinition[] | undefined): RequestToolDefinition[] | undefined;
//# sourceMappingURL=tool-utils.d.ts.map