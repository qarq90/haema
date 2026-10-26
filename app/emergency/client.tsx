"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { BLOOD_TYPES } from "@/constants/profile";
import { Button } from "@/components/ui/button";
import { LuCircleAlert, LuHeartHandshake, LuMapPin, LuPlus, LuRefreshCw } from "react-icons/lu";

type HospitalNeed = {
    id: string;
    hospitalName: string;
    bloodType: string;
    city: string;
    units: number;
    neededBy: string | null;
    status: "Pending" | "Approved" | "Fulfilled" | "Rejected";
    createdAt: string;
    source: "request" | "hospital";
    patientName: string | null;
    responseStatus: string | null;
};

export default function Client() {
    const { isLoaded, isSignedIn, user } = useUser();
    const metadata = user?.publicMetadata as Record<string, unknown> | undefined;
    const canPostNeed =
        metadata?.role === "hospital" &&
        metadata.hospitalVerified === true &&
        typeof metadata.hospitalName === "string" &&
        metadata.hospitalName.trim().length >= 2;
    const [requests, setRequests] = useState<HospitalNeed[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [filterCity, setFilterCity] = useState("");
    const [filterBloodType, setFilterBloodType] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [respondedRequestId, setRespondedRequestId] = useState<string | null>(null);
    const [responseError, setResponseError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const loadRequests = async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const params = new URLSearchParams();
                if (filterCity) params.set("city", filterCity);
                if (filterBloodType) params.set("bloodType", filterBloodType);
                const query = params.toString();
                const response = await fetch(
                    `/api/emergency/requests${query ? `?${query}` : ""}`,
                    { signal: controller.signal },
                );
                const result: {
                    requests?: HospitalNeed[];
                    cities?: string[];
                    error?: string;
                } = await response.json();
                if (!response.ok) {
                    throw new Error(result.error ?? "Could not load hospital needs.");
                }
                setRequests(result.requests ?? []);
                setCities(result.cities ?? []);
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setLoadError(error instanceof Error ? error.message : "Could not load hospital needs.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        void loadRequests();
        return () => controller.abort();
    }, [filterCity, filterBloodType, reloadKey]);

    async function submitNeed(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setFormError(null);
        setFormMessage(null);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const response = await fetch("/api/emergency/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bloodType: formData.get("bloodType"),
                city: formData.get("city"),
                units: Number(formData.get("units")),
                neededBy: formData.get("neededBy"),
                reason: formData.get("reason"),
            }),
        }).catch(() => null);

        if (!response) {
            setFormError("Could not reach the server. Please try again.");
            setSubmitting(false);
            return;
        }

        const result: { error?: string } = await response.json();
        if (!response.ok) {
            setFormError(result.error ?? "Could not post this hospital need.");
        } else {
            form.reset();
            setFormMessage("Hospital need posted.");
            setReloadKey((key) => key + 1);
        }
        setSubmitting(false);
    }

    async function respondToRequest(requestId: string) {
        setResponseError(null);
        const response = await fetch(`/api/requests/${requestId}/responses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        }).catch(() => null);
        if (!response) {
            setResponseError("Could not reach the server. Please try again.");
            return;
        }
        const result: { error?: string } = await response.json();
        if (!response.ok) {
            setResponseError(result.error ?? "Could not send your response.");
            return;
        }
        setRespondedRequestId(requestId);
        setReloadKey((key) => key + 1);
    }

    return (
        <main className="min-h-screen">
             <section className="max-w-7xl px-4 pt-20 sm:px-10 lg:pt-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Help meet urgent needs.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
                    See active blood needs posted by verified hospitals. Contact details and private request reasons are not shown in this public list.
                </p>
            </section>

            <div className="mx-auto grid grid-cols-1 gap-6 px-4 pt-8 pb-20 sm:px-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] lg:gap-8 lg:pt-12">
                <section>
                    <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-foreground/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 rounded-lg border border-foreground/10 px-3 py-2 text-sm">
                                <LuMapPin size={16} className="text-foreground/45" />
                                <span className="sr-only">Filter by city</span>
                                <select value={filterCity} onChange={(event) => setFilterCity(event.target.value)} className="max-w-36 bg-transparent outline-none">
                                    <option value="">All cities</option>
                                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </label>
                            <label className="rounded-lg border border-foreground/10 px-3 py-2 text-sm">
                                <span className="sr-only">Filter by blood type</span>
                                <select value={filterBloodType} onChange={(event) => setFilterBloodType(event.target.value)} className="max-w-36 bg-transparent outline-none">
                                    <option value="">All blood types</option>
                                    {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </label>
                        </div>
                        <Button variant="secondary" onClick={() => setReloadKey((key) => key + 1)} disabled={loading} className="w-full sm:w-auto">
                            <LuRefreshCw size={16} /> Refresh
                        </Button>
                    </div>

                    {loadError ? (
                        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                            {loadError}
                        </div>
                    ) : loading ? (
                        <div role="status" className="rounded-xl border border-dashed border-foreground/15 p-10 text-center text-sm text-foreground/55">
                            Loading hospital needs…
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-foreground/15 px-5 py-12 text-center">
                            <LuHeartHandshake className="mx-auto text-foreground/35" size={28} />
                            <h2 className="mt-4 font-semibold">No active hospital needs found</h2>
                            <p className="mt-2 text-sm text-foreground/55">Try another filter or check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {requests.map((request) => (
                                <article key={request.id} className="rounded-xl border border-foreground/10 p-5 transition hover:border-theme/30 sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-semibold">{request.hospitalName}</h2>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/55">
                                                <LuMapPin size={15} /> {request.city}
                                            </p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${request.status === "Approved" ? "bg-theme/10 text-theme" : "bg-foreground/5 text-foreground/60"}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-foreground/10 pt-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-foreground/45">Blood type</p>
                                            <p className="mt-1 text-2xl font-bold text-theme">{request.bloodType}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold tabular-nums">{request.units}</p>
                                            <p className="text-xs text-foreground/50">{request.units === 1 ? "unit" : "units"} needed</p>
                                        </div>
                                    </div>
                                    {request.patientName && <p className="mt-4 text-sm text-foreground/60">Patient: {request.patientName}</p>}
                                    {request.neededBy && <p className="mt-4 text-sm text-foreground/60">
                                        Needed by <time dateTime={request.neededBy}>{new Date(`${request.neededBy}T00:00:00`).toLocaleDateString()}</time>
                                    </p>}
                                    {request.source === "request" && (
                                        <Button type="button" variant="secondary" className="mt-4 w-full" disabled={Boolean(request.responseStatus)} onClick={() => void respondToRequest(request.id)}>
                                            {request.responseStatus || respondedRequestId === request.id ? "Response sent" : "I can help"}
                                        </Button>
                                    )}
                                    {respondedRequestId === request.id && <p role="status" className="mt-2 text-sm text-theme">Your response was sent to the requester.</p>}
                                    {responseError && request.source === "request" && <p role="alert" className="mt-2 text-sm text-destructive">{responseError}</p>}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <aside className="flex flex-col gap-5">
                    <section className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6 sm:p-8">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                            <LuCircleAlert size={24} />
                        </span>
                        <h2 className="mt-5 text-xl font-semibold">Medical emergency?</h2>
                        <p className="mt-3 text-sm leading-6 text-foreground/65">
                            This listing does not provide emergency dispatch. Contact the treating hospital and local emergency services directly.
                        </p>
                    </section>

                    {isLoaded && canPostNeed ? (
                        <section className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <LuPlus className="text-theme" size={20} />
                                <h2 className="text-lg font-semibold">Post a hospital need</h2>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-foreground/55">
                                Posting as {String(metadata?.hospitalName ?? "your verified hospital")}.
                            </p>
                            <form onSubmit={submitNeed} className="mt-5 flex flex-col gap-4">
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    Blood type
                                    <select name="bloodType" required defaultValue="" className="rounded-lg border border-foreground/15 bg-background px-3 py-3 outline-none">
                                        <option value="" disabled>Select blood type</option>
                                        {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    City
                                    <input name="city" required minLength={2} maxLength={100} className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" />
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex flex-col gap-2 text-sm font-medium">
                                        Units
                                        <input name="units" type="number" min="1" max="1000" required className="min-w-0 rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-medium">
                                        Needed by
                                        <input name="neededBy" type="date" required className="min-w-0 rounded-lg border border-foreground/15 bg-transparent px-2 py-3 text-sm outline-none" />
                                    </label>
                                </div>
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    Private reason
                                    <textarea name="reason" required minLength={5} maxLength={500} rows={3} className="resize-y rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" />
                                    <span className="text-xs font-normal text-foreground/45">This is stored with the request and is not shown in the public list.</span>
                                </label>
                                {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
                                {formMessage && <p role="status" className="text-sm text-theme">{formMessage}</p>}
                                <Button type="submit" disabled={submitting} className="w-full">
                                    {submitting ? "Posting…" : "Post hospital need"}
                                </Button>
                            </form>
                        </section>
                    ) : (
                        <section className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
                            <h2 className="text-lg font-semibold">Represent a hospital?</h2>
                            <p className="mt-2 text-sm leading-6 text-foreground/55">
                                Only verified hospital accounts can publish needs. Contact support to request verification.
                            </p>
                            <Link href="/contact-us" className="mt-4 inline-flex text-sm font-semibold text-theme hover:underline">
                                Contact support
                            </Link>
                            {isLoaded && isSignedIn && !canPostNeed && (
                                <p className="mt-3 text-xs text-foreground/40">Your account is not verified as a hospital.</p>
                            )}
                        </section>
                    )}
                </aside>
            </div>
        </main>
    );
}
