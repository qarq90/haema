import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import pool from "@/lib/neon";

function pdfForAppointment(center: string, date: string, time: string) {
    const text = `Haema Blood Donation Certificate\\n\\nThank you for scheduling a blood donation.\\nCenter: ${center.replace(/[()\\\\]/g, "")}\\nDate: ${date}\\nTime: ${time}`;
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${text.length + 49} >>\nstream\nBT /F1 18 Tf 72 700 Td (${text.replace(/\\n/g, ") Tj 0 -32 Td (")}) Tj ET\nendstream`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [0];
    objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
    const start = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
    return Buffer.from(pdf);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const result = await pool.query(`SELECT appointment_date AS "appointmentDate", appointment_time AS "appointmentTime", center FROM donation_appointments WHERE id = $1 AND user_id = $2`, [id, userId]);
        const appointment = result.rows[0];
        if (!appointment) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
        const pdf = pdfForAppointment(String(appointment.center), String(appointment.appointmentDate).slice(0, 10), String(appointment.appointmentTime).slice(0, 5));
        return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="haema-donation-${id}.pdf"` } });
    } catch (error) {
        console.error("Failed to create donation certificate:", error);
        return NextResponse.json({ error: "Could not create the certificate." }, { status: 500 });
    }
}
