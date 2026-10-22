import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";
import {
    ALLERGIES,
    BLOOD_TYPES,
    GENDERS,
    ILLNESSES,
    MEDICATIONS,
} from "@/constants/profile";

const profileSelect = `
    SELECT
        blood_type AS "bloodType",
        height_cm AS "heightCm",
        weight_kg AS "weightKg",
        date_of_birth AS "dateOfBirth",
        gender,
        last_donation AS "lastDonation",
        chronic_conditions AS "chronicConditions",
        medications,
        allergies,
        emergency_contact_name AS "emergencyContactName",
        emergency_contact_phone AS "emergencyContactPhone"
    FROM blood_profiles
    WHERE user_id = $1
`;

type BloodProfileInput = {
    bloodType: string;
    heightCm: string;
    weightKg: string;
    dateOfBirth: string;
    gender: string;
    lastDonation: string;
    chronicConditions: string[];
    medications: string[];
    allergies: string[];
    emergencyContactName: string;
    emergencyContactPhone: string;
};

class ProfileValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown, maxLength: number): string | null {
    if (value === "" || value === null || value === undefined) return null;
    if (typeof value !== "string" || value.trim().length > maxLength) {
        throw new ProfileValidationError("One or more profile fields are invalid.");
    }
    return value.trim();
}

function optionalDate(value: unknown): string | null {
    const date = optionalString(value, 10);
    if (!date) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new ProfileValidationError("Dates must use YYYY-MM-DD format.");
    }
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
        throw new ProfileValidationError("Please provide a valid date.");
    }
    return date;
}

function optionalMeasurement(
    value: unknown,
    min: number,
    max: number,
): number | null {
    if (value === "" || value === null || value === undefined) return null;
    const number = typeof value === "number" ? value : Number(value);
    if (!Number.isInteger(number) || number < min || number > max) {
        throw new ProfileValidationError(`Measurements must be between ${min} and ${max}.`);
    }
    return number;
}

function selectionArray(value: unknown, allowed: readonly string[]): string[] {
    if (!Array.isArray(value) || value.length > allowed.length) {
        throw new ProfileValidationError("One or more selections are invalid.");
    }
    if (!value.every((item): item is string => typeof item === "string" && allowed.includes(item))) {
        throw new ProfileValidationError("One or more selections are invalid.");
    }
    return [...new Set(value)];
}

function toProfile(row: Record<string, unknown> | undefined) {
    if (!row) return null;
    return {
        bloodType: row.bloodType ?? "",
        heightCm: row.heightCm === null ? "" : String(row.heightCm ?? ""),
        weightKg: row.weightKg === null ? "" : String(row.weightKg ?? ""),
        dateOfBirth: row.dateOfBirth ? String(row.dateOfBirth).slice(0, 10) : "",
        gender: row.gender ?? "",
        lastDonation: row.lastDonation ? String(row.lastDonation).slice(0, 10) : "",
        chronicConditions: row.chronicConditions ?? [],
        medications: row.medications ?? [],
        allergies: row.allergies ?? [],
        emergencyContactName: row.emergencyContactName ?? "",
        emergencyContactPhone: row.emergencyContactPhone ?? "",
    };
}

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await pool.query(profileSelect, [userId]);
        return NextResponse.json({ profile: toProfile(result.rows[0]) });
    } catch (error) {
        console.error("Failed to load blood profile:", error);
        return NextResponse.json(
            { error: "Failed to load blood profile" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        if (!isRecord(body)) {
            return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
        }

        const input: BloodProfileInput = {
            bloodType: optionalString(body.bloodType, 3) ?? "",
            heightCm: optionalString(body.heightCm, 3) ?? "",
            weightKg: optionalString(body.weightKg, 3) ?? "",
            dateOfBirth: optionalString(body.dateOfBirth, 10) ?? "",
            gender: optionalString(body.gender, 30) ?? "",
            lastDonation: optionalString(body.lastDonation, 10) ?? "",
            chronicConditions: selectionArray(body.chronicConditions, ILLNESSES),
            medications: selectionArray(body.medications, MEDICATIONS),
            allergies: selectionArray(body.allergies, ALLERGIES),
            emergencyContactName: optionalString(body.emergencyContactName, 120) ?? "",
            emergencyContactPhone: optionalString(body.emergencyContactPhone, 40) ?? "",
        };

        if (input.bloodType && !BLOOD_TYPES.includes(input.bloodType)) {
            throw new ProfileValidationError("Please select a valid blood type.");
        }
        if (input.gender && !GENDERS.includes(input.gender)) {
            throw new ProfileValidationError("Please select a valid gender.");
        }

        const values = [
            userId,
            input.bloodType || null,
            optionalMeasurement(input.heightCm, 100, 250),
            optionalMeasurement(input.weightKg, 30, 200),
            optionalDate(input.dateOfBirth),
            input.gender || null,
            optionalDate(input.lastDonation),
            input.chronicConditions,
            input.medications,
            input.allergies,
            input.emergencyContactName || null,
            input.emergencyContactPhone || null,
        ];

        await pool.query(
            `
                INSERT INTO blood_profiles (
                    user_id,
                    blood_type,
                    height_cm,
                    weight_kg,
                    date_of_birth,
                    gender,
                    last_donation,
                    chronic_conditions,
                    medications,
                    allergies,
                    emergency_contact_name,
                    emergency_contact_phone,
                    updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now())
                ON CONFLICT (user_id) DO UPDATE SET
                    blood_type = EXCLUDED.blood_type,
                    height_cm = EXCLUDED.height_cm,
                    weight_kg = EXCLUDED.weight_kg,
                    date_of_birth = EXCLUDED.date_of_birth,
                    gender = EXCLUDED.gender,
                    last_donation = EXCLUDED.last_donation,
                    chronic_conditions = EXCLUDED.chronic_conditions,
                    medications = EXCLUDED.medications,
                    allergies = EXCLUDED.allergies,
                    emergency_contact_name = EXCLUDED.emergency_contact_name,
                    emergency_contact_phone = EXCLUDED.emergency_contact_phone,
                    updated_at = now()
            `,
            values,
        );

        const result = await pool.query(profileSelect, [userId]);
        return NextResponse.json({ profile: toProfile(result.rows[0]) });
    } catch (error) {
        if (error instanceof ProfileValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error("Failed to save blood profile:", error);
        return NextResponse.json(
            { error: "Failed to save blood profile" },
            { status: 500 },
        );
    }
}
