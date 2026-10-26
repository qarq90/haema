import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bloodType = searchParams.get("bloodType")?.trim() || null;
    try {
        const result = await pool.query(`SELECT id, blood_type AS "bloodType", previous_units AS "previousUnits", new_units AS "newUnits", updated_by AS "updatedBy", created_at AS "createdAt" FROM blood_inventory_history WHERE ($1::text IS NULL OR blood_type = $1) ORDER BY created_at DESC LIMIT 50`, [bloodType]);
        return NextResponse.json({ history: result.rows.map((row) => ({ ...row, createdAt: new Date(row.createdAt).toISOString() })) });
    } catch (error) {
        console.error("Failed to load inventory history:", error);
        return NextResponse.json({ error: "Could not load inventory history." }, { status: 500 });
    }
}
