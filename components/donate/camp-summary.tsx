import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { LuMapPin, LuCalendar, LuClock, LuDroplet } from "react-icons/lu";
import { Row } from "../ui/row";

type Camp = {
    id: string;
    name: string;
    hospital: string;
    address: string;
    city: string;
    date: string;
    startTime: string;
    endTime: string;
    slotsTotal: number;
    slotsLeft: number;
    needs: string[];
};

export function CampSummary({ camp }: { camp: Camp }) {
    return (
        <aside className="lg:sticky lg:top-24 h-fit rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        {camp.name}
                    </h2>
                    <p className="text-xs text-neutral-500">{camp.hospital}</p>
                </div>
                <span className="shrink-0 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500">
                    {camp.slotsLeft} left
                </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm">
                <Row icon={<LuMapPin />}>{camp.address}</Row>
                <Row icon={<LuCalendar />}>{formatDate(camp.date)}</Row>
                <Row icon={<LuClock />}>
                    {camp.startTime} – {camp.endTime}
                </Row>
                <Row icon={<LuDroplet />}>
                    Needs: {camp.needs.join(", ") || "All types"}
                </Row>
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
                <p className="text-xs leading-5 text-neutral-500">
                    You can cancel or reschedule up to 24 hours before your
                    slot. Bring a valid ID and make sure you've eaten something
                    beforehand.
                </p>
            </div>

            <Link
                href={`/camps/${camp.id}`}
                className="mt-4 inline-block text-xs font-semibold text-red-500 hover:underline"
            >
                Back to camp details
            </Link>
        </aside>
    );
}
