"use client";
import { useUser } from "@clerk/nextjs";
import { Profile } from "@/components/profile/details";
import { BloodProfile, ProfileField } from "@/types/profile";
import { BloodProfileForm } from "@/components/profile/blood-profile";
import { useState } from "react";

export default function Client() {
    const { isLoaded, isSignedIn, user } = useUser();

    const [blood, setBlood] = useState<BloodProfile | null>(null);

    if (!isLoaded) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Loading…</p>
            </main>
        );
    }

    if (!isSignedIn || !user) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Not signed in.</p>
            </main>
        );
    }

    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    const primaryPhone = user.primaryPhoneNumber?.phoneNumber;
    const joined = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    const fields: ProfileField[] = [
        { label: "First name", value: user.firstName },
        { label: "Last name", value: user.lastName },
        { label: "Username", value: user.username },
        { label: "Email", value: primaryEmail },
        { label: "Phone", value: primaryPhone },

        { label: "User ID", value: user.id, mono: true },
        { label: "Joined", value: joined },
        {
            label: "2FA",
            value: user.twoFactorEnabled ? "Enabled" : "Disabled",
        },
    ];

    return (
        <>
            <Profile
                imageUrl={user.imageUrl}
                fullName={user.fullName}
                username={user.username}
                primaryEmail={primaryEmail}
                externalAccounts={user.externalAccounts.map((a) => ({
                    id: a.id,
                    provider: a.provider,
                    emailAddress: a.emailAddress,
                    username: a.username,
                }))}
                fields={fields}
            />

            <BloodProfileForm
                initial={blood ?? undefined}
                onSave={async (data) => {
                    await fetch("/api/profile/blood", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });
                    setBlood(data);
                }}
            />
        </>
    );
}
