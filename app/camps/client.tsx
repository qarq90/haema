"use client";

import { Camps } from "@/components/donate/camps";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="max-w-7xl px-4 pt-20 sm:px-10 lg:pt-20">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">Give blood locally</p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Find a camp.
                    <br />
                    <span className="text-red-500">Donate near you.</span>
                </h1>

                <p className="my-6 max-w-2xl text-base leading-7 text-foreground/75 sm:my-8 sm:text-lg sm:leading-8">
                    Browse upcoming blood donation camps in your city, filter by
                    blood type, or search for a specific location. Find the
                    right slot and help save a life.
                </p>
            </section>

            <section className="max-w-7xl px-4 sm:px-10">
                <Camps />
            </section>
        </main>
    );
}
