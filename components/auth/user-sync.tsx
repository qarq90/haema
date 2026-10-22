"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export function UserSync() {
    const { isLoaded, isSignedIn, user } = useUser();
    const syncedUserId = useRef<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn || !user?.id) {
            syncedUserId.current = null;
            return;
        }
        if (syncedUserId.current === user.id) return;

        let cancelled = false;
        const syncUser = async () => {
            try {
                const response = await fetch("/api/users/sync", {
                    method: "POST",
                });
                const result: { error?: string } = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "User sync failed");
                }

                if (!cancelled) syncedUserId.current = user.id;
            } catch (error) {
                console.error("Failed to sync user to Neon:", error);
            }
        };

        void syncUser();

        return () => {
            cancelled = true;
        };
    }, [isLoaded, isSignedIn, user?.id]);

    return null;
}
