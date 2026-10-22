import { notFound } from "next/navigation";
import pool from "@/lib/neon";
import type { Camp } from "@/types/donate";
import Client from "./client";

export default async function BookCampPage({
    params,
}: {
    params: Promise<{ camp: string }>;
}) {
    const { camp: campId } = await params;
    const result = await pool.query(
        `
            SELECT
                id,
                name,
                hospital,
                address,
                city,
                date,
                start_time AS "startTime",
                end_time AS "endTime",
                slots_total AS "slotsTotal",
                slots_left AS "slotsLeft",
                needs
            FROM camps
            WHERE id = $1 AND date >= CURRENT_DATE
        `,
        [campId],
    );

    const row = result.rows[0];
    if (!row) notFound();

    const camp: Camp = {
        id: row.id,
        name: row.name,
        hospital: row.hospital,
        address: row.address,
        city: row.city,
        date:
            typeof row.date === "string"
                ? row.date.slice(0, 10)
                : new Date(row.date).toISOString().slice(0, 10),
        startTime: String(row.startTime).slice(0, 5),
        endTime: String(row.endTime).slice(0, 5),
        slotsTotal: Number(row.slotsTotal),
        slotsLeft: Number(row.slotsLeft),
        needs: Array.isArray(row.needs) ? row.needs : [],
    };

    return (
        <main className="flex flex-col py-4 h-full max-w-[calc(100dvw-0%)] mx-64">
            <Client camp={camp} />
        </main>
    );
}
