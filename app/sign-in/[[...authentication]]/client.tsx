"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
import pool from "@/lib/neon";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { SiApple, SiFacebook, SiGithub, SiGoogle } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { OAuthStrategy } from "@/types/auth";
import { IMAGES } from "@/constants/sign-in";
import { applyTheme } from "@/functions/theme";

export default function Client() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const { signIn, isLoaded: signInLoaded } = useSignIn();
    const { isSignedIn, user, isLoaded: userLoaded } = useUser();
    const [loading, setLoading] = useState<OAuthStrategy | null>(null);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const initial = saved ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
        applyTheme(initial);
    }, []);

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

    useEffect(() => {
        if (userLoaded && isSignedIn && user) {
            const syncUserToDB = async () => {
                const client = await pool.connect();
                try {
                    await client.query(
                        `
                        INSERT INTO "users" (
                            "user-id",
                            "user-name",
                            "user-email",
                            "first-name",
                            "last-name",
                            "user-avatar",
                            "phone-number"
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        ON CONFLICT ("user-id") DO NOTHING
                    `,
                        [
                            user.id,
                            user.username ||
                                user.primaryEmailAddress?.emailAddress?.split(
                                    "@",
                                )[0],
                            user.primaryEmailAddress?.emailAddress || null,
                            user.firstName ||
                                user.externalAccounts?.[0]?.firstName ||
                                "",
                            user.lastName ||
                                user.externalAccounts?.[0]?.lastName ||
                                "",
                            user.imageUrl || null,
                            user.primaryPhoneNumber?.phoneNumber || null,
                        ],
                    );
                } catch (error) {
                    console.error("Failed to sync user:", error);
                } finally {
                    client.release();
                    router.push("/");
                }
            };

            syncUserToDB();
        }
    }, [userLoaded, isSignedIn, user, router]);

    const signInWith = async (strategy: OAuthStrategy) => {
        if (!signInLoaded || !signIn) return;
        setLoading(strategy);

        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (error) {
            console.error("OAuth error:", error);
            setLoading(null);
        }
    };

    const isBusy = !signInLoaded || loading !== null;

    return (
        <main className="min-h-screen overflow-hidden flex flex-row">
            <div className="w-1/2 overflow-y-auto p-4">
                <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
                    {IMAGES.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`Gallery ${i}`}
                            className="mb-4 w-full rounded-lg object-cover break-inside-avoid"
                        />
                    ))}
                </div>
            </div>

            <div className="w-1/2 px-64 h-screen flex flex-col gap-8 items-center justify-center p-8">
                <p className="text-6xl font-bold tracking-wide">
                    H<span className="lowercase">α</span>EM
                    <span className="lowercase">α</span>
                </p>

                <div className="w-full flex flex-col gap-4">
                    <Button
                        className="w-full"
                        onClick={() => signInWith("oauth_google")}
                        disabled={isBusy}
                    >
                        <SiGoogle size={20} />
                        {loading === "oauth_google"
                            ? "Redirecting…"
                            : "Continue with Google"}
                    </Button>

                    <Button
                        className="w-full"
                        onClick={() => signInWith("oauth_github")}
                        disabled={isBusy}
                    >
                        <SiGithub size={20} />
                        {loading === "oauth_github"
                            ? "Redirecting…"
                            : "Continue with Github"}
                    </Button>

                    <Button
                        className="w-full"
                        onClick={() => signInWith("oauth_apple")}
                        disabled={isBusy}
                    >
                        <SiApple size={20} />
                        {loading === "oauth_apple"
                            ? "Redirecting…"
                            : "Continue with Apple"}
                    </Button>

                    <Button
                        className="w-full"
                        onClick={() => signInWith("oauth_facebook")}
                        disabled={isBusy}
                    >
                        <SiFacebook size={20} />
                        {loading === "oauth_facebook"
                            ? "Redirecting…"
                            : "Continue with Facebook"}
                    </Button>

                    <Button
                        className="w-full"
                        onClick={() => signInWith("oauth_linkedin_oidc")}
                        disabled={isBusy}
                    >
                        <FaLinkedin size={20} />
                        {loading === "oauth_linkedin_oidc"
                            ? "Redirecting…"
                            : "Continue with LinkedIn"}
                    </Button>
                </div>
            </div>

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
                className="list-none absolute top-4 right-4 group px-3 pt-3 pb-2 cursor-pointer rounded-full transition-colors text-foreground duration-200 hover:text-theme focus-visible:text-theme focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme/50"
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
        </main>
    );
}
