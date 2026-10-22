import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { LuMapPin, LuCalendar, LuClock, LuDroplet } from "react-icons/lu";
import { Button } from "../ui/button";
import { Row } from "../ui/row";
import { Camp } from "@/types/donate";

export function CampCard({ camp }: { camp: Camp }) {
    const low = camp.slotsLeft <= 10;
    const full = camp.slotsLeft === 0;
    const past = camp.isPast ?? false;

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-5 transition hover:border-red-500/40 dark:border-neutral-800">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">
                    {camp.name}
                </h3>
                <p className="text-xs text-neutral-500">{camp.hospital}</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
                <Row icon={<LuMapPin />}>{camp.address}</Row>
                <Row icon={<LuCalendar />}>{formatDate(camp.date)}</Row>
                <Row icon={<LuClock />}>
                    {camp.startTime} – {camp.endTime}
                </Row>
                <Row icon={<LuDroplet />}>
                    Needs: {camp.needs.join(", ") || "All types"}
                </Row>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                        past || full
                            ? "text-neutral-400"
                            : low
                              ? "text-red-500"
                              : "text-neutral-500"
                    }`}
                >
                    {past
                        ? "Past camp"
                        : full
                        ? "Full"
                        : `${camp.slotsLeft} of ${camp.slotsTotal} left`}
                </span>

                {past || full ? (
                    <Button disabled>{past ? "Past" : "Full"}</Button>
                ) : (
                    <Link href={`/camps/${encodeURIComponent(camp.id)}/book`}>
                        <Button>Book a Slot</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
