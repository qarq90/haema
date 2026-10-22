"use client";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { Profile } from "@/components/profile/details";
import { BloodProfile, ProfileField } from "@/types/profile";
import { BloodProfileForm } from "@/components/profile/blood-profile";
import { useEffect, useState } from "react";

export default function Client() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [blood, setBlood] = useState<BloodProfile | null>(null);
    const [bloodLoaded, setBloodLoaded] = useState(false);
    const [bloodLoadError, setBloodLoadError] = useState<string | null>(null);
    const userId = user?.id;

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userId) return;

        let cancelled = false;
        setBloodLoaded(false);
        setBloodLoadError(null);

        const loadBloodProfile = async () => {
            try {
                const response = await fetch("/api/profile/blood");
                const result: {
                    profile?: BloodProfile | null;
                    error?: string;
                } = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "Could not load profile");
                }

                if (!cancelled) setBlood(result.profile ?? null);
            } catch (error) {
                if (!cancelled) {
                    setBloodLoadError(
                        error instanceof Error
                            ? error.message
                            : "Could not load your blood profile.",
                    );
                }
            } finally {
                if (!cancelled) setBloodLoaded(true);
            }
        };

        void loadBloodProfile();

        return () => {
            cancelled = true;
        };
    }, [isLoaded, isSignedIn, userId]);

    if (!isLoaded) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Loading…</p>
            </main>
        );
    }

    if (!isSignedIn || !user) {
        return (
            <RedirectToSignIn />
        );
    }

    if (!bloodLoaded) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Loading blood profile…</p>
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

            {bloodLoadError ? (
                <p role="alert" className="px-10 pt-8 text-sm text-destructive">
                    Could not load your blood profile: {bloodLoadError}. Refresh
                    the page and try again.
                </p>
            ) : (
                <BloodProfileForm
                    key={blood ? "saved-profile" : "new-profile"}
                    initial={blood ?? undefined}
                    onSave={async (data) => {
                        const response = await fetch("/api/profile/blood", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data),
                        });
                        const result: {
                            profile?: BloodProfile;
                            error?: string;
                        } = await response.json();

                        if (!response.ok || !result.profile) {
                            throw new Error(
                                result.error ?? "Could not save your profile.",
                            );
                        }
                        setBlood(result.profile);
                    }}
                />
            )}
        </>
    );
}
