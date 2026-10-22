import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                hospital,
                address,
                city,
                date,
                (date < CURRENT_DATE) AS "isPast",
                start_time AS "startTime",
                end_time AS "endTime",
                slots_total AS "slotsTotal",
                slots_left AS "slotsLeft",
                needs
            FROM camps
            ORDER BY date DESC, start_time
        `);

        const camps = result.rows.map((row) => ({
            ...row,
            date:
                typeof row.date === "string"
                    ? row.date.slice(0, 10)
                    : new Date(row.date).toISOString().slice(0, 10),
            startTime: String(row.startTime).slice(0, 5),
            endTime: String(row.endTime).slice(0, 5),
            slotsTotal: Number(row.slotsTotal),
            slotsLeft: Number(row.slotsLeft),
            needs: Array.isArray(row.needs) ? row.needs : [],
        }));

        return NextResponse.json({ camps });
    } catch (error) {
        console.error("Failed to load camps:", error);
        return NextResponse.json(
            { error: "Failed to load camps" },
            { status: 500 },
        );
    }
}
