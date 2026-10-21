"use client";
import { useEffect, useState } from "react";
import { Hero } from "@/components/home/hero";
import { LandingGreeting } from "@/components/home/landing-greeting";
import { BloodTypes } from "@/components/home/blood-types";
import { CurrentlyLive } from "@/components/home/currently-live";
import { NewsPreview } from "@/components/home/news-preview";

export default function Client() {
    const [showGreeting, setShowGreeting] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setIsExiting(true), 5000);
        const t2 = setTimeout(() => setShowGreeting(false), 5000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <>
            {showGreeting && (
                <div
                    className={`
                        w-dvw h-dvh
                        fixed inset-0 z-50 bg-background
                        flex items-center justify-center
                        transition-all duration-400 ease-in-out
                        ${isExiting ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
                    `}
                >
                    <LandingGreeting durationScale={0.5} />
                </div>
            )}
            <Hero />
            <BloodTypes />
            <CurrentlyLive />
            <NewsPreview />
        </>
    );
}
