import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BLOOD_TYPES } from "@/constants/profile";
import pool from "@/lib/neon";

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to request a restock." }, { status: 401 });
    let body: { bloodType?: unknown; city?: unknown; unitsNeeded?: unknown; notes?: unknown } = {};
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    const bloodType = typeof body.bloodType === "string" ? body.bloodType : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const unitsNeeded = Number(body.unitsNeeded);
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : null;
    if (!BLOOD_TYPES.includes(bloodType) || city.length < 2 || city.length > 100 || !Number.isInteger(unitsNeeded) || unitsNeeded < 1 || unitsNeeded > 1000) {
        return NextResponse.json({ error: "Choose a blood type, city, and valid quantity." }, { status: 400 });
    }
    try {
        const result = await pool.query(`INSERT INTO inventory_restock_requests (user_id, blood_type, city, units_needed, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id, status`, [userId, bloodType, city, unitsNeeded, notes]);
        return NextResponse.json({ request: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Failed to create restock request:", error);
        return NextResponse.json({ error: "Could not submit the restock request." }, { status: 500 });
    }
}
