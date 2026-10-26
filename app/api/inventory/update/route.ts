import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BLOOD_TYPES } from "@/constants/profile";
import pool from "@/lib/neon";

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let body: { campId?: unknown; bloodType?: unknown; units?: unknown } = {};
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    const campId = typeof body.campId === "string" ? body.campId : "";
    const bloodType = typeof body.bloodType === "string" ? body.bloodType : "";
    const units = Number(body.units);
    if (!campId || !BLOOD_TYPES.includes(bloodType) || !Number.isInteger(units) || units < 0 || units > 100000) return NextResponse.json({ error: "Choose a valid camp, blood type, and stock count." }, { status: 400 });
    try {
        const current = await pool.query(`SELECT id, units FROM blood_inventory WHERE camp_id = $1 AND blood_type = $2`, [campId, bloodType]);
        const previousUnits = Number(current.rows[0]?.units ?? 0);
        const result = await pool.query(`INSERT INTO blood_inventory (camp_id, blood_type, units) VALUES ($1, $2, $3) ON CONFLICT (camp_id, blood_type) DO UPDATE SET units = EXCLUDED.units, updated_at = now() RETURNING id`, [campId, bloodType, units]);
        await pool.query(`INSERT INTO blood_inventory_history (inventory_id, camp_id, blood_type, previous_units, new_units, updated_by) VALUES ($1, $2, $3, $4, $5, $6)`, [result.rows[0].id, campId, bloodType, previousUnits, units, userId]);
        return NextResponse.json({ updated: true });
    } catch (error) {
        console.error("Failed to update inventory:", error);
        return NextResponse.json({ error: "Could not update inventory." }, { status: 500 });
    }
}
