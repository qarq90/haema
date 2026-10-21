export type Camp = {
    id: string;
    startTime: string;
    endTime: string;
    slotsLeft: number;
    name: string;
};

export type Errors = {
    slot?: string;
    name?: string;
    email?: string;
    phone?: string;
};
