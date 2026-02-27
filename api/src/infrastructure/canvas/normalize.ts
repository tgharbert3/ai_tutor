export function normalizeCanvasUrl(rawUrl: string) {
    const trimmed = rawUrl.trim();

    const withProtocol = trimmed.startsWith("http")
        ? trimmed
        : `https://${trimmed}`;

    const parsed = new URL(withProtocol);

    // Force https
    if (parsed.protocol !== "https:") {
        throw new Error("Canvas URL must use HTTPS");
    }

    // Lowercase hostname for canonical identity
    const hostname = parsed.hostname.toLowerCase();

    return `https://${hostname}`;
};