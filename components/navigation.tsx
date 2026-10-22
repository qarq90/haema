"use client";
import { FiSun, FiMoon, FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { items } from "@/lib/sidebar";
import { useUser } from "@clerk/nextjs";

export const Navigation = () => {
    const pathname = usePathname();
    const { isLoaded, isSignedIn, user } = useUser();

    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const initial = saved ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
        applyTheme(initial);
    }, []);

    const applyTheme = (mode: "light" | "dark") => {
        const dark = mode === "dark";
        const root = document.documentElement;

        root.style.setProperty("--background", dark ? "#171717" : "#ffffff");
        root.style.setProperty("--foreground", dark ? "#ffffff" : "#171717");
        root.style.setProperty("--hover", dark ? "#323232" : "#cccccc");

        root.classList.toggle("dark", dark);
    };

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";

        const commit = () => {
            setTheme(next);
            applyTheme(next);
            localStorage.setItem("theme", next);
        };

        if (!document.startViewTransition) {
            commit();
            return;
        }

        document.startViewTransition(commit);
    };

    if (pathname.includes("/sign-in")) return;

    return (
        <nav className="fixed top-16 left-0 z-50 w-32 h-dvh flex flex-col items-center pt-8 pb-10">
            <p className="text-xl font-bold uppercase mb-10">
                H<span className="lowercase text-3xl">α</span>EM
                <span className="lowercase text-3xl">α</span>
            </p>

            <ul className="flex flex-col items-center gap-8">
                {items.map(({ label, Icon, path }) => {
                    const isActive =
                        path === "/"
                            ? pathname === "/"
                            : pathname.startsWith(path);

                    return (
                        <Link
                            href={path}
                            key={label}
                            className={`
                                    relative group px-3 pt-3 pb-2 cursor-pointer rounded-full transition-colors duration-200
                                    ${
                                        isActive
                                            ? "bg-red-600 text-white"
                                            : "hover:text-theme focus-within:text-theme text-foreground"
                                    }
                                `}
                        >
                            <span className="inline-block transition-transform duration-300 group-hover:rotate-360">
                                <Icon size={24} />
                            </span>

                            <span
                                role="tooltip"
                                className="pointer-events-none absolute text-foreground left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-hover px-3 py-1.5 text-base font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50"
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}

                <Link
                    href="/profile"
                    aria-label="Account"
                    className="relative group flex flex-col items-center gap-1.5 cursor-pointer transition-colors duration-200 hover:text-theme focus-visible:text-theme focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/50"
                >
                    <span className="grid place-items-center w-10 h-10 rounded-full overflow-hidden">
                        {isLoaded && isSignedIn && user ? (
                            <img
                                src={user.imageUrl}
                                alt={user.fullName ?? "Profile"}
                                className="w-8 h-8 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <span className="inline-block transition-transform duration-300 group-hover:scale-110 hover:rotate-360">
                                <FiUser size={24} />
                            </span>
                        )}
                    </span>

                    {isLoaded && isSignedIn && user && (
                        <span
                            role="tooltip"
                            className="pointer-events-none absolute text-foreground left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-hover px-3 py-1.5 text-base font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50"
                        >
                            {user.firstName ?? user.username ?? "Account"}
                        </span>
                    )}
                </Link>

                <li
                    className="w-full h-0.5 rounded-full bg-foreground/10 my-2"
                    aria-hidden="true"
                />

                <li
                    onClick={toggleTheme}
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle theme"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleTheme();
                        }
                    }}
                    className="relative group px-3 pt-3 pb-2 cursor-pointer rounded-full transition-colors text-foreground duration-200 hover:text-theme focus-visible:text-theme focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/50"
                >
                    <span className="inline-block transition-transform duration-300 group-hover:rotate-360">
                        {theme === "dark" ? (
                            <FiSun size={24} />
                        ) : (
                            <FiMoon size={24} />
                        )}
                    </span>

                    <span
                        role="tooltip"
                        className="pointer-events-none absolute left-full text-foreground top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-lg bg-hover px-3 py-1.5 text-base font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50"
                    >
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                </li>
            </ul>
        </nav>
    );
};
