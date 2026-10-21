import { SectionProps } from "@/types/common";

export function Section({ id, number, title, children }: SectionProps) {
    return (
        <section
            id={id}
            className="scroll-mt-28 border-b border-foreground/10 py-12 first:pt-0 last:border-b-0"
        >
            <div className="flex gap-5">
                <span className="hidden shrink-0 pt-1 text-2xl font-bold text-red-500 sm:block">
                    {number}
                </span>

                <div className="min-w-0 flex-1 flex flex-col gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground/75 sm:text-3xl">
                        {title}
                    </h2>

                    <div className="mt-6 space-y-5 leading-7 text-foreground/75">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}