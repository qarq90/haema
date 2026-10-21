import { BookingForm } from "@/components/donate/booking-form";
import { CampSummary } from "@/components/donate/camp-summary";
import type { Camp } from "@/types/donate";

export default function Client({ camp }: { camp: Camp }) {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Book a slot.
                    <br />
                    <span className="text-red-500">Save a life.</span>
                </h1>
                <p className="my-8 max-w-2xl text-lg leading-8 text-foreground/75">
                    Pick a time that works for you, confirm your details, and
                    we'll send you a confirmation. The whole thing takes about
                    30 minutes.
                </p>
            </section>
            <section className="sm:px-10 max-w-7xl pb-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
                    <BookingForm camp={camp} />
                    <CampSummary camp={camp} />
                </div>
            </section>
        </main>
    );
}
