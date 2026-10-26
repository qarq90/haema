import type { Camp } from "@/types/donate";

function icsDate(date: Date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function downloadCampCalendarEvent(camp: Camp) {
    const start = new Date(`${camp.date}T${camp.startTime}:00`);
    const end = new Date(`${camp.date}T${camp.endTime}:00`);
    const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `UID:haema-camp-${camp.id}@haema`,
        `DTSTAMP:${icsDate(new Date())}`,
        `DTSTART:${icsDate(start)}`,
        `DTEND:${icsDate(end)}`,
        `SUMMARY:${camp.name.replace(/[,;\\]/g, "")}`,
        `LOCATION:${`${camp.address}, ${camp.city}`.replace(/[,;\\]/g, "")}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `haema-${camp.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}
