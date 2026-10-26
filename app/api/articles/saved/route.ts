import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const result = await pool.query(`SELECT article_id AS "articleId", created_at AS "createdAt" FROM saved_articles WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        return NextResponse.json({ articles: result.rows });
    } catch (error) {
        console.error("Failed to load saved articles:", error);
        return NextResponse.json({ error: "Could not load saved articles." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to save articles." }, { status: 401 });
    let body: { articleId?: unknown } = {};
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
    const articleId = typeof body.articleId === "string" ? body.articleId.trim() : "";
    if (!articleId || articleId.length > 160) return NextResponse.json({ error: "Choose a valid article." }, { status: 400 });
    try {
        await pool.query(`INSERT INTO saved_articles (user_id, article_id) VALUES ($1, $2) ON CONFLICT (user_id, article_id) DO NOTHING`, [userId, articleId]);
        return NextResponse.json({ saved: true });
    } catch (error) {
        console.error("Failed to save article:", error);
        return NextResponse.json({ error: "Could not save this article." }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const articleId = new URL(request.url).searchParams.get("articleId")?.trim();
    if (!articleId) return NextResponse.json({ error: "Choose a valid article." }, { status: 400 });
    try {
        await pool.query(`DELETE FROM saved_articles WHERE user_id = $1 AND article_id = $2`, [userId, articleId]);
        return NextResponse.json({ saved: false });
    } catch (error) {
        console.error("Failed to remove saved article:", error);
        return NextResponse.json({ error: "Could not remove this article." }, { status: 500 });
    }
}
