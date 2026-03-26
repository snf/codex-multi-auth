export function reorderStatuslineField(fields, key, direction) {
    const index = fields.indexOf(key);
    if (index < 0)
        return fields;
    const target = index + direction;
    if (target < 0 || target >= fields.length)
        return fields;
    const next = [...fields];
    const current = next[index];
    const swap = next[target];
    if (!current || !swap)
        return fields;
    next[index] = swap;
    next[target] = current;
    return next;
}
//# sourceMappingURL=statusline-order.js.map