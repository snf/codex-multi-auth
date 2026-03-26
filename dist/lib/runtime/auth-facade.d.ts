import type { ModelFamily } from "../prompts/codex.js";
import type { OAuthAuthDetails, TokenResult } from "../types.js";
import type { TokenSuccessWithAccount } from "./account-pool.js";
export declare function runRuntimeOAuthFlow(forceNewLogin: boolean, deps: {
    runBrowserOAuthFlow: (input: {
        forceNewLogin: boolean;
        manualModeLabel: string;
        logInfo: (message: string) => void;
        logDebug: (message: string) => void;
        logWarn: (message: string) => void;
    }) => Promise<TokenResult>;
    manualModeLabel: string;
    logInfo: (message: string) => void;
    logDebug: (message: string) => void;
    logWarn: (message: string) => void;
    pluginName: string;
}): Promise<TokenResult>;
export declare function createPersistAccounts(deps: {
    persistAccountPoolResults: (params: {
        results: TokenSuccessWithAccount[];
        replaceAll?: boolean;
        modelFamilies: readonly ModelFamily[];
        withAccountStorageTransaction: <T>(handler: (loadedStorage: import("../storage.js").AccountStorageV3 | null, persist: (storage: import("../storage.js").AccountStorageV3) => Promise<void>) => Promise<T>) => Promise<T>;
        findMatchingAccountIndex: typeof import("../storage.js").findMatchingAccountIndex;
        extractAccountId: (accessToken: string) => string | undefined;
        extractAccountEmail: (accessToken: string, idToken?: string) => string | undefined;
        sanitizeEmail: (email: string | undefined) => string | undefined;
    }) => Promise<void>;
    modelFamilies: readonly ModelFamily[];
    withAccountStorageTransaction: <T>(handler: (loadedStorage: import("../storage.js").AccountStorageV3 | null, persist: (storage: import("../storage.js").AccountStorageV3) => Promise<void>) => Promise<T>) => Promise<T>;
    findMatchingAccountIndex: typeof import("../storage.js").findMatchingAccountIndex;
    extractAccountId: (accessToken: string) => string | undefined;
    extractAccountEmail: (accessToken: string, idToken?: string) => string | undefined;
    sanitizeEmail: (email: string | undefined) => string | undefined;
}): (results: TokenSuccessWithAccount[], replaceAll?: boolean) => Promise<void>;
export declare function createAccountManagerReloader<TAccountManager>(deps: {
    reloadRuntimeAccountManager: (input: {
        currentReloadInFlight: Promise<TAccountManager> | null;
        loadFromDisk: (fallback?: OAuthAuthDetails) => Promise<TAccountManager>;
        setCachedAccountManager: (value: TAccountManager) => void;
        setAccountManagerPromise: (value: Promise<TAccountManager> | null) => void;
        setReloadInFlight: (value: Promise<TAccountManager> | null) => void;
        authFallback?: OAuthAuthDetails;
    }) => Promise<TAccountManager>;
    getReloadInFlight: () => Promise<TAccountManager> | null;
    loadFromDisk: (fallback?: OAuthAuthDetails) => Promise<TAccountManager>;
    setCachedAccountManager: (value: TAccountManager) => void;
    setAccountManagerPromise: (value: Promise<TAccountManager> | null) => void;
    setReloadInFlight: (value: Promise<TAccountManager> | null) => void;
}): (authFallback?: OAuthAuthDetails) => Promise<TAccountManager>;
//# sourceMappingURL=auth-facade.d.ts.map