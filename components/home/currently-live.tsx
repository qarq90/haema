import Image from "next/image";
import android_transfusion from "../../public/imgs/android_transfusion.png";

export const CurrentlyLive = () => {
    const stats = [
        { label: "So far", value: "12,480", sub: "Total Donors" },
        { label: "So far", value: "8,932", sub: "Requests Fulfilled" },
        { label: "So far", value: "64", sub: "Camps" },
    ];

    return (
        <section className="w-full h-[88dvh] flex flex-row-reverse gap-32 items-center">
            <div className="h-full w-3/5 shrink-0 flex flex-col justify-center gap-16 text-right">
                <p className="text-8xl leading-32">
                    A snapshot of our{" "}
                    <span className="uppercase text-theme font-bold">
                        impact
                    </span>{" "}
                </p>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                    {stats.map(({ label, value, sub }) => (
                        <div
                            key={sub}
                            className="hover:bg-theme/15 group flex flex-col items-center justify-center gap-y-2 rounded-xl border border-foreground/5 p-6 transition-all duration-300 hover:border-theme/40"
                        >
                            <p className="text-2xl font-semibold tracking-wide text-foreground/80 transition-colors">
                                {label}
                            </p>
                            <p className="text-5xl font-bold tabular-nums text-foreground transition-colors">
                                {value}
                            </p>
                            <span className="text-xs uppercase tracking-widest text-foreground/40">
                                {sub}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-full w-2/5 shrink-0 flex items-center justify-center -mt-32 -mr-8">
                <div className="relative h-full w-full rounded-lg">
                    <Image
                        src={android_transfusion}
                        alt=""
                        fill
                        className="object-contain rounded-lg"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};
