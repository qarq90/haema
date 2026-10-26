"use client";

import { useEffect, useState } from "react";
import { BLOOD_TYPES } from "@/constants/profile";

export const BloodTypes = () => {
    const [inventory, setInventory] = useState<Record<string, number>>({});
    useEffect(() => {
        void fetch("/api/inventory").then(async (response) => {
            if (!response.ok) return;
            const data: { inventory?: Array<{ bloodType: string; units: number }> } = await response.json();
            setInventory(Object.fromEntries((data.inventory ?? []).map((entry) => [entry.bloodType, entry.units])));
        });
    }, []);

    return (
        <section className="flex min-h-[50dvh] w-full flex-col items-center justify-center gap-y-8 py-12 sm:gap-y-12 sm:py-16 md:gap-y-16 md:py-20">
            <h2 className="text-center text-4xl leading-tight sm:text-6xl md:text-8xl">
                Live{" "}
                <span className="text-theme font-bold uppercase">Blood</span>{" "}
                Stock Counter
            </h2>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 overflow-hidden">
                {BLOOD_TYPES.map((type) => (
                    <div
                        key={type}
                        className="group flex cursor-pointer flex-col items-center justify-center gap-y-2 overflow-hidden rounded-xl border border-foreground/5 p-4 transition-all duration-300 hover:border-theme/40 hover:bg-theme/15 sm:p-6"
                    >
                        <p className="text-2xl font-semibold tracking-wide text-foreground/80 transition-colors">
                            {type}
                        </p>
                        <p className="text-4xl font-bold tabular-nums text-foreground transition-colors sm:text-5xl overflow-hidden">
                            {inventory[type] ?? "—"}
                        </p>
                        <span className="text-xs uppercase tracking-widest text-foreground/40">
                            Units
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};
