export declare function showRuntimeToast(client: {
    tui?: {
        showToast?: (payload: {
            body: {
                message: string;
                variant: "info" | "success" | "warning" | "error";
                title?: string;
                duration?: number;
            };
        }) => Promise<void>;
    };
}, message: string, variant?: "info" | "success" | "warning" | "error", options?: {
    title?: string;
    duration?: number;
}): Promise<void>;
//# sourceMappingURL=toast.d.ts.map