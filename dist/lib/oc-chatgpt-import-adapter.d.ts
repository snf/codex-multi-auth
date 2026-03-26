import { type AccountStorageV3 } from "./storage.js";
type MatchStrategy = "accountId" | "email" | "refreshToken";
export type OcChatgptImportPayload = AccountStorageV3;
export type OcChatgptPreviewPayload = {
    version: 3;
    activeIndex: number;
    activeIndexByFamily?: AccountStorageV3["activeIndexByFamily"];
    accounts: OcChatgptAccountRef[];
};
export type OcChatgptAccountRef = {
    accountId?: string;
    email?: string;
    refreshTokenLast4: string;
};
export type OcChatgptMergePreview = {
    payload: OcChatgptPreviewPayload;
    merged: AccountStorageV3;
    toAdd: OcChatgptAccountRef[];
    toUpdate: Array<{
        previous: OcChatgptAccountRef;
        next: OcChatgptAccountRef;
        matchedBy: MatchStrategy;
    }>;
    toSkip: Array<{
        source: OcChatgptAccountRef;
        reason: string;
    }>;
    unchangedDestinationOnly: OcChatgptAccountRef[];
    activeSelectionBehavior: "preserve-destination";
};
/**
 * Produce a normalized AccountStorageV3 payload suitable for OC ChatGPT import.
 *
 * Normalizes and sanitizes the provided source storage for the target importer.
 *
 * @param source - The source AccountStorageV3 to normalize, or `null` to normalize an empty input.
 * @returns A normalized AccountStorageV3 ready for import. WARNING: this object may include raw `refreshToken` values; redact or mask tokens before logging, persisting to logs, or transmitting to external systems.
 *
 * Concurrency notes: the function does not perform synchronization; callers are responsible for coordinating concurrent access to the source data.
 *
 * Filesystem note: the function performs in-memory transformations only and has no special behavior for Windows filesystem semantics.
 */
export declare function buildOcChatgptImportPayload(source: AccountStorageV3 | null): OcChatgptImportPayload;
/**
 * Produces a detailed merge preview and merged storage that reconciles a source and destination AccountStorageV3.
 *
 * Normalizes source and destination inputs, identifies accounts to add, update, or skip (with reasons), preserves
 * destination-only unchanged accounts, and returns a merged AccountStorageV3 plus a preview payload. Refresh tokens
 * in preview entries are redacted (masked to last four characters). The function is synchronous, stateless, performs
 * no filesystem I/O (no Windows-specific behavior), and is safe to call concurrently from multiple callers.
 *
 * @param options.source - Source storage to import from; may be `null`.
 * @param options.destination - Destination storage to merge into; may be `null`.
 * @returns An OcChatgptMergePreview describing the normalized source preview (`payload`), the resulting merged storage
 *          (`merged`), lists of accounts to add (`toAdd`), accounts updated with previous/next summaries (`toUpdate`),
 *          skipped accounts with reasons (`toSkip`), destination-only unchanged accounts (`unchangedDestinationOnly`),
 *          and an `activeSelectionBehavior` hint.
 */
export declare function previewOcChatgptImportMerge(options: {
    source: AccountStorageV3 | null;
    destination: AccountStorageV3 | null;
}): OcChatgptMergePreview;
export {};
//# sourceMappingURL=oc-chatgpt-import-adapter.d.ts.map