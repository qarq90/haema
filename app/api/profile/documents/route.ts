import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const result = await pool.query(`SELECT id, kind, filename, mime_type AS "mimeType", size_bytes AS "sizeBytes", created_at AS "createdAt" FROM donor_documents WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        return NextResponse.json({ documents: result.rows });
    } catch (error) {
        console.error("Failed to load donor documents:", error);
        return NextResponse.json({ error: "Could not load donor documents." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to upload donor documents." }, { status: 401 });
    const form = await request.formData();
    const kind = form.get("kind");
    const file = form.get("file");
    if ((kind !== "photo" && kind !== "id_proof") || !(file instanceof File)) return NextResponse.json({ error: "Choose a valid document." }, { status: 400 });
    if (!allowedTypes.has(file.type) || file.size < 1 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Use a JPG, PNG, WEBP, or PDF file up to 5 MB." }, { status: 400 });
    if (kind === "photo" && file.type === "application/pdf") return NextResponse.json({ error: "Profile photo must be an image." }, { status: 400 });
    try {
        const content = Buffer.from(await file.arrayBuffer());
        const result = await pool.query(`INSERT INTO donor_documents (user_id, kind, filename, mime_type, size_bytes, content) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id, kind) DO UPDATE SET filename = EXCLUDED.filename, mime_type = EXCLUDED.mime_type, size_bytes = EXCLUDED.size_bytes, content = EXCLUDED.content, created_at = now() RETURNING id, kind, filename`, [userId, kind, file.name.slice(0, 200), file.type, file.size, content]);
        return NextResponse.json({ document: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Failed to save donor document:", error);
        return NextResponse.json({ error: "Could not save this document." }, { status: 500 });
    }
}
