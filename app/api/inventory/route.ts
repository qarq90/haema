import { NextResponse } from "next/server";
import { BLOOD_TYPES } from "@/constants/profile";
import pool from "@/lib/neon";

type InventoryRow = {
    bloodType: string;
    units: number;
    locationCount: number;
    lastUpdated: Date | string | null;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim() || null;

    if (city && city.length > 100) {
        return NextResponse.json(
            { error: "City name is too long." },
            { status: 400 },
        );
    }

    try {
        const [inventoryResult, citiesResult, locationResult] =
            await Promise.all([
                pool.query<InventoryRow>(
                    `
                    WITH blood_types("bloodType") AS (
                        SELECT unnest($2::text[])
                    ), stock AS (
                        SELECT
                            inventory.blood_type AS "bloodType",
                            SUM(inventory.units)::integer AS units,
                            COUNT(DISTINCT inventory.camp_id)::integer AS "locationCount",
                            MAX(inventory.updated_at) AS "lastUpdated"
                        FROM blood_inventory inventory
                        INNER JOIN camps ON camps.id = inventory.camp_id
                        WHERE ($1::text IS NULL OR LOWER(camps.city) = LOWER($1))
                        GROUP BY inventory.blood_type
                    )
                    SELECT
                        blood_types."bloodType",
                        COALESCE(stock.units, 0)::integer AS units,
                        COALESCE(stock."locationCount", 0)::integer AS "locationCount",
                        stock."lastUpdated"
                    FROM blood_types
                    LEFT JOIN stock ON stock."bloodType" = blood_types."bloodType"
                    ORDER BY array_position($2::text[], blood_types."bloodType")
                `,
                    [city, BLOOD_TYPES],
                ),
                pool.query<{ city: string }>(`
                SELECT DISTINCT camps.city
                FROM blood_inventory inventory
                INNER JOIN camps ON camps.id = inventory.camp_id
                WHERE camps.city IS NOT NULL AND camps.city <> ''
                ORDER BY camps.city
            `),
                pool.query<{ locationCount: number }>(
                    `
                    SELECT COUNT(DISTINCT inventory.camp_id)::integer AS "locationCount"
                    FROM blood_inventory inventory
                    INNER JOIN camps ON camps.id = inventory.camp_id
                    WHERE ($1::text IS NULL OR LOWER(camps.city) = LOWER($1))
                `,
                    [city],
                ),
            ]);

        const inventory = inventoryResult.rows.map((row) => ({
            bloodType: row.bloodType,
            units: Number(row.units),
            locationCount: Number(row.locationCount),
            lastUpdated: row.lastUpdated
                ? new Date(row.lastUpdated).toISOString()
                : null,
        }));

        return NextResponse.json({
            inventory,
            cities: citiesResult.rows.map((row) => row.city),
            locationCount: Number(locationResult.rows[0]?.locationCount ?? 0),
        });
    } catch (error) {
        console.error("Failed to load blood inventory:", error);
        return NextResponse.json(
            { error: "Failed to load blood inventory." },
            { status: 500 },
        );
    }
}
