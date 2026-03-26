import type { MenuItem } from "../ui/select.js";
export type SettingsHubMenuAction = {
    type: "account-list";
} | {
    type: "summary-fields";
} | {
    type: "behavior";
} | {
    type: "theme";
} | {
    type: "experimental";
} | {
    type: "backend";
} | {
    type: "back";
};
export declare function buildSettingsHubItems(copy: {
    sectionTitle: string;
    accountList: string;
    summaryFields: string;
    behavior: string;
    theme: string;
    advancedTitle: string;
    experimental: string;
    backend: string;
    exitTitle: string;
    back: string;
}): MenuItem<SettingsHubMenuAction>[];
export declare function findSettingsHubInitialCursor(items: MenuItem<SettingsHubMenuAction>[], initialFocus: SettingsHubMenuAction["type"]): number | undefined;
//# sourceMappingURL=settings-hub-menu.d.ts.map