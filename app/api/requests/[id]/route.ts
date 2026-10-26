import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    let body: { status?: unknown } = {};
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    const requestedStatus = body.status;
    if (requestedStatus !== "pending" && requestedStatus !== "approved" && requestedStatus !== "fulfilled" && requestedStatus !== "rejected") return NextResponse.json({ error: "Choose a valid request status." }, { status: 400 });
    const status = requestedStatus === "approved" ? "matched" : requestedStatus === "rejected" ? "cancelled" : requestedStatus;
    try {
        const result = await pool.query(`UPDATE requests SET status = $1, updated_at = now() WHERE id = $2 AND user_id = $3 RETURNING id, status`, [status, id, userId]);
        if (!result.rows[0]) return NextResponse.json({ error: "Request not found." }, { status: 404 });
        return NextResponse.json({ request: { ...result.rows[0], status: requestedStatus } });
    } catch (error) {
        console.error("Failed to update request status:", error);
        return NextResponse.json({ error: "Could not update request status." }, { status: 500 });
    }
}
