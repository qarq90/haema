import { SectionProps } from "@/types/common";

export function Section({ id, number, title, children }: SectionProps) {
    return (
        <section id={id} className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="space-y-5 leading-7 text-foreground/75">
                {children}
            </div>
        </section>
    );
}