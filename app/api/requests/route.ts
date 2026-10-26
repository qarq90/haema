import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";
import { BLOOD_TYPES } from "@/constants/profile";

type RequestRow = {
    id: string;
    patientName: string;
    bloodType: string;
    unitsNeeded: number;
    urgency: string;
    status: string;
    hospital: string;
    city: string;
    reason: string | null;
    neededBy: Date | string | null;
    notes: string | null;
    createdAt: Date | string;
    responseCount: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatDate(value: Date | string | null) {
    return value ? new Date(value).toISOString() : null;
}

export async function GET() {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const result = await pool.query<RequestRow>(
            `SELECT id, patient_name AS "patientName", blood_type AS "bloodType",
                    units_needed AS "unitsNeeded", urgency, status, hospital, city,
                    reason, needed_by AS "neededBy", notes, created_at AS "createdAt",
                    (SELECT COUNT(*) FROM request_responses responses WHERE responses.request_id = requests.id)::integer AS "responseCount"
             FROM requests WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId],
        );
        return NextResponse.json({
            requests: result.rows.map((row) => ({
                ...row,
                status: row.status === "matched" ? "approved" : row.status,
                unitsNeeded: Number(row.unitsNeeded),
                responseCount: Number(row.responseCount),
                neededBy: formatDate(row.neededBy),
                createdAt: formatDate(row.createdAt),
            })),
        });
    } catch (error) {
        console.error("Failed to load blood requests:", error);
        return NextResponse.json(
            { error: "Could not load your blood requests." },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json(
            { error: "Sign in to request blood." },
            { status: 401 },
        );

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 },
        );
    }
    if (!isRecord(body))
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 },
        );

    const patientName =
        typeof body.patientName === "string" ? body.patientName.trim() : "";
    const bloodType = typeof body.bloodType === "string" ? body.bloodType : "";
    const unitsNeeded = Number(body.unitsNeeded);
    const urgency =
        body.urgency === "critical"
            ? "critical"
            : body.urgency === "high" || body.urgency === "urgent"
              ? "high"
              : "normal";
    const hospital =
        typeof body.hospital === "string" ? body.hospital.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const reason = typeof body.reason === "string" ? body.reason.trim() : null;
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;
    const neededBy =
        typeof body.neededBy === "string" && body.neededBy
            ? body.neededBy
            : null;
    const user = await currentUser();
    const contactName =
        typeof body.contactName === "string"
            ? body.contactName.trim()
            : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const contactPhone =
        typeof body.contactPhone === "string"
            ? body.contactPhone.trim()
            : (user?.primaryPhoneNumber?.phoneNumber ?? "");
    const contactEmail =
        typeof body.contactEmail === "string"
            ? body.contactEmail.trim()
            : (user?.primaryEmailAddress?.emailAddress ?? "");

    if (
        !patientName ||
        patientName.length > 160 ||
        !BLOOD_TYPES.includes(bloodType) ||
        !Number.isInteger(unitsNeeded) ||
        unitsNeeded < 1 ||
        unitsNeeded > 1000 ||
        !hospital ||
        !city ||
        !contactName ||
        !contactPhone ||
        !contactEmail
    ) {
        return NextResponse.json(
            { error: "Complete all required request details." },
            { status: 400 },
        );
    }
    if (neededBy && Number.isNaN(new Date(neededBy).getTime()))
        return NextResponse.json(
            { error: "Choose a valid needed-by date." },
            { status: 400 },
        );

    try {
        const result = await pool.query<{ id: string }>(
            `INSERT INTO requests (user_id, patient_name, blood_type, units_needed, urgency, hospital, city, contact_name, contact_phone, contact_email, reason, needed_by, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
            [
                userId,
                patientName,
                bloodType,
                unitsNeeded,
                urgency,
                hospital,
                city,
                contactName,
                contactPhone,
                contactEmail,
                reason || null,
                neededBy,
                notes || null,
            ],
        );
        return NextResponse.json(
            { requestId: result.rows[0].id },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to create blood request:", error);
        if (isMissingRequestSchemaError(error)) {
            return NextResponse.json(
                {
                    error: "The blood request database tables are not initialized. Apply migration 005-blood-requests-and-responses.sql first.",
                },
                { status: 503 },
            );
        }
        return NextResponse.json(
            { error: "Could not create the blood request." },
            { status: 500 },
        );
    }
}

function isMissingRequestSchemaError(error: unknown): boolean {
    return isRecord(error) && error.code === "42P01";
}
