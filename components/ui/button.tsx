import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
    as?: React.ElementType;
    title?: string;
    "aria-label"?: string;
};

export const Button = ({
    children,
    className = "",
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    fullWidth = false,
    as,
    title,
    "aria-label": ariaLabel,
    ...props
}: ButtonProps) => {
    const base =
        "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 hover:scale-95 focus-visible:ring-theme/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "text-white bg-theme hover:bg-theme hover:text-white active:bg-theme/50",
        secondary:
            "bg-transparent text-theme border border-theme/30 hover:bg-theme/5 active:bg-theme/10",
        ghost:
            "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
        danger:
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-7 py-3.5 text-lg",
    };

    const defaultTag: Record<string, React.ElementType> = {
        primary: "button",
        secondary: "button",
        ghost: "button",
        danger: "button",
    };

    const Component = as || defaultTag[variant] || "button";
    const isButton = Component === "button";

    return (
        <Component
            type={isButton ? type : undefined}
            disabled={isButton ? disabled : undefined}
            aria-disabled={disabled || undefined}
            onClick={onClick}
            title={title}
            aria-label={ariaLabel}
            className={`
                ${base}
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? "w-full" : ""}
                ${className}
                cursor-pointer
            `}
            {...props}
        >
            {children}
        </Component>
    );
};