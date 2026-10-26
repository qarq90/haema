import { NextResponse } from "next/server";
import { BLOOD_TYPES } from "@/constants/profile";
import pool from "@/lib/neon";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bloodType = searchParams.get("bloodType")?.trim() || "";
    const city = searchParams.get("city")?.trim() || null;
    const units = Number(searchParams.get("units") || 1);
    if (!BLOOD_TYPES.includes(bloodType) || !Number.isInteger(units) || units < 1) return NextResponse.json({ error: "Choose a valid blood type and quantity." }, { status: 400 });
    try {
        const [inventory, donors] = await Promise.all([
            pool.query(`SELECT camps.id, camps.name, camps.hospital, camps.city, inventory.units FROM blood_inventory inventory INNER JOIN camps ON camps.id = inventory.camp_id WHERE inventory.blood_type = $1 AND inventory.units >= $2 AND ($3::text IS NULL OR LOWER(camps.city) = LOWER($3)) ORDER BY inventory.units DESC LIMIT 25`, [bloodType, units, city]),
            pool.query(`SELECT COUNT(*)::integer AS count FROM blood_profiles WHERE blood_type = $1`, [bloodType]),
        ]);
        return NextResponse.json({ donors: Number(donors.rows[0]?.count ?? 0), bloodBanks: inventory.rows.map((row) => ({ ...row, units: Number(row.units) })) });
    } catch (error) {
        console.error("Failed to load blood availability:", error);
        return NextResponse.json({ error: "Could not load blood availability." }, { status: 500 });
    }
}
