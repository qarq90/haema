import React from "react";

type InputProps = {
    label?: string;
    error?: string;
    hint?: string;
    className?: string;
    containerClassName?: string;
    variant?: "default" | "filled" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export const Input = ({
    label,
    error,
    hint,
    className = "",
    containerClassName = "",
    variant = "default",
    size = "md",
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    id,
    ...props
}: InputProps) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const base =
        "w-full rounded-lg font-medium transition-colors duration-200 focus-visible:ring-theme/50 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-foreground/50";

    const variants = {
        default: "bg-hover text-foreground",
        filled: "bg-neutral-100 text-neutral-900 border border-transparent hover:bg-neutral-200/70 focus:bg-neutral-100 focus:border-theme",
        ghost: "bg-transparent text-neutral-900 border border-transparent hover:bg-neutral-100 focus:bg-neutral-100",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-5 py-3.5 text-lg",
    };

    const errorStyles = error
        ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500/50"
        : "";

    const iconPadding = {
        sm: { left: "pl-8", right: "pr-8" },
        md: { left: "pl-10", right: "pr-10" },
        lg: { left: "pl-12", right: "pr-12" },
    };

    return (
        <div
            className={`
                flex flex-col gap-1.5
                ${fullWidth ? "w-full" : ""}
                ${containerClassName}
            `}
        >
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-neutral-700"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={inputId}
                    disabled={disabled}
                    className={`
                        ${base}
                        ${variants[variant]}
                        ${sizes[size]}
                        ${leftIcon ? iconPadding[size].left : ""}
                        ${rightIcon ? iconPadding[size].right : ""}
                        ${errorStyles}
                        ${className}
                    `}
                    {...props}
                />

                {rightIcon && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error ? (
                <span className="text-xs font-medium text-red-500">
                    {error}
                </span>
            ) : hint ? (
                <span className="text-xs text-neutral-500">{hint}</span>
            ) : null}
        </div>
    );
};
