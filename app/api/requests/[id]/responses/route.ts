import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { userId } = await auth();
    if (!userId)
        return NextResponse.json(
            { error: "Sign in to respond to a request." },
            { status: 401 },
        );
    const { id } = await params;
    let body: { message?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        /* message is optional */
    }
    const message =
        typeof body.message === "string"
            ? body.message.trim().slice(0, 500)
            : null;
    try {
        const requestResult = await pool.query<{ userId: string }>(
            `SELECT user_id AS "userId" FROM requests WHERE id = $1 AND status = 'pending'`,
            [id],
        );
        if (!requestResult.rows[0])
            return NextResponse.json(
                { error: "This request is no longer active." },
                { status: 404 },
            );
        if (requestResult.rows[0].userId === userId)
            return NextResponse.json(
                { error: "You cannot respond to your own request." },
                { status: 400 },
            );
        const existing = await pool.query<{ id: string }>(
            `SELECT id FROM request_responses WHERE request_id = $1 AND donor_user_id = $2 LIMIT 1`,
            [id, userId],
        );
        const result = existing.rows[0]
            ? await pool.query<{ id: string }>(
                  `UPDATE request_responses SET message = $1, status = 'pledged', updated_at = now() WHERE id = $2 RETURNING id`,
                  [message, existing.rows[0].id],
              )
            : await pool.query<{ id: string }>(
                  `INSERT INTO request_responses (request_id, donor_user_id, message) VALUES ($1, $2, $3) RETURNING id`,
                  [id, userId, message],
              );
        return NextResponse.json(
            { responseId: result.rows[0].id },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to respond to blood request:", error);
        return NextResponse.json(
            { error: "Could not send your response." },
            { status: 500 },
        );
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const owner = await pool.query(`SELECT id FROM requests WHERE id = $1 AND user_id = $2`, [id, userId]);
        if (!owner.rows[0]) return NextResponse.json({ error: "Request not found." }, { status: 404 });
        const result = await pool.query(`SELECT responses.id, responses.status, responses.message, responses.created_at AS "createdAt", CASE WHEN responses.status = 'accepted' THEN users."user-email" ELSE NULL END AS "contactEmail", CASE WHEN responses.status = 'accepted' THEN users."phone-number" ELSE NULL END AS "contactPhone" FROM request_responses responses LEFT JOIN users ON users."user-id" = responses.donor_user_id WHERE responses.request_id = $1 ORDER BY responses.created_at DESC`, [id]);
        return NextResponse.json({ responses: result.rows.map((row) => ({ ...row, status: row.status === "declined" ? "rejected" : row.status, createdAt: new Date(row.createdAt).toISOString() })) });
    } catch (error) {
        console.error("Failed to load request responses:", error);
        return NextResponse.json({ error: "Could not load request responses." }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    let body: { responseId?: unknown; action?: unknown } = {};
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    const responseId = typeof body.responseId === "string" ? body.responseId : "";
    const action = body.action === "accepted" || body.action === "rejected" ? body.action : "";
    if (!responseId || !action) return NextResponse.json({ error: "Choose a valid response action." }, { status: 400 });
    try {
        const owner = await pool.query(`SELECT id FROM requests WHERE id = $1 AND user_id = $2`, [id, userId]);
        if (!owner.rows[0]) return NextResponse.json({ error: "Request not found." }, { status: 404 });
        const responseStatus = action === "rejected" ? "declined" : "accepted";
        if (action === "accepted") {
            await pool.query(`UPDATE request_responses SET status = 'declined', updated_at = now() WHERE request_id = $1 AND id <> $2`, [id, responseId]);
        }
        const result = await pool.query(`UPDATE request_responses SET status = $1, updated_at = now() WHERE id = $2 AND request_id = $3 RETURNING id`, [responseStatus, responseId, id]);
        if (!result.rows[0]) return NextResponse.json({ error: "Response not found." }, { status: 404 });
        if (action === "accepted") await pool.query(`UPDATE requests SET status = 'matched', updated_at = now() WHERE id = $1`, [id]);
        return NextResponse.json({ status: action });
    } catch (error) {
        console.error("Failed to update request response:", error);
        return NextResponse.json({ error: "Could not update this response." }, { status: 500 });
    }
}
