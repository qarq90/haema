import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const result = await pool.query(`SELECT id, appointment_date AS "appointmentDate", appointment_time AS "appointmentTime", center, status, created_at AS "createdAt" FROM donation_appointments WHERE user_id = $1 ORDER BY appointment_date DESC, appointment_time DESC`, [userId]);
        return NextResponse.json({ appointments: result.rows.map((row) => ({ ...row, appointmentDate: String(row.appointmentDate).slice(0, 10), appointmentTime: String(row.appointmentTime).slice(0, 5), createdAt: new Date(row.createdAt).toISOString() })) });
    } catch (error) {
        console.error("Failed to load donation history:", error);
        return NextResponse.json({ error: "Could not load donation history." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to schedule a donation." }, { status: 401 });
    let body: unknown;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    if (!isRecord(body)) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    const appointmentDate = typeof body.appointmentDate === "string" ? body.appointmentDate : "";
    const appointmentTime = typeof body.appointmentTime === "string" ? body.appointmentTime : "";
    const center = typeof body.center === "string" ? body.center.trim() : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) || !/^\d{2}:\d{2}$/.test(appointmentTime) || center.length < 2 || center.length > 200) {
        return NextResponse.json({ error: "Choose a valid date, time, and donation center." }, { status: 400 });
    }
    try {
        const result = await pool.query(`INSERT INTO donation_appointments (user_id, appointment_date, appointment_time, center) VALUES ($1, $2, $3, $4) RETURNING id, appointment_date AS "appointmentDate", appointment_time AS "appointmentTime", center, status`, [userId, appointmentDate, appointmentTime, center]);
        return NextResponse.json({ appointment: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Failed to schedule donation:", error);
        return NextResponse.json({ error: "Could not schedule your donation." }, { status: 500 });
    }
}
