import Image from "next/image";
import android_transfusion from "../../public/imgs/android_transfusion.png";

export const CurrentlyLive = () => {
    const stats = [
        { label: "So far", value: "12,480", sub: "Total Donors" },
        { label: "So far", value: "8,932", sub: "Requests Fulfilled" },
        { label: "So far", value: "64", sub: "Camps" },
    ];

    return (
        <section className="flex w-full flex-col items-center gap-8 py-12 sm:py-16 md:h-[88dvh] md:flex-row-reverse md:gap-32 md:py-0">
            <div className="flex w-full shrink-0 flex-col justify-center gap-8 text-center sm:gap-12 md:h-full md:w-3/5 md:gap-16 md:text-right">
                <h2 className="text-4xl leading-tight sm:text-6xl md:text-8xl md:leading-32">
                    A snapshot of our{" "}
                    <span className="uppercase text-theme font-bold">
                        impact
                    </span>{" "}
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    {stats.map(({ label, value, sub }) => (
                        <div
                            key={sub}
                            className="group flex flex-col items-center justify-center gap-y-2 rounded-xl border border-foreground/5 p-4 transition-all duration-300 hover:border-theme/40 hover:bg-theme/15 sm:p-6"
                        >
                            <p className="text-2xl font-semibold tracking-wide text-foreground/80 transition-colors">
                                {label}
                            </p>
                            <p className="text-4xl font-bold overflow-hidden tabular-nums text-foreground transition-colors sm:text-5xl">
                                {value}
                            </p>
                            <span className="text-xs uppercase tracking-widest text-foreground/40">
                                {sub}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative h-[30vh] min-h-56 w-full shrink-0 md:-mt-32 md:-mr-8 md:flex md:h-full md:w-2/5 md:items-center md:justify-center">
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
