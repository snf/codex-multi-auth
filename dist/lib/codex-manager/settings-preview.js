import { stdout as output } from "node:process";
import { ANSI } from "../ui/ansi.js";
export const DEFAULT_STATUSLINE_FIELDS = [
    "last-used",
    "limits",
    "status",
];
const PREVIEW_ACCOUNT_EMAIL = "demo@example.com";
const PREVIEW_LAST_USED = "today";
const PREVIEW_STATUS = "active";
const PREVIEW_LIMITS = "5h ██████▒▒▒▒ 62% | 7d █████▒▒▒▒▒ 49%";
const PREVIEW_LIMIT_COOLDOWNS = "5h reset 1h 20m | 7d reset 2d 04h";
export function highlightPreviewToken(text, ui) {
    if (!output.isTTY)
        return text;
    if (ui.v2Enabled) {
        return `${ui.theme.colors.accent}${ANSI.bold}${text}${ui.theme.colors.reset}`;
    }
    return `${ANSI.cyan}${ANSI.bold}${text}${ANSI.reset}`;
}
function isLastUsedPreviewFocus(focus) {
    return focus === "menuShowLastUsed" || focus === "last-used";
}
function isLimitsPreviewFocus(focus) {
    return focus === "menuShowQuotaSummary" || focus === "limits";
}
function isLimitsCooldownPreviewFocus(focus) {
    return focus === "menuShowQuotaCooldown";
}
function isStatusPreviewFocus(focus) {
    return focus === "menuShowStatusBadge" || focus === "status";
}
function isCurrentBadgePreviewFocus(focus) {
    return focus === "menuShowCurrentBadge";
}
function isCurrentRowPreviewFocus(focus) {
    return focus === "menuHighlightCurrentRow";
}
function isExpandedRowsPreviewFocus(focus) {
    return (focus === "menuShowDetailsForUnselectedRows" || focus === "menuLayoutMode");
}
export function normalizeStatuslineFields(fields) {
    const source = fields ?? DEFAULT_STATUSLINE_FIELDS;
    const seen = new Set();
    const normalized = [];
    for (const field of source) {
        if (seen.has(field))
            continue;
        seen.add(field);
        normalized.push(field);
    }
    if (normalized.length === 0) {
        return [...DEFAULT_STATUSLINE_FIELDS];
    }
    return normalized;
}
export function buildSummaryPreviewText(settings, ui, resolveMenuLayoutMode, focus = null) {
    const partsByField = new Map();
    if (settings.menuShowLastUsed !== false) {
        const part = `last used: ${PREVIEW_LAST_USED}`;
        partsByField.set("last-used", isLastUsedPreviewFocus(focus) ? highlightPreviewToken(part, ui) : part);
    }
    if (settings.menuShowQuotaSummary !== false) {
        const limitsText = settings.menuShowQuotaCooldown === false
            ? PREVIEW_LIMITS
            : `${PREVIEW_LIMITS} | ${PREVIEW_LIMIT_COOLDOWNS}`;
        const part = `limits: ${limitsText}`;
        partsByField.set("limits", isLimitsPreviewFocus(focus) || isLimitsCooldownPreviewFocus(focus)
            ? highlightPreviewToken(part, ui)
            : part);
    }
    if (settings.menuShowStatusBadge === false) {
        const part = `status: ${PREVIEW_STATUS}`;
        partsByField.set("status", isStatusPreviewFocus(focus) ? highlightPreviewToken(part, ui) : part);
    }
    const orderedParts = normalizeStatuslineFields(settings.menuStatuslineFields)
        .map((field) => partsByField.get(field))
        .filter((part) => typeof part === "string" && part.length > 0);
    if (orderedParts.length > 0) {
        return orderedParts.join(" | ");
    }
    const showsStatusField = normalizeStatuslineFields(settings.menuStatuslineFields).includes("status");
    if (showsStatusField && settings.menuShowStatusBadge !== false) {
        const note = "status text appears only when status badges are hidden";
        return isStatusPreviewFocus(focus) ? highlightPreviewToken(note, ui) : note;
    }
    return "no summary text is visible with current account-list settings";
}
export function buildAccountListPreview(settings, ui, resolveMenuLayoutMode, focus = null) {
    const badges = [];
    if (settings.menuShowCurrentBadge !== false) {
        const currentBadge = "[current]";
        badges.push(isCurrentBadgePreviewFocus(focus)
            ? highlightPreviewToken(currentBadge, ui)
            : currentBadge);
    }
    if (settings.menuShowStatusBadge !== false) {
        const statusBadge = "[active]";
        badges.push(isStatusPreviewFocus(focus)
            ? highlightPreviewToken(statusBadge, ui)
            : statusBadge);
    }
    const badgeSuffix = badges.length > 0 ? ` ${badges.join(" ")}` : "";
    const accountEmail = isCurrentRowPreviewFocus(focus)
        ? highlightPreviewToken(PREVIEW_ACCOUNT_EMAIL, ui)
        : PREVIEW_ACCOUNT_EMAIL;
    const rowDetailMode = resolveMenuLayoutMode(settings) === "expanded-rows"
        ? "details shown on all rows"
        : "details shown on selected row only";
    const detailModeText = isExpandedRowsPreviewFocus(focus)
        ? highlightPreviewToken(rowDetailMode, ui)
        : rowDetailMode;
    return {
        label: `1. ${accountEmail}${badgeSuffix}`,
        hint: `${buildSummaryPreviewText(settings, ui, resolveMenuLayoutMode, focus)}\n${detailModeText}`,
    };
}
//# sourceMappingURL=settings-preview.js.map