import { articles } from "@/lib/news";
import { SectionProps } from "@/types/common";
import Link from "next/link";

export function Article({ id, number, title, children }: SectionProps) {
    return (
        <section id={id} className="first:pt-0 last:border-b-0">
            <div className="flex gap-5">
                <div className="min-w-0 flex-1 flex flex-col gap-4">
                    <div className="mt-6 space-y-5 leading-7 text-foreground/75">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ArticleCard({
    article,
}: {
    article: (typeof articles)[number];
}) {
    return (
        <Link
            href={`/news/${article.slug}/${article.id}`}
            className="block rounded-lg border border-foreground/5 p-5 transition hover:border-theme/40 hover:bg-theme/15"
        >
            <h3 className="text-xl font-bold text-foreground/80">
                {article.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
                {article.excerpt}
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
                {article.content?.[0]
                    ? article.content[0].length > 150
                        ? `${article.content[0].slice(0, 150)}…`
                        : article.content[0]
                    : null}
            </p>

            <div className="mt-4 flex flex-row-reverse items-center justify-between">
                <span className="text-xs text-foreground/85">
                    {article.date}
                </span>
                <span className="text-xs text-foreground/85">
                    {article.readTime}
                </span>
            </div>
        </Link>
    );
}
