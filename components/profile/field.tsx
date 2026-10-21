export function Field({
    label,
    editing,
    value,
    children,
}: {
    label: string;
    editing: boolean;
    value?: string | null;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2 rounded-sm border border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <span className="text-xs uppercase tracking-wide text-neutral-500">
                {label}
            </span>
            {editing ? (
                children
            ) : (
                <span className="whitespace-pre-wrap text-sm font-medium">
                    {value || "—"}
                </span>
            )}
        </div>
    );
}
