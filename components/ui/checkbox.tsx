"use client";

import { LuCheck } from "react-icons/lu";

export function Checkbox({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label?: string;
}) {
    return (
        <label
            className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                checked
                    ? "border-theme/40 bg-theme/40 text-foreground"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            }`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
            />

            <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                    checked
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-neutral-300 dark:border-neutral-700"
                }`}
                aria-hidden
            >
                {checked && <LuCheck className="h-3 w-3" strokeWidth={3} />}
            </span>

            {label && <span className="truncate">{label}</span>}
        </label>
    );
}
