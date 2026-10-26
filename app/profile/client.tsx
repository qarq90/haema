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
    const [donationCount, setDonationCount] = useState(0);
    const [requestCount, setRequestCount] = useState(0);
    const [savedArticleCount, setSavedArticleCount] = useState(0);
    const [deactivateMessage, setDeactivateMessage] = useState<string | null>(null);
    const [documentMessage, setDocumentMessage] = useState<string | null>(null);
    const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [changingPassword, setChangingPassword] = useState(false);
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

        void Promise.all([fetch("/api/donations"), fetch("/api/requests"), fetch("/api/articles/saved")]).then(async ([donations, requests, articles]) => {
            if (donations.ok) setDonationCount(((await donations.json()).appointments ?? []).length);
            if (requests.ok) setRequestCount(((await requests.json()).requests ?? []).length);
            if (articles.ok) setSavedArticleCount(((await articles.json()).articles ?? []).length);
        });

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

    async function deactivateAccount() {
        if (!user) return;
        if (!window.confirm("Deactivate your account? This action cannot be undone from the app.")) return;
        try {
            await user.delete();
            setDeactivateMessage("Your account has been deactivated.");
        } catch {
            setDeactivateMessage("Could not deactivate your account. Please try again.");
        }
    }

    async function uploadDocument(kind: "photo" | "id_proof", file: File | undefined) {
        if (!file) return;
        setUploadingDocument(kind);
        setDocumentMessage(null);
        const form = new FormData();
        form.set("kind", kind);
        form.set("file", file);
        const response = await fetch("/api/profile/documents", { method: "POST", body: form }).catch(() => null);
        const result: { error?: string } = response ? await response.json() : {};
        setDocumentMessage(response?.ok ? `${kind === "photo" ? "Photo" : "ID proof"} uploaded.` : result.error ?? "Could not upload the document.");
        setUploadingDocument(null);
    }

    async function changePassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user || newPassword.length < 8) {
            setPasswordMessage("Use a new password with at least 8 characters.");
            return;
        }
        setChangingPassword(true);
        setPasswordMessage(null);
        try {
            await user.updatePassword({ currentPassword, newPassword, signOutOfOtherSessions: true });
            setCurrentPassword("");
            setNewPassword("");
            setPasswordMessage("Password changed successfully.");
        } catch (error) {
            setPasswordMessage(error instanceof Error ? error.message : "Could not change your password.");
        } finally {
            setChangingPassword(false);
        }
    }

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

            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-3 sm:px-10">
                <div className="rounded-xl border border-foreground/10 p-5"><p className="text-2xl font-bold">{donationCount}</p><p className="mt-1 text-sm text-foreground/55">Donation appointments</p></div>
                <div className="rounded-xl border border-foreground/10 p-5"><p className="text-2xl font-bold">{requestCount}</p><p className="mt-1 text-sm text-foreground/55">Blood requests</p></div>
                <div className="rounded-xl border border-foreground/10 p-5"><p className="text-2xl font-bold">{savedArticleCount}</p><p className="mt-1 text-sm text-foreground/55">Saved articles</p></div>
            </section>
            <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-10">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                    <h2 className="font-semibold">Account settings</h2>
                    <form onSubmit={changePassword} className="mt-4 grid max-w-xl gap-3 sm:grid-cols-2">
                        <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" required className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 text-sm" />
                        <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password" minLength={8} required className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 text-sm" />
                        <button type="submit" disabled={changingPassword} className="rounded-lg bg-theme px-4 py-2 text-sm font-semibold text-white sm:w-fit">{changingPassword ? "Changing…" : "Change password"}</button>
                    </form>
                    {passwordMessage && <p role="status" className="mt-3 text-sm text-foreground/70">{passwordMessage}</p>}
                    <button type="button" onClick={() => void deactivateAccount()} className="mt-4 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">Deactivate account</button>
                    {deactivateMessage && <p role="status" className="mt-3 text-sm text-foreground/70">{deactivateMessage}</p>}
                </div>
            </section>
            <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-10">
                <div className="rounded-xl border border-foreground/10 p-6">
                    <h2 className="font-semibold">Donor registration documents</h2>
                    <p className="mt-2 text-sm text-foreground/60">Upload a profile photo and identity proof. Files are limited to 5 MB.</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm font-medium">Profile photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void uploadDocument("photo", event.target.files?.[0])} disabled={uploadingDocument !== null} className="rounded-lg border border-foreground/15 p-3 text-sm" /></label>
                        <label className="flex flex-col gap-2 text-sm font-medium">ID proof<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => void uploadDocument("id_proof", event.target.files?.[0])} disabled={uploadingDocument !== null} className="rounded-lg border border-foreground/15 p-3 text-sm" /></label>
                    </div>
                    {uploadingDocument && <p role="status" className="mt-3 text-sm text-foreground/60">Uploading…</p>}
                    {documentMessage && <p role="status" className="mt-3 text-sm text-theme">{documentMessage}</p>}
                </div>
            </section>
        </>
    );
}
