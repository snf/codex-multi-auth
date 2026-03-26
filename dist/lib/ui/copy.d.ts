export declare const UI_COPY: {
    readonly mainMenu: {
        readonly title: "Accounts Dashboard";
        readonly searchSubtitlePrefix: "Search:";
        readonly quickStart: "Quick Actions";
        readonly addAccount: "Add New Account";
        readonly checkAccounts: "Run Health Check";
        readonly bestAccount: "Pick Best Account";
        readonly fixIssues: "Auto-Repair Issues";
        readonly settings: "Settings";
        readonly moreChecks: "Advanced Checks";
        readonly refreshChecks: "Refresh All Accounts";
        readonly checkFlagged: "Check Problem Accounts";
        readonly accounts: "Saved Accounts";
        readonly loadingLimits: "Fetching account limits...";
        readonly noSearchMatches: "No accounts match your search";
        readonly dangerZone: "Danger Zone";
        readonly removeAllAccounts: "Delete All Accounts";
        readonly helpCompact: "↑↓ Move | Enter Select | / Search | 1-9 Switch | Q Back";
        readonly helpDetailed: "Arrow keys move, Enter selects, / searches, 1-9 switches account, Q goes back";
    };
    readonly accountDetails: {
        readonly back: "Back";
        readonly enable: "Enable Account";
        readonly disable: "Disable Account";
        readonly setCurrent: "Set As Current";
        readonly refresh: "Re-Login";
        readonly remove: "Delete Account";
        readonly help: "↑↓ Move | Enter Select | S Use | R Sign In | D Delete | Q Back";
    };
    readonly oauth: {
        readonly chooseModeTitle: "Get Started";
        readonly chooseModeSubtitle: "Choose how you want to continue.";
        readonly signInHeading: "Sign in";
        readonly restoreHeading: "Recover saved accounts";
        readonly openBrowser: "Open Browser (Easy)";
        readonly manualMode: "Manual / Incognito";
        readonly restoreSavedBackup: "Restore Saved Backup";
        readonly loadLastBackup: "Load Last Saved Backup (Recommended)";
        readonly chooseBackupManually: "Choose Backup Manually";
        readonly back: "Back";
        readonly chooseModeHelp: "↑↓ Move | Enter Select | 1 Easy | 2 Manual | Q Back";
        readonly chooseModeHelpWithBackup: "↑↓ Move | Enter Select | 1 Easy | 2 Manual | 3 Backup | Q Back";
        readonly restoreBackupTitle: "Restore Saved Backup";
        readonly restoreBackupSubtitle: "Choose how you want to recover saved accounts.";
        readonly restoreBackupLatestHint: "Fastest way to recover your saved accounts.";
        readonly restoreBackupHelp: "↑↓ Move | Enter Select | 1 Latest | 2 Manual | Q Back";
        readonly manualBackupTitle: "Choose Backup";
        readonly manualBackupSubtitle: "Pick a saved backup to restore.";
        readonly manualBackupHelp: "↑↓ Move | Enter Select | Q Back";
        readonly loadLastBackupHint: (fileName: string, accountCount: number, savedAt: string) => string;
        readonly manualBackupHint: (accountCount: number, savedAt: string) => string;
        readonly restoreBackupConfirm: (fileName: string, accountCount: number) => string;
        readonly restoreBackupLoaded: (fileName: string, accountCount: number) => string;
        readonly restoreBackupSyncWarning: "Backup loaded locally, but Codex auth sync did not complete. Multi-auth routing will still use the restored account pool.";
        readonly goTo: "Go to:";
        readonly copyOk: "Login link copied.";
        readonly copyFail: "Could not copy login link.";
        readonly pastePrompt: "Paste callback URL or code here (Q to cancel):";
        readonly browserOpened: "Browser opened.";
        readonly browserOpenFail: "Could not open browser. Use this link:";
        readonly waitingCallback: "Waiting for login callback on localhost:1455...";
        readonly callbackBypassed: "Manual mode active. Paste the callback URL manually.";
        readonly callbackUnavailable: "Callback listener unavailable. Paste the callback URL manually.";
        readonly callbackMissed: "No callback received. Paste manually.";
        readonly cancelled: "Sign-in cancelled.";
        readonly cancelledBackToMenu: "Sign-in cancelled. Going back to menu.";
    };
    readonly returnFlow: {
        readonly continuePrompt: "Press Enter to go back.";
        readonly actionFailedPrompt: "Action failed. Press Enter to go back.";
        readonly autoReturn: (seconds: number) => string;
        readonly paused: "Paused. Press any key to continue.";
        readonly working: "Running...";
        readonly done: "Done.";
        readonly failed: "Failed.";
    };
    readonly settings: {
        readonly title: "Settings";
        readonly subtitle: "Customize menu, behavior, backend, and experiments";
        readonly help: "↑↓ Move | Enter Select | Q Back";
        readonly sectionTitle: "Basic";
        readonly advancedTitle: "Advanced";
        readonly exitTitle: "Back";
        readonly accountList: "Account List View";
        readonly summaryFields: "Summary Line";
        readonly behavior: "Menu Behavior";
        readonly theme: "Color Theme";
        readonly experimental: "Experimental";
        readonly experimentalTitle: "Experimental";
        readonly experimentalSubtitle: "Preview sync and backup actions before they become stable";
        readonly experimentalHelpMenu: "Enter Select | 1 Sync | 2 Backup | 3 Guard | [ - Down | ] + Up | S Save | Q Back";
        readonly experimentalHelpPreview: "Enter Select | A Apply | Q Back";
        readonly experimentalHelpStatus: "Enter Select | Q Back";
        readonly experimentalSync: "Sync Accounts to oc-chatgpt-multi-auth";
        readonly experimentalApplySync: "Apply Sync";
        readonly experimentalBackup: "Save Pool Backup";
        readonly experimentalBackupPrompt: "Backup file name (.json): ";
        readonly experimentalRefreshGuard: "Enable Refresh Guard";
        readonly experimentalRefreshInterval: "Refresh Guard Interval";
        readonly experimentalDecreaseInterval: "Decrease Refresh Interval";
        readonly experimentalIncreaseInterval: "Increase Refresh Interval";
        readonly backend: "Backend Controls";
        readonly back: "Back";
        readonly previewHeading: "Live Preview";
        readonly displayHeading: "Options";
        readonly resetDefault: "Reset to Default";
        readonly saveAndBack: "Save and Back";
        readonly backNoSave: "Back Without Saving";
        readonly accountListTitle: "Account List View";
        readonly accountListSubtitle: "Choose row details and optional smart sorting";
        readonly accountListHelp: "Enter Toggle | Number Toggle | M Sort | L Layout | S Save | Q Back (No Save)";
        readonly summaryTitle: "Account Details Row";
        readonly summarySubtitle: "Choose and order detail fields";
        readonly summaryHelp: "Enter Toggle | 1-3 Toggle | [ ] Reorder | S Save | Q Back (No Save)";
        readonly behaviorTitle: "Return Behavior";
        readonly behaviorSubtitle: "Control how result screens return";
        readonly behaviorHelp: "Enter Select | 1-3 Delay | P Pause | B BestOnLaunch | L AutoFetch | F Status | T TTL | S Save | Q Back (No Save)";
        readonly themeTitle: "Color Theme";
        readonly themeSubtitle: "Pick base color and accent";
        readonly themeHelp: "Enter Select | 1-2 Base | S Save | Q Back (No Save)";
        readonly backendTitle: "Backend Controls";
        readonly backendSubtitle: "Tune sync, retry, and limit behavior";
        readonly backendHelp: "Enter Open | 1-4 Category | S Save | R Reset | Q Back (No Save)";
        readonly backendCategoriesHeading: "Categories";
        readonly backendCategoryTitle: "Backend Category";
        readonly backendCategoryHelp: "Enter Toggle/Adjust | +/- or [ ] Number | 1-9 Toggle | R Reset | Q Back";
        readonly backendToggleHeading: "Switches";
        readonly backendNumberHeading: "Numbers";
        readonly backendDecrease: "Decrease Focused Value";
        readonly backendIncrease: "Increase Focused Value";
        readonly backendResetCategory: "Reset Category";
        readonly backendBackToCategories: "Back to Categories";
        readonly baseTheme: "Base Color";
        readonly accentColor: "Accent Color";
        readonly actionTiming: "Auto Return Delay";
        readonly moveUp: "Move Focused Field Up";
        readonly moveDown: "Move Focused Field Down";
    };
    readonly fallback: {
        readonly addAnotherTip: "Tip: Use private mode or sign out before adding another account.";
        readonly addAnotherQuestion: (count: number) => string;
        readonly selectModePrompt: "(a) add, (c) check, (b) best, fi(x), (s) settings, (d) deep, (g) problem, (f) fresh, (q) back [a/c/b/x/s/d/g/f/q]: ";
        readonly invalidModePrompt: "Use one of: a, c, b, x, s, d, g, f, q.";
    };
};
/**
 * Builds the "Check Problem Accounts" label, appending the flagged count when greater than zero.
 *
 * This function is pure and has no side effects, is safe for concurrent use, performs no filesystem
 * access (including Windows-specific behavior), and does not perform any token redaction.
 *
 * @param flaggedCount - The number of flagged accounts to show; if greater than zero the count is appended in parentheses.
 * @returns The resulting label string: the base label when `flaggedCount` is 0 or less, otherwise the base label followed by ` (count)`.
 */
export declare function formatCheckFlaggedLabel(flaggedCount: number): string;
//# sourceMappingURL=copy.d.ts.map