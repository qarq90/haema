import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/neon";
import { BLOOD_TYPES } from "@/constants/profile";
import { getVerifiedHospital } from "@/functions/auth/verified-hospital";

type RequestRow = {
    id: string;
    hospitalName: string;
    bloodType: string;
    city: string;
    units: number;
    neededBy: Date | string | null;
    status: string;
    createdAt: Date | string;
    patientName: string | null;
    source: "request" | "hospital";
    responseStatus: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

export async function GET(request: Request) {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim() || null;
    const bloodType = searchParams.get("bloodType")?.trim() || null;

    if (city && city.length > 100) {
        return NextResponse.json(
            { error: "City name is too long." },
            { status: 400 },
        );
    }
    if (bloodType && !BLOOD_TYPES.includes(bloodType)) {
        return NextResponse.json(
            { error: "Choose a valid blood type." },
            { status: 400 },
        );
    }

    try {
        const [requestsResult, citiesResult] = await Promise.all([
            pool.query<RequestRow>(
                `
                    SELECT
                        requests.id,
                        requests.hospital AS "hospitalName",
                        requests.blood_type AS "bloodType",
                        requests.city,
                        requests.units_needed AS units,
                        requests.needed_by AS "neededBy",
                        INITCAP(requests.status) AS status,
                        requests.created_at AS "createdAt",
                        requests.patient_name AS "patientName",
                        'request'::text AS source,
                        responses.status AS "responseStatus"
                    FROM requests requests
                    LEFT JOIN request_responses responses
                        ON responses.request_id = requests.id AND responses.donor_user_id = $3
                    WHERE requests.status = 'pending'
                        AND ($1::text IS NULL OR LOWER(requests.city) = LOWER($1))
                        AND ($2::text IS NULL OR requests.blood_type = $2)
                    ORDER BY "neededBy", "createdAt" DESC
                    LIMIT 100
                `,
                [city, bloodType, userId],
            ),
            pool.query<{ city: string }>(`
                SELECT DISTINCT city
                FROM requests
                WHERE status = 'pending'
                ORDER BY city
            `),
        ]);

        const requests = requestsResult.rows.map((row) => ({
            id: row.id,
            hospitalName: row.hospitalName,
            bloodType: row.bloodType,
            city: row.city,
            units: Number(row.units),
            neededBy: row.neededBy
                ? typeof row.neededBy === "string"
                    ? row.neededBy.slice(0, 10)
                    : row.neededBy.toISOString().slice(0, 10)
                : null,
            status: row.status,
            createdAt: new Date(row.createdAt).toISOString(),
            patientName: row.patientName,
            source: row.source,
            responseStatus: row.responseStatus,
        }));

        return NextResponse.json({
            requests,
            cities: citiesResult.rows.map((row) => row.city),
        });
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
            {
                error: "A verified hospital account is required to post a need.",
            },
            { status: 403 },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 },
        );
    }
    if (!isRecord(body)) {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 },
        );
    }

    const bloodType = typeof body.bloodType === "string" ? body.bloodType : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const units =
        typeof body.units === "number" ? body.units : Number(body.units);
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    const neededBy = typeof body.neededBy === "string" ? body.neededBy : "";

    if (!BLOOD_TYPES.includes(bloodType)) {
        return NextResponse.json(
            { error: "Choose a valid blood type." },
            { status: 400 },
        );
    }
    if (city.length < 2 || city.length > 100) {
        return NextResponse.json(
            { error: "Enter a valid city." },
            { status: 400 },
        );
    }
    if (!Number.isInteger(units) || units < 1 || units > 1000) {
        return NextResponse.json(
            { error: "Units must be between 1 and 1000." },
            { status: 400 },
        );
    }
    if (reason.length < 5 || reason.length > 500) {
        return NextResponse.json(
            { error: "Provide a reason between 5 and 500 characters." },
            { status: 400 },
        );
    }
    if (!isValidDate(neededBy)) {
        return NextResponse.json(
            { error: "Choose a valid needed-by date." },
            { status: 400 },
        );
    }
    if (!hospital.contactEmail) {
        return NextResponse.json(
            { error: "A verified hospital email address is required." },
            { status: 400 },
        );
    }

    try {
        const result = await pool.query<{ id: string }>(
            `
                INSERT INTO requests (
                    user_id,
                    patient_name,
                    blood_type,
                    units_needed,
                    urgency,
                    hospital,
                    city,
                    contact_name,
                    contact_phone,
                    contact_email,
                    reason,
                    needed_by
                )
                SELECT $1, $2, $3, $4, 'high', $2, $5, $2, $6, $7, $8, $9::date
                WHERE $7::date >= CURRENT_DATE
                RETURNING id
            `,
            [
                hospital.userId,
                hospital.hospitalName,
                bloodType,
                units,
                city,
                hospital.contactPhone,
                hospital.contactEmail,
                reason,
                neededBy,
            ],
        );

        if (!result.rows[0]) {
            return NextResponse.json(
                { error: "Needed-by date must be today or later." },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { requestId: result.rows[0].id },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create hospital blood request:", error);
        return NextResponse.json(
            { error: "Could not create the blood request." },
            { status: 500 },
        );
    }
}
