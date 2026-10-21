"use client";

import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <main className="flex flex-col justify-center items-center py-4 h-dvh max-w-[calc(100dvw-16%)] pl-32 gap-8">
            <p className="text-6xl">
                <span className="text-theme font-bold uppercase">
                    Something
                </span>{" "}
                went wrong.
            </p>
            <div className="flex flex-row gap-8">
                <Button size="lg" onClick={() => window.location.reload()}>
                    Try again
                </Button>
                <Button onClick={() => window.history.back()} size="lg">
                    Go back{" "}
                </Button>{" "}
            </div>
        </main>
    );
}
