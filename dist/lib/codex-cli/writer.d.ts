interface ActiveSelection {
    accountId?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    idToken?: string;
}
export declare function setCodexCliActiveSelection(selection: ActiveSelection): Promise<boolean>;
export declare function getLastCodexCliSelectionWriteTimestamp(): number;
export {};
//# sourceMappingURL=writer.d.ts.map