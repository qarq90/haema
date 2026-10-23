"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BLOOD_TYPES } from "@/constants/profile";
import { Button } from "@/components/ui/button";
import { LuDroplet, LuMapPin, LuShieldCheck, LuSearch } from "react-icons/lu";

export default function Client() {
    const [searched, setSearched] = useState(false);
    const [bloodType, setBloodType] = useState("");

    useEffect(() => {
        const requestedType = new URLSearchParams(window.location.search).get("bloodType");
        if (requestedType && BLOOD_TYPES.includes(requestedType)) {
            setBloodType(requestedType);
        }
    }, []);

    return (
        <main className="min-h-screen">
            <section className="max-w-7xl px-4 pt-20 sm:px-10 lg:pt-20">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
                    Blood request
                </p>
                <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                    Find the blood you need.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
                    Search for nearby blood availability by type and location. Contact details stay private until a request is accepted.
                </p>
            </section>

            <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-10">
                <div className="rounded-2xl bg-theme p-6 text-white sm:p-8 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                        Start here
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                        Which blood type do you need?
                    </h2>
                    <p className="mt-2 text-sm text-white/75">
                        Choose a type to begin your request.
                    </p>
                    <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-2xl sm:grid-cols-8">
                        {BLOOD_TYPES.map((type) => (
                            <button
                                key={type}
                                type="button"
                                aria-pressed={bloodType === type}
                                onClick={() => {
                                    setBloodType(type);
                                    document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                className={`rounded-lg border px-2 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${bloodType === type ? "border-white bg-white text-theme" : "border-white/30 bg-white/10 hover:bg-white/20"}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pt-8 pb-20 sm:px-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-8 lg:pt-12">
                <section id="request-form" className="scroll-mt-24 rounded-2xl border border-foreground/10 p-5 sm:p-8">
                    <div className="flex items-start gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-theme/10 text-theme">
                            <LuSearch size={20} />
                        </span>
                        <div>
                            <h2 className="text-xl font-semibold">Search availability</h2>
                            <p className="mt-1 text-sm text-foreground/60">
                                Choose the blood type and location you need.
                            </p>
                        </div>
                    </div>

                    <form
                        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            setSearched(true);
                        }}
                    >
                        <label className="flex flex-col gap-2 text-sm font-medium">
                            Blood type
                            <span className="flex items-center gap-2 rounded-lg border border-foreground/15 px-3 py-3">
                                <LuDroplet className="shrink-0 text-foreground/40" size={18} />
                                <select required value={bloodType} onChange={(event) => setBloodType(event.target.value)} className="w-full bg-transparent outline-none">
                                    <option value="" disabled>Select blood type</option>
                                    {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </span>
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium">
                            City or pincode
                            <span className="flex items-center gap-2 rounded-lg border border-foreground/15 px-3 py-3">
                                <LuMapPin className="shrink-0 text-foreground/40" size={18} />
                                <input required name="location" placeholder="Enter a city or pincode" className="w-full min-w-0 bg-transparent outline-none placeholder:text-foreground/35" />
                            </span>
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
                            Units needed
                            <input required type="number" min="1" max="100" defaultValue="1" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" />
                        </label>
                        <div className="sm:col-span-2">
                            <Button type="submit" className="w-full sm:w-auto">
                                <LuSearch size={18} /> Search blood
                            </Button>
                        </div>
                    </form>

                    <div role={searched ? "status" : undefined} className="mt-8 rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.02] px-5 py-8 text-center">
                        <p className="font-medium">{searched ? "Availability search is not connected yet" : "Search results will appear here"}</p>
                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-foreground/55">
                            Live donor and blood bank listings are not available yet. No availability is shown until verified data is connected.
                        </p>
                    </div>
                </section>

                <aside className="flex flex-col gap-5">
                    <section className="rounded-2xl bg-theme p-6 text-white sm:p-8">
                        <LuShieldCheck size={26} aria-hidden="true" />
                        <h2 className="mt-5 text-xl font-semibold">Your contact details stay private</h2>
                        <p className="mt-3 text-sm leading-6 text-white/80">
                            Contact information should only be shared after a blood request is accepted.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
                        <h2 className="text-lg font-semibold">Need help?</h2>
                        <p className="mt-2 text-sm leading-6 text-foreground/60">
                            For urgent medical needs, contact your treating hospital directly.
                        </p>
                        <Link href="/contact-us" className="mt-4 inline-flex text-sm font-semibold text-theme hover:underline">
                            Contact support
                        </Link>
                    </section>
                </aside>
            </div>
        </main>
    );
}
