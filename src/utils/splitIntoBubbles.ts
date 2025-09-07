export function splitIntoBubbles(paragraph: string): string[] {
    const parts = paragraph
        .replace(/\n+/g, ' ')
        .split(/(?<=[.!?])\s+(?=[A-Z0-9"'([{])/)
        .map(p => p.trim())
        .filter(Boolean);
    return parts.length ? parts : [paragraph.trim()];
}
