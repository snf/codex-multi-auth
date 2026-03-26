import type { UiRuntimeOptions } from "../ui/runtime.js";
import type { MenuItem } from "../ui/select.js";
import type { SettingsHubMenuAction } from "./settings-hub-menu.js";
export declare function promptSettingsHubMenu(initialFocus: SettingsHubMenuAction["type"], deps: {
    isInteractive: () => boolean;
    getUiRuntimeOptions: () => UiRuntimeOptions;
    buildItems: () => MenuItem<SettingsHubMenuAction>[];
    findInitialCursor: (items: MenuItem<SettingsHubMenuAction>[], initialFocus: SettingsHubMenuAction["type"]) => number | undefined;
    select: <T>(items: MenuItem<T>[], options: {
        message: string;
        subtitle: string;
        help: string;
        clearScreen: boolean;
        theme: UiRuntimeOptions["theme"];
        selectedEmphasis: "minimal";
        initialCursor?: number;
        onInput: (raw: string) => T | undefined;
    }) => Promise<T | null>;
    copy: {
        title: string;
        subtitle: string;
        help: string;
    };
}): Promise<SettingsHubMenuAction | null>;
//# sourceMappingURL=settings-hub-prompt.d.ts.map