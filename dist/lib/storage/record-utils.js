export function isRecord(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
}
export function clampIndex(index, length) {
    if (length <= 0)
        return 0;
    return Math.max(0, Math.min(index, length - 1));
}
//# sourceMappingURL=record-utils.js.map