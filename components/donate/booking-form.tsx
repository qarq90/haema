"use client";

import { useState } from "react";
import { LuClock, LuCircleCheck, LuLoaderCircle } from "react-icons/lu";
import { Button } from "../ui/button";
import { toast } from "../ui/toast";
import { EMAIL_RE, PHONE_RE } from "@/constants/common";
import { generateSlots, addMinutes } from "@/functions/booling";
import { Errors } from "@/types/booking";
import { Camp } from "@/types/donate";

export function BookingForm({ camp }: { camp: Camp }) {
    const [slot, setSlot] = useState<string | null>(null);
    const [name, setName] = useState("Jon Doe");
    const [email, setEmail] = useState("jondoe@xyz.com");
    const [phone, setPhone] = useState("8879662240");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const slots = generateSlots(camp.startTime, camp.endTime);
    const canSubmit = !submitting;

    function validate(): Errors {
        const next: Errors = {};

        if (!slot) {
            next.slot = "Please pick a time slot.";
        }

        if (!name.trim()) {
            next.name = "Full name is required.";
        } else if (name.trim().length < 2) {
            next.name = "Name looks too short.";
        }

        if (!email.trim()) {
            next.email = "Email is required.";
        } else if (!EMAIL_RE.test(email.trim())) {
            next.email = "Enter a valid email address.";
        }

        if (!phone.trim()) {
            next.phone = "Phone number is required.";
        } else if (!PHONE_RE.test(phone.trim())) {
            next.phone = "Enter a valid phone number.";
        }

        return next;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;

        const next = validate();
        setErrors(next);

        if (Object.keys(next).length > 0) {
            const first = next.slot ?? next.name ?? next.email ?? next.phone;
            toast.add({
                title: "Please fix the highlighted fields",
                description: first,
                type: "error",
            });
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 1200));

            toast.add({
                title: "Booking confirmed",
                description: `${camp.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} at ${slot}`,
            });

            setSlot(null);
            setName("");
            setEmail("");
            setPhone("");
            setNotes("");
            setErrors({});
        } catch {
            toast.add({
                title: "Booking failed",
                description: "Something went wrong. Please try again.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    }

    function clearError(key: keyof Errors) {
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-8"
        >
            <div
                className={`rounded-xl border p-6 transition ${
                    errors.slot
                        ? "border-red-500/60"
                        : "border-neutral-200 dark:border-neutral-800"
                }`}
            >
                <div className="flex items-center gap-2">
                    <LuClock className="h-4 w-4 text-neutral-500" />
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                        Choose a time
                    </h2>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {slots.map((s) => {
                        const active = s === slot;
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => {
                                    setSlot(s);
                                    clearError("slot");
                                }}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                    active
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "border-neutral-200 hover:border-red-500/50 dark:border-neutral-800"
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>

                {errors.slot && (
                    <p className="mt-3 text-xs font-medium text-red-500">
                        {errors.slot}
                    </p>
                )}
            </div>

            <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    Your details
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                        label="Full name"
                        value={name}
                        onChange={(v) => {
                            setName(v);
                            clearError("name");
                        }}
                        placeholder="Aarav Sharma"
                        required
                        error={errors.name}
                    />
                    <Field
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(v) => {
                            setEmail(v);
                            clearError("email");
                        }}
                        placeholder="you@example.com"
                        required
                        error={errors.email}
                    />
                    <Field
                        label="Phone"
                        type="tel"
                        value={phone}
                        onChange={(v) => {
                            setPhone(v);
                            clearError("phone");
                        }}
                        placeholder="+91 98765 43210"
                        required
                        error={errors.phone}
                    />
                    <Field
                        label="Blood type"
                        value="—"
                        onChange={() => {}}
                        disabled
                    />
                </div>

                <div className="mt-5">
                    <label className="text-sm font-medium">
                        Notes (optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Anything we should know? Allergies, accessibility needs, etc."
                        className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-red-500/50 dark:border-neutral-800"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-neutral-500">
                    {slot
                        ? `Selected: ${slot} – ${addMinutes(slot, 30)}`
                        : "Pick a time to continue"}
                </p>
                <Button type="submit" disabled={!canSubmit}>
                    {submitting ? (
                        <>
                            <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Booking…
                        </>
                    ) : (
                        <>
                            <LuCircleCheck className="mr-2 h-4 w-4" />
                            Confirm booking
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required,
    disabled,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}) {
    return (
        <div>
            <label className="text-sm font-medium">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-2 w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-neutral-400 disabled:opacity-50 ${
                    error
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-neutral-200 focus:border-red-500/50 dark:border-neutral-800"
                }`}
            />
            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
