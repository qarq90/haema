export function generateSlots(start: string, end: string) {
    const slots: string[] = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let minutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    while (minutes + 30 <= endMinutes) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        slots.push(label);
        minutes += 30;
    }
    return slots;
}

export function addMinutes(time: string, mins: number) {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}
