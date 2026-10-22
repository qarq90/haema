import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { EMAIL_RE, PHONE_RE } from "@/constants/common";
import { generateSlots } from "@/functions/booling";
import pool from "@/lib/neon";

type BookingInput = {
    campId: string;
    slot: string;
    fullName: string;
    phone: string;
    notes: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in to book a camp slot." }, { status: 401 });
    }

    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!user || user.id !== userId || !email || !EMAIL_RE.test(email)) {
            return NextResponse.json(
                { error: "Your account needs a valid email address to book." },
                { status: 400 },
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

        const input: BookingInput = {
            campId: typeof body.campId === "string" ? body.campId.trim() : "",
            slot: typeof body.slot === "string" ? body.slot.trim() : "",
            fullName: typeof body.fullName === "string" ? body.fullName.trim() : "",
            phone: typeof body.phone === "string" ? body.phone.trim() : "",
            notes: typeof body.notes === "string" ? body.notes.trim() : "",
        };

        if (!input.campId || input.campId.length > 160) {
            return NextResponse.json({ error: "Choose a valid camp." }, { status: 400 });
        }
        if (!/^\d{2}:\d{2}$/.test(input.slot)) {
            return NextResponse.json({ error: "Choose a valid time slot." }, { status: 400 });
        }
        if (input.fullName.length < 2 || input.fullName.length > 120) {
            return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
        }
        if (!PHONE_RE.test(input.phone)) {
            return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
        }
        if (input.notes.length > 1000) {
            return NextResponse.json({ error: "Notes must be under 1000 characters." }, { status: 400 });
        }

        const campResult = await pool.query(
            "SELECT id, start_time AS \"startTime\", end_time AS \"endTime\" FROM camps WHERE id = $1 AND date >= CURRENT_DATE",
            [input.campId],
        );
        const camp = campResult.rows[0];
        if (!camp) {
            return NextResponse.json({ error: "This camp is no longer available." }, { status: 404 });
        }

        const startTime = String(camp.startTime).slice(0, 5);
        const endTime = String(camp.endTime).slice(0, 5);
        if (!generateSlots(startTime, endTime).includes(input.slot)) {
            return NextResponse.json({ error: "Choose one of the available camp slots." }, { status: 400 });
        }

        const bookingResult = await pool.query(
            `
                WITH available_camp AS (
                    UPDATE camps
                    SET slots_left = slots_left - 1
                    WHERE id = $1
                        AND date >= CURRENT_DATE
                        AND slots_left > 0
                        AND start_time <= $2::time
                        AND end_time >= $2::time + interval '30 minutes'
                        AND mod(
                            extract(epoch FROM ($2::time - start_time))::integer,
                            1800
                        ) = 0
                    RETURNING id
                )
                INSERT INTO camp_bookings (
                    camp_id,
                    user_id,
                    slot,
                    full_name,
                    email,
                    phone,
                    notes,
                    status
                )
                SELECT $1, $3, $2::time, $4, $5, $6, $7, 'confirmed'
                FROM available_camp
                RETURNING id, slot, status
            `,
            [
                input.campId,
                input.slot,
                userId,
                input.fullName,
                email,
                input.phone,
                input.notes,
            ],
        );

        const booking = bookingResult.rows[0];
        if (!booking) {
            return NextResponse.json(
                { error: "This camp has no remaining slots. Please choose another camp." },
                { status: 409 },
            );
        }

        return NextResponse.json(
            {
                booking: {
                    id: booking.id,
                    slot: String(booking.slot).slice(0, 5),
                    status: booking.status,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to book camp slot:", error);
        return NextResponse.json(
            { error: "Could not complete your booking. Please try again." },
            { status: 500 },
        );
    }
}
