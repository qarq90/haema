import { NextResponse } from "next/server";
import pool from "@/lib/neon";
import { BLOOD_TYPES } from "@/constants/profile";
import { getVerifiedHospital } from "@/lib/auth/verified-hospital";

type RequestRow = {
    id: string;
    hospitalName: string;
    bloodType: string;
    city: string;
    units: number;
    neededBy: Date | string;
    status: string;
    createdAt: Date | string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim() || null;
    const bloodType = searchParams.get("bloodType")?.trim() || null;

    if (city && city.length > 100) {
        return NextResponse.json({ error: "City name is too long." }, { status: 400 });
    }
    if (bloodType && !BLOOD_TYPES.includes(bloodType)) {
        return NextResponse.json({ error: "Choose a valid blood type." }, { status: 400 });
    }

    try {
        const [requestsResult, citiesResult] = await Promise.all([
            pool.query<RequestRow>(
                `
                    SELECT
                        id,
                        hospital_name AS "hospitalName",
                        blood_type AS "bloodType",
                        city,
                        units,
                        needed_by AS "neededBy",
                        status,
                        created_at AS "createdAt"
                    FROM hospital_blood_requests
                    WHERE status IN ('Pending', 'Approved')
                        AND needed_by >= CURRENT_DATE
                        AND ($1::text IS NULL OR LOWER(city) = LOWER($1))
                        AND ($2::text IS NULL OR blood_type = $2)
                    ORDER BY needed_by, created_at DESC
                    LIMIT 100
                `,
                [city, bloodType],
            ),
            pool.query<{ city: string }>(`
                SELECT DISTINCT city
                FROM hospital_blood_requests
                WHERE status IN ('Pending', 'Approved')
                    AND needed_by >= CURRENT_DATE
                ORDER BY city
            `),
        ]);

        const requests = requestsResult.rows.map((row) => ({
            id: row.id,
            hospitalName: row.hospitalName,
            bloodType: row.bloodType,
            city: row.city,
            units: Number(row.units),
            neededBy:
                typeof row.neededBy === "string"
                    ? row.neededBy.slice(0, 10)
                    : row.neededBy.toISOString().slice(0, 10),
            status: row.status,
            createdAt: new Date(row.createdAt).toISOString(),
        }));

        return NextResponse.json({ requests, cities: citiesResult.rows.map((row) => row.city) });
    } catch (error) {
        console.error("Failed to load emergency blood requests:", error);
        return NextResponse.json(
            { error: "Could not load emergency blood requests." },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const hospital = await getVerifiedHospital();
    if (!hospital) {
        return NextResponse.json(
            { error: "A verified hospital account is required to post a need." },
            { status: 403 },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    if (!isRecord(body)) {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const bloodType = typeof body.bloodType === "string" ? body.bloodType : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const units = typeof body.units === "number" ? body.units : Number(body.units);
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    const neededBy = typeof body.neededBy === "string" ? body.neededBy : "";

    if (!BLOOD_TYPES.includes(bloodType)) {
        return NextResponse.json({ error: "Choose a valid blood type." }, { status: 400 });
    }
    if (city.length < 2 || city.length > 100) {
        return NextResponse.json({ error: "Enter a valid city." }, { status: 400 });
    }
    if (!Number.isInteger(units) || units < 1 || units > 1000) {
        return NextResponse.json({ error: "Units must be between 1 and 1000." }, { status: 400 });
    }
    if (reason.length < 5 || reason.length > 500) {
        return NextResponse.json({ error: "Provide a reason between 5 and 500 characters." }, { status: 400 });
    }
    if (!isValidDate(neededBy)) {
        return NextResponse.json({ error: "Choose a valid needed-by date." }, { status: 400 });
    }

    try {
        const result = await pool.query<{ id: string }>(
            `
                INSERT INTO hospital_blood_requests (
                    user_id,
                    hospital_name,
                    blood_type,
                    city,
                    units,
                    reason,
                    needed_by
                )
                SELECT $1, $2, $3, $4, $5, $6, $7::date
                WHERE $7::date >= CURRENT_DATE
                RETURNING id
            `,
            [hospital.userId, hospital.hospitalName, bloodType, city, units, reason, neededBy],
        );

        if (!result.rows[0]) {
            return NextResponse.json(
                { error: "Needed-by date must be today or later." },
                { status: 400 },
            );
        }

        return NextResponse.json({ requestId: result.rows[0].id }, { status: 201 });
    } catch (error) {
        console.error("Failed to create hospital blood request:", error);
        return NextResponse.json(
            { error: "Could not create the blood request." },
            { status: 500 },
        );
    }
}
