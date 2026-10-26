import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function GET() {
    try {
        const [stats, requests] = await Promise.all([
            pool.query(`SELECT (SELECT COUNT(*) FROM "users")::integer AS donors, (SELECT COUNT(*) FROM requests WHERE status = 'fulfilled')::integer AS fulfilled, (SELECT COUNT(*) FROM camps WHERE date >= CURRENT_DATE)::integer AS camps`),
            pool.query(`SELECT id, blood_type AS "bloodType", units_needed AS units, city, urgency FROM requests WHERE status = 'pending' ORDER BY CASE urgency WHEN 'critical' THEN 0 WHEN 'high' THEN 1 ELSE 2 END, created_at DESC LIMIT 5`),
        ]);
        return NextResponse.json({ stats: stats.rows[0], requests: requests.rows.map((row) => ({ ...row, units: Number(row.units) })) });
    } catch (error) {
        console.error("Failed to load home data:", error);
        return NextResponse.json({ error: "Could not load home data." }, { status: 500 });
    }
}
