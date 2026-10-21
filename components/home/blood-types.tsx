export const BloodTypes = () => {
    const bloodTypes = [
        { type: "A+", count: 50 },
        { type: "A-", count: 42 },
        { type: "B+", count: 38 },
        { type: "B-", count: 25 },
        { type: "AB+", count: 18 },
        { type: "AB-", count: 12 },
        { type: "O+", count: 65 },
        { type: "O-", count: 30 },
    ];

    return (
        <section className="w-full min-h-dvh/2 flex flex-col gap-y-16 items-center justify-center py-20">
            <p className="text-8xl text-center">
                Live{" "}
                <span className="text-theme font-bold uppercase">Blood</span>{" "}
                Stock Counter
            </p>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bloodTypes.map(({ type, count }) => (
                    <div
                        key={type}
                        className="hover:bg-theme/15 cursor-pointer group flex flex-col items-center justify-center gap-y-2 rounded-xl border border-foreground/5 p-6 transition-all duration-300 hover:border-theme/40"
                    >
                        <p className="text-2xl font-semibold tracking-wide text-foreground/80 transition-colors">
                            {type}
                        </p>
                        <p className="text-5xl font-bold tabular-nums text-foreground transition-colors">
                            {count}
                        </p>
                        <span className="text-xs uppercase tracking-widest text-foreground/40">
                            Units
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};
