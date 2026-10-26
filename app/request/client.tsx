"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BLOOD_TYPES } from "@/constants/profile";
import { Button } from "@/components/ui/button";
import { LuDroplet, LuMapPin, LuShieldCheck, LuSearch } from "react-icons/lu";

export default function Client() {
    const [bloodType, setBloodType] = useState("");
    const [requests, setRequests] = useState<Array<{ id: string; patientName: string; bloodType: string; unitsNeeded: number; urgency: string; status: string; hospital: string; city: string; neededBy: string | null; responseCount: number }>>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [availability, setAvailability] = useState<{ donors: number; bloodBanks: Array<{ id: string; name: string; hospital: string; city: string; units: number }> } | null>(null);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, Array<{ id: string; status: string; message: string | null; contactEmail: string | null; contactPhone: string | null }>>>({});
    const [responseError, setResponseError] = useState<string | null>(null);
    const [loadingResponsesId, setLoadingResponsesId] = useState<string | null>(null);

    useEffect(() => {
        const requestedType = new URLSearchParams(window.location.search).get("bloodType");
        if (requestedType && BLOOD_TYPES.includes(requestedType)) {
            setBloodType(requestedType);
        }
    }, []);

    useEffect(() => {
        void fetch("/api/requests").then(async (response) => {
            if (!response.ok) return;
            const result: { requests?: typeof requests } = await response.json();
            setRequests(result.requests ?? []);
        });
    }, []);

    async function submitRequest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitting(true);
        setMessage(null);
        setError(null);
        const data = new FormData(event.currentTarget);
        const response = await fetch("/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(data.entries())),
        }).catch(() => null);
        if (!response) setError("Could not reach the server. Please try again.");
        else {
            const result: { error?: string } = await response.json();
            if (!response.ok) setError(result.error ?? "Could not create the request.");
            else {
                setMessage("Blood request submitted and shared with emergency responders.");
                form.reset();
                setBloodType("");
                const refresh = await fetch("/api/requests");
                if (refresh.ok) setRequests((await refresh.json()).requests ?? []);
            }
        }
        setSubmitting(false);
    }

    async function searchAvailability(form: HTMLFormElement) {
        setSearching(true);
        setSearchError(null);
        const data = new FormData(form);
        const params = new URLSearchParams({ bloodType: String(data.get("bloodType") ?? ""), city: String(data.get("location") ?? ""), units: String(data.get("unitsNeeded") ?? "1") });
        const response = await fetch(`/api/requests/availability?${params}`).catch(() => null);
        if (!response) setSearchError("Could not reach the server. Please try again.");
        else {
            const result: { error?: string; donors?: number; bloodBanks?: typeof availability extends infer T ? T extends { bloodBanks: infer B } ? B : never : never } = await response.json();
            if (!response.ok) setSearchError(result.error ?? "Could not search availability.");
            else setAvailability({ donors: result.donors ?? 0, bloodBanks: result.bloodBanks ?? [] });
        }
        setSearching(false);
    }

    async function loadResponses(requestId: string) {
        setLoadingResponsesId(requestId);
        setResponseError(null);
        try {
            const response = await fetch(`/api/requests/${requestId}/responses`);
            const result: { error?: string; responses?: typeof responses[string] } = await response.json();
            if (!response.ok) {
                setResponseError(result.error ?? "Could not load responses.");
                return;
            }
            setResponses((current) => ({ ...current, [requestId]: result.responses ?? [] }));
        } catch {
            setResponseError("Could not reach the server while loading responses.");
        } finally {
            setLoadingResponsesId(null);
        }
    }

    async function updateResponse(requestId: string, responseId: string, action: "accepted" | "rejected") {
        setResponseError(null);
        try {
            const response = await fetch(`/api/requests/${requestId}/responses`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ responseId, action }) });
            const result: { error?: string } = await response.json();
            if (!response.ok) setResponseError(result.error ?? "Could not update response.");
            else await loadResponses(requestId);
        } catch {
            setResponseError("Could not reach the server while updating the response.");
        }
    }

    return (
        <main className="min-h-screen">
             <section className="max-w-7xl px-4 pt-20 sm:px-10 lg:pt-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Find the blood you need.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
                    Search for nearby blood availability by type and location. Contact details stay private until a request is accepted.
                </p>
            </section>

            <section className="mx-auto mt-8 sm:px-10">
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

            <div className="mx-auto grid grid-cols-1 gap-6 px-4 pt-8 pb-20 sm:px-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-8 lg:pt-12">
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
                        onSubmit={submitRequest}
                    >
                        <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">Patient name<input required name="patientName" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">
                            Blood type
                            <span className="flex items-center gap-2 rounded-lg border border-foreground/15 px-3 py-3">
                                <LuDroplet className="shrink-0 text-foreground/40" size={18} />
                                <select required name="bloodType" value={bloodType} onChange={(event) => setBloodType(event.target.value)} className="w-full bg-transparent outline-none">
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
                            <input required name="unitsNeeded" type="number" min="1" max="1000" defaultValue="1" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium">Hospital<input required name="hospital" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">City<input required name="city" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">Contact name<input required name="contactName" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">Contact phone<input required name="contactPhone" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">Contact email<input required type="email" name="contactEmail" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">Urgency<select name="urgency" defaultValue="normal" className="rounded-lg border border-foreground/15 bg-background px-3 py-3 outline-none"><option value="low">Low</option><option value="normal">Normal</option><option value="high">Urgent</option><option value="critical">Critical</option></select></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">Needed by<input name="neededBy" type="datetime-local" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">Reason<textarea name="reason" rows={2} className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 outline-none" /></label>
                        {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
                        {message && <p role="status" className="text-sm text-theme sm:col-span-2">{message}</p>}
                        <div className="sm:col-span-2">
                            <Button type="button" variant="secondary" disabled={searching} onClick={() => void searchAvailability(document.querySelector<HTMLFormElement>("#request-form form")!)} className="mr-3 w-full sm:w-auto">
                                {searching ? "Searching…" : "Search availability"}
                            </Button>
                            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                                <LuSearch size={18} /> {submitting ? "Submitting…" : "Request blood"}
                            </Button>
                        </div>
                    </form>
                    {searchError && <p role="alert" className="mt-4 text-sm text-destructive">{searchError}</p>}
                    {availability && <div className="mt-6 rounded-xl border border-theme/20 bg-theme/5 p-5"><p className="font-semibold">Availability found</p><p className="mt-2 text-sm text-foreground/60">{availability.donors} potential matching donor{availability.donors === 1 ? "" : "s"}. Contact details remain private until a request is accepted.</p>{availability.bloodBanks.length > 0 && <div className="mt-4 grid gap-2">{availability.bloodBanks.map((bank) => <div key={bank.id} className="rounded-lg border border-foreground/10 bg-background p-3 text-sm"><strong>{bank.name || bank.hospital}</strong> · {bank.city} · {bank.units} units available</div>)}</div>}</div>}

                    <div role="status" className="mt-8 rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.02] px-5 py-8 text-center">
                        <p className="font-medium">Your blood requests</p>
                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-foreground/55">
                            {requests.length ? `${requests.length} request${requests.length === 1 ? "" : "s"} submitted.` : "Your submitted requests will appear here after you sign in."}
                        </p>
                        {requests.length > 0 && <div className="mt-5 grid gap-3 text-left">{requests.map((request) => <div key={request.id} className="rounded-lg border border-foreground/10 p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{request.bloodType} · {request.unitsNeeded} {request.unitsNeeded === 1 ? "unit" : "units"}</p><span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold capitalize">{request.status}</span></div><p className="mt-1 text-sm text-foreground/60">{request.patientName} · {request.hospital}, {request.city} · {request.urgency}</p><p className="mt-2 text-xs text-foreground/50">{request.responseCount} donor response{request.responseCount === 1 ? "" : "s"}</p><Button type="button" variant="secondary" className="mt-3" disabled={loadingResponsesId === request.id} onClick={() => void loadResponses(request.id)}>{loadingResponsesId === request.id ? "Loading responses…" : "View responses"}</Button>{responses[request.id]?.length === 0 && <p className="mt-3 text-sm text-foreground/55">No donor responses yet.</p>}{responses[request.id]?.map((response) => <div key={response.id} className="mt-3 rounded-lg bg-foreground/[0.03] p-3 text-sm"><p className="capitalize">Status: {response.status}</p>{response.message && <p className="mt-1 text-foreground/60">{response.message}</p>}{response.status === "pledged" && <div className="mt-3 flex gap-2"><Button type="button" onClick={() => void updateResponse(request.id, response.id, "accepted")}>Accept</Button><Button type="button" variant="secondary" onClick={() => void updateResponse(request.id, response.id, "rejected")}>Reject</Button></div>}{response.status === "accepted" && <p className="mt-2 text-theme">Contact: {response.contactPhone ?? "Not provided"} · {response.contactEmail ?? "Not provided"}</p>}</div>)}</div>)}</div>}
                        {responseError && <p role="alert" className="mt-3 text-sm text-destructive">{responseError}</p>}
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
