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
        "w-full border-b bg-transparent outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-foreground/25";

    const variants = {
        default: "border-foreground/15 focus:border-red-500",
        filled: "border-foreground/15 bg-foreground/5 focus:border-red-500",
        ghost: "border-transparent focus:border-red-500",
    };

    const sizes = {
        sm: "px-0 py-3 text-sm",
        md: "px-0 py-4 text-base",
        lg: "px-0 py-5 text-lg",
    };

    const errorStyles = error ? "border-red-500 focus:border-red-500" : "";

    const iconPadding = {
        sm: { left: "pl-7", right: "pr-7" },
        md: { left: "pl-8", right: "pr-8" },
        lg: { left: "pl-10", right: "pr-10" },
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
                    <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-foreground/40">
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
                    <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40">
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
