export { cn } from "cn"

export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
