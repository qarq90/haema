export function Row({
    icon,
    children,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
            <span className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                {icon}
            </span>
            <span>{children}</span>
        </div>
    );
}
