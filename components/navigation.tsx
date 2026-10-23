"use client";
import { FiSun, FiMoon, FiUser, FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { items } from "@/lib/sidebar";
import { useUser } from "@clerk/nextjs";

export const Navigation = () => {
    const pathname = usePathname();
    const { isLoaded, isSignedIn, user } = useUser();

    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMobileOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [mobileOpen]);

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
        <>
            <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
                <p className="text-xl font-bold uppercase overflow-hidden scrollbar-none">
                    H<span className="lowercase text-3xl">α</span>EM
                    <span className="lowercase text-3xl">α</span>
                </p>
                <button
                    type="button"
                    aria-label={
                        mobileOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMobileOpen((open) => !open)}
                    className="rounded-md p-2 text-foreground hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme"
                >
                    {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {mobileOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    />
                    <nav
                        id="mobile-navigation"
                        aria-label="Mobile navigation"
                        className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-background px-5 pb-8 pt-6 text-foreground shadow-xl md:hidden"
                    >
                        <div className="mb-8 flex items-center justify-between overflow-hidden scrollbar-none">
                            <p className="text-xl font-bold uppercase overflow-hidden scrollbar-none">
                                H<span className="lowercase text-3xl">α</span>EM
                                <span className="lowercase text-3xl">α</span>
                            </p>
                            <button
                                type="button"
                                aria-label="Close navigation menu"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-md p-2 hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme"
                            >
                                <FiX size={22} />
                            </button>
                        </div>
                        <ul className="flex flex-col gap-2">
                            {items.map(({ label, Icon, path }) => {
                                const isActive =
                                    path === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(path);
                                return (
                                    <li key={label}>
                                        <Link
                                            href={path}
                                            className={`flex items-center gap-4 rounded-lg px-4 py-3 font-medium transition-colors ${isActive ? "bg-red-600 text-white" : "hover:bg-hover"}`}
                                        >
                                            <Icon size={21} />
                                            <span>{label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="my-2 h-px bg-foreground/10" />
                            <li>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-4 rounded-lg px-4 py-3 font-medium hover:bg-hover"
                                >
                                    {isLoaded && isSignedIn && user ? (
                                        <img
                                            src={user.imageUrl}
                                            alt=""
                                            className="h-6 w-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FiUser size={21} />
                                    )}
                                    <span>
                                        {isLoaded && isSignedIn && user
                                            ? (user.firstName ??
                                              user.username ??
                                              "Account")
                                            : "Account"}
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left font-medium hover:bg-hover"
                                >
                                    {theme === "dark" ? (
                                        <FiSun size={21} />
                                    ) : (
                                        <FiMoon size={21} />
                                    )}
                                    <span>
                                        {theme === "dark"
                                            ? "Light Mode"
                                            : "Dark Mode"}
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}

            <nav
                aria-label="Primary navigation"
                className="fixed top-16 left-0 z-50 hidden h-dvh w-32 flex-col items-center pt-8 pb-10 md:flex"
            >
                <p className="text-xl font-bold uppercase mb-10 overflow-hidden">
                    H<span className="lowercase text-3xl">α</span>EM
                    <span className="lowercase text-3xl">α</span>
                </p>

                <ul className="flex flex-col items-center gap-8 overflow-hidden">
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
        </>
    );
};
