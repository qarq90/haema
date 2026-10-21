import { useState } from "react";
import { LuChevronDown, LuCheck } from "react-icons/lu";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";

export function DropdownSelect({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 text-left text-sm font-medium outline-none">
                <span className={value ? "" : "text-neutral-400"}>
                    {value || placeholder || "Select…"}
                </span>
                <LuChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="max-h-64 overflow-y-auto"
            >
                {options.map((option) => {
                    const selected = option === value;
                    return (
                        <DropdownMenuItem
                            key={option}
                            onClick={(e) => {
                                e.preventDefault();
                                onChange(option);
                                setOpen(false);
                            }}
                            className={`flex items-center justify-between gap-2 ${
                                selected
                                    ? "font-semibold bg-theme text-white"
                                    : ""
                            }`}
                        >
                            <span className="truncate">{option}</span>
                            {selected && (
                                <LuCheck className="h-4 w-4 shrink-0" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
