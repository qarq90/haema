"use client";

import { Camps } from "@/components/donate/camps";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Find a camp.
                    <br />
                    <span className="text-red-500">Donate near you.</span>
                </h1>

                <p className="my-8 max-w-2xl text-lg leading-8 text-foreground/75">
                    Browse upcoming blood donation camps in your city, filter by
                    blood type, or search for a specific location. Find the
                    right slot and help save a life.
                </p>
            </section>

            <section className="sm:px-10 max-w-7xl">
                <Camps />
            </section>
        </main>
    );
}
