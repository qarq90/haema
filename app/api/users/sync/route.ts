import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await currentUser();

        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: "Unable to load authenticated user" },
                { status: 401 },
            );
        }

        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
            return NextResponse.json(
                { error: "A verified email address is required" },
                { status: 400 },
            );
        }

        const username =
            user.username || email.split("@")[0] || email;

        await pool.query(
            `
                INSERT INTO "users" (
                    "user-id",
                    "user-name",
                    "user-email",
                    "first-name",
                    "last-name",
                    "user-avatar",
                    "phone-number"
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT ("user-id") DO NOTHING
            `,
            [
                user.id,
                username,
                email,
                user.firstName || user.externalAccounts[0]?.firstName || "",
                user.lastName || user.externalAccounts[0]?.lastName || "",
                user.imageUrl || null,
                user.primaryPhoneNumber?.phoneNumber || null,
            ],
        );

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to sync authenticated user to Neon:", error);
        return NextResponse.json(
            { error: "Failed to create user record" },
            { status: 500 },
        );
    }
}
