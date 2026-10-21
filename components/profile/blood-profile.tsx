"use client";;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BloodProfile } from "@/types/profile";
import {
    EMPTY,
    BLOOD_TYPES,
    GENDERS,
    ALLERGIES,
    ILLNESSES,
    MEDICATIONS,
} from "@/constants/profile";
import { Stepper } from "../ui/stepper";
import { CheckboxGroup } from "../ui/checkbox-group";
import { Checkbox } from "../ui/checkbox";
import { Field } from "./field";
import { Input } from "./input";
import { DropdownSelect } from "./dropdown-select";

export function BloodProfileForm({
    initial,
    onSave,
}: {
    initial?: Partial<BloodProfile>;
    onSave?: (data: BloodProfile) => void | Promise<void>;
}) {
    const [editing, setEditing] = useState(!initial);
    const [data, setData] = useState<BloodProfile>({ ...EMPTY, ...initial });
    const [saving, setSaving] = useState(false);
    const [consent, setConsent] = useState(false);

    const update = (key: keyof BloodProfile, value: string) =>
        setData((d) => ({ ...d, [key]: value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave?.(data);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setData({ ...EMPTY, ...initial });
        setEditing(false);
        setConsent(false);
    };

    return (
        <section className="pt-24 sm:px-10 lg:pt-20">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                        Blood &amp; Body Profile
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Used to match you with the right donation slots.
                    </p>
                </div>

                {!editing ? (
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                ) : (
                    <div className="flex gap-2">
                        {initial && (
                            <Button onClick={handleCancel} disabled={saving}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={saving || !consent}
                            title={
                                !consent
                                    ? "Please accept the terms to continue"
                                    : undefined
                            }
                        >
                            {saving ? "Saving…" : "Save"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                <Field
                    label="Blood type"
                    editing={editing}
                    value={data.bloodType}
                >
                    <DropdownSelect
                        value={data.bloodType}
                        onChange={(v) => update("bloodType", v)}
                        options={BLOOD_TYPES}
                        placeholder="Select blood type"
                    />
                </Field>

                <Field
                    label="Date of birth"
                    editing={editing}
                    value={data.dateOfBirth}
                >
                    <Input
                        type="date"
                        value={data.dateOfBirth}
                        onChange={(v) => update("dateOfBirth", v)}
                    />
                </Field>

                <Field label="Gender" editing={editing} value={data.gender}>
                    <DropdownSelect
                        value={data.gender}
                        onChange={(v) => update("gender", v)}
                        options={GENDERS}
                        placeholder="Select gender"
                    />
                </Field>

                <Field
                    label="Last donation"
                    editing={editing}
                    value={data.lastDonation}
                >
                    <Input
                        type="date"
                        value={data.lastDonation}
                        onChange={(v) => update("lastDonation", v)}
                    />
                </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                    label="Height"
                    editing={editing}
                    value={data.heightCm ? `${data.heightCm} cm` : ""}
                >
                    <Stepper
                        value={data.heightCm}
                        onChange={(v) => update("heightCm", v)}
                        min={100}
                        max={250}
                        step={1}
                        unit="cm"
                    />
                </Field>

                <Field
                    label="Weight"
                    editing={editing}
                    value={data.weightKg ? `${data.weightKg} kg` : ""}
                >
                    <Stepper
                        value={data.weightKg}
                        onChange={(v) => update("weightKg", v)}
                        min={30}
                        max={200}
                        step={1}
                        unit="kg"
                    />
                </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
                <Field
                    label="Chronic conditions"
                    editing={editing}
                    value={
                        data.chronicConditions.length > 0
                            ? data.chronicConditions.join(", ")
                            : "—"
                    }
                >
                    <CheckboxGroup
                        options={ILLNESSES}
                        selected={data.chronicConditions}
                        onChange={(v) =>
                            setData((d) => ({ ...d, chronicConditions: v }))
                        }
                        columns={4}
                    />
                </Field>

                <Field
                    label="Current medications"
                    editing={editing}
                    value={
                        data.medications.length > 0
                            ? data.medications.join(", ")
                            : "—"
                    }
                >
                    <CheckboxGroup
                        options={MEDICATIONS}
                        selected={data.medications}
                        onChange={(v) =>
                            setData((d) => ({ ...d, medications: v }))
                        }
                        columns={4}
                    />
                </Field>

                <Field
                    label="Allergies"
                    editing={editing}
                    value={
                        data.allergies.length > 0
                            ? data.allergies.join(", ")
                            : "—"
                    }
                >
                    <CheckboxGroup
                        options={ALLERGIES}
                        selected={data.allergies}
                        onChange={(v) =>
                            setData((d) => ({ ...d, allergies: v }))
                        }
                        columns={4}
                    />
                </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                    label="Emergency contact name"
                    editing={editing}
                    value={data.emergencyContactName}
                >
                    <Input
                        value={data.emergencyContactName}
                        onChange={(v) => update("emergencyContactName", v)}
                        placeholder="Full name"
                    />
                </Field>

                <Field
                    label="Emergency contact phone"
                    editing={editing}
                    value={data.emergencyContactPhone}
                >
                    <Input
                        type="tel"
                        value={data.emergencyContactPhone}
                        onChange={(v) => update("emergencyContactPhone", v)}
                        placeholder="+91 …"
                    />
                </Field>
            </div>

            <div className="mt-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Checkbox
                    checked={consent}
                    onChange={setConsent}
                    label="I confirm the information above is accurate and I accept the Terms of Service and Privacy Policy."
                />
            </div>
        </section>
    );
}
