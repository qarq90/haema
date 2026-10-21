import { ProfileProps } from "@/types/profile";
import { SignOutButton } from "@clerk/nextjs";
import { LuLogOut } from "react-icons/lu";
import { Button } from "../ui/button";

export function Profile({
    imageUrl,
    fullName,
    username,
    primaryEmail,
    externalAccounts,
    fields,
}: ProfileProps) {
    return (
        <section className="pt-24 sm:px-10 lg:pt-20">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Profile
                </h1>
                <SignOutButton>
                    <Button>
                        <LuLogOut className="h-5 w-5" />
                        Sign out
                    </Button>
                </SignOutButton>
            </div>

            <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-center">
                <img
                    src={imageUrl}
                    alt={fullName ?? "Avatar"}
                    className="h-28 w-28 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-800"
                />
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {fullName ?? username ?? "Unnamed user"}
                    </h2>
                    {username && (
                        <p className="text-sm text-neutral-500">@{username}</p>
                    )}
                    {primaryEmail && (
                        <p className="text-sm text-neutral-500">
                            {primaryEmail}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {fields.map((f) => (
                    <Detail
                        key={f.label}
                        label={f.label}
                        value={f.value}
                        mono={f.mono}
                    />
                ))}
            </div>

            {externalAccounts.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-lg font-semibold tracking-tight mb-4">
                        Connected account
                    </h3>
                    <div className="flex flex-col gap-2">
                        {externalAccounts.map((acc) => (
                            <div
                                key={acc.id}
                                className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3"
                            >
                                <span className="text-sm font-medium capitalize">
                                    {acc.provider}
                                </span>
                                <span className="text-sm text-neutral-500">
                                    {acc.emailAddress ?? acc.username ?? ""}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function Detail({
    label,
    value,
    mono = false,
}: {
    label: string;
    value?: string | null;
    mono?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3">
            <span className="text-xs uppercase tracking-wide text-neutral-500">
                {label}
            </span>
            <span
                className={`text-sm font-medium ${
                    mono ? "font-mono text-xs" : ""
                }`}
            >
                {value || "—"}
            </span>
        </div>
    );
}
