import { currentUser } from "@clerk/nextjs/server";

export async function getVerifiedHospital() {
    const user = await currentUser();
    if (!user) return null;

    const metadata = user.publicMetadata as Record<string, unknown> | null;
    if (!metadata) return null;
    const hospitalName =
        typeof metadata.hospitalName === "string"
            ? metadata.hospitalName.trim()
            : "";

    if (
        metadata.role !== "hospital" ||
        metadata.hospitalVerified !== true ||
        hospitalName.length < 2 ||
        hospitalName.length > 160
    ) {
        return null;
    }

    return { userId: user.id, hospitalName };
}
