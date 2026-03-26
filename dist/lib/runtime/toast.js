export async function showRuntimeToast(client, message, variant = "success", options) {
    try {
        await client.tui?.showToast?.({
            body: {
                message,
                variant,
                ...(options?.title && { title: options.title }),
                ...(options?.duration !== undefined ? { duration: options.duration } : {}),
            },
        });
    }
    catch {
        // Ignore when TUI is not available.
    }
}
//# sourceMappingURL=toast.js.map