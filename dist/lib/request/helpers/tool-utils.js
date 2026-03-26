import { isRecord } from "../../utils.js";
function cloneRecord(value) {
    return JSON.parse(JSON.stringify(value));
}
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
export function cleanupToolDefinitions(tools) {
    if (!Array.isArray(tools))
        return undefined;
    return tools.map((tool) => cleanupToolDefinition(tool));
}
function cleanupToolDefinition(tool) {
    if (!isRecord(tool)) {
        return tool;
    }
    if (tool.type === "function") {
        return cleanupFunctionTool(tool);
    }
    if (tool.type === "namespace" && Array.isArray(tool.tools)) {
        return {
            ...tool,
            tools: tool.tools.map((nestedTool) => cleanupToolDefinition(nestedTool)),
        };
    }
    return tool;
}
function cleanupFunctionTool(tool) {
    const functionDef = tool.function;
    if (!isRecord(functionDef)) {
        return tool;
    }
    const parameters = functionDef.parameters;
    if (!isRecord(parameters)) {
        return tool;
    }
    // Clone only the schema tree we mutate to avoid heavy deep cloning of entire tools.
    let cleanedParameters;
    try {
        cleanedParameters = cloneRecord(parameters);
    }
    catch {
        return tool;
    }
    cleanupSchema(cleanedParameters);
    return {
        ...tool,
        function: {
            ...functionDef,
            parameters: cleanedParameters,
        },
    };
}
/**
 * Recursively cleans up a JSON schema object
 */
function cleanupSchema(schema) {
    if (!schema || typeof schema !== "object")
        return;
    if (schema.properties && typeof schema.properties === "object") {
        const properties = schema.properties;
        for (const key of Object.keys(properties)) {
            if (properties[key] === undefined) {
                delete properties[key];
            }
        }
    }
    // 1. Flatten Unions (anyOf -> enum)
    if (Array.isArray(schema.anyOf)) {
        const anyOf = schema.anyOf;
        const allConst = anyOf.every((opt) => "const" in opt);
        if (allConst && anyOf.length > 0) {
            const enumValues = anyOf.map((opt) => opt.const);
            schema.enum = enumValues;
            delete schema.anyOf;
            // Infer type from first value if missing
            if (!schema.type) {
                const firstVal = enumValues[0];
                if (typeof firstVal === "string")
                    schema.type = "string";
                else if (typeof firstVal === "number")
                    schema.type = "number";
                else if (typeof firstVal === "boolean")
                    schema.type = "boolean";
            }
        }
    }
    // 2. Flatten Nullable Types (["string", "null"] -> "string")
    if (Array.isArray(schema.type)) {
        const types = schema.type;
        const isNullable = types.includes("null");
        const nonNullTypes = types.filter((t) => t !== "null");
        if (nonNullTypes.length > 0) {
            // Use the first non-null type (most strict models expect a single string type)
            schema.type = nonNullTypes[0];
            if (isNullable) {
                const desc = schema.description || "";
                // Only append if not already present
                if (!desc.toLowerCase().includes("nullable")) {
                    schema.description = desc ? `${desc} (nullable)` : "(nullable)";
                }
            }
        }
    }
    // 3. Filter 'required' array
    if (Array.isArray(schema.required) &&
        schema.properties &&
        typeof schema.properties === "object") {
        const properties = schema.properties;
        const required = schema.required;
        const validRequired = required.filter((key) => Object.prototype.hasOwnProperty.call(properties, key));
        if (validRequired.length === 0) {
            delete schema.required;
        }
        else if (validRequired.length !== required.length) {
            schema.required = validRequired;
        }
    }
    // 4. Handle empty object parameters
    if (schema.type === "object" &&
        (!schema.properties || Object.keys(schema.properties).length === 0)) {
        schema.properties = {
            _placeholder: {
                type: "boolean",
                description: "This property is a placeholder and should be ignored.",
            },
        };
    }
    // 5. Remove unsupported keywords
    delete schema.additionalProperties;
    delete schema.const;
    delete schema.title;
    delete schema.$schema;
    // 6. Recurse into properties
    if (schema.properties && typeof schema.properties === "object") {
        const props = schema.properties;
        for (const key in props) {
            const prop = props[key];
            // istanbul ignore next -- JSON.stringify at line 39 strips undefined values
            if (prop !== undefined) {
                cleanupSchema(prop);
            }
        }
    }
    // 7. Recurse into array items
    if (schema.items && typeof schema.items === "object") {
        cleanupSchema(schema.items);
    }
}
//# sourceMappingURL=tool-utils.js.map