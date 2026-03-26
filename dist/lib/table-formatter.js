/**
 * Simple ASCII table formatter for CLI tools.
 * Generates consistent, aligned table output.
 */
/**
 * Format a value to fit within a column width.
 */
function formatCell(value, width, align = "left") {
    const truncated = value.length > width ? value.slice(0, width - 1) + "…" : value;
    return align === "right" ? truncated.padStart(width) : truncated.padEnd(width);
}
/**
 * Build a table header row and separator line.
 */
export function buildTableHeader(options) {
    const { columns, separatorChar = "-" } = options;
    const headerRow = columns.map((col) => formatCell(col.header, col.width, col.align)).join(" ");
    const separatorRow = columns.map((col) => separatorChar.repeat(col.width)).join(" ");
    return [headerRow, separatorRow];
}
/**
 * Build a single table row from values.
 * Values are matched to columns by index.
 */
export function buildTableRow(values, options) {
    const { columns } = options;
    return columns
        .map((col, i) => {
        const value = values[i] ?? "";
        return formatCell(value, col.width, col.align);
    })
        .join(" ");
}
/**
 * Build a complete table with header, separator, and rows.
 */
export function buildTable(rows, options) {
    const lines = buildTableHeader(options);
    for (const row of rows) {
        lines.push(buildTableRow(row, options));
    }
    return lines;
}
//# sourceMappingURL=table-formatter.js.map