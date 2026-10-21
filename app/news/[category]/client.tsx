"use client";;
import { Section } from "@/components/news/section";
import { articles, categories } from "@/lib/news";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

function ArticleCard({ article }: { article: (typeof articles)[number] }) {
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
                    ? article.content[0].length > 100
                        ? `${article.content[0].slice(0, 100)}…`
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

export default function Client() {
    const params = useParams<{ category: string }>();
    const slug = params.category;

    const activeCategory = categories.find((c) => c.slug === slug);
    const categoryLabel = activeCategory?.label ?? "All";

    const filtered =
        slug === "all" ? articles : articles.filter((a) => a.slug === slug);

    const group0 = filtered.filter((a) => a.id % 3 === 0);
    const group1 = filtered.filter((a) => a.id % 3 === 1);
    const group2 = filtered.filter((a) => a.id % 3 === 2);

    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <div className="flex flex-row items-center gap-4">
                    <Link
                        href="/news"
                        aria-label="Back to news"
                        className="group flex h-16 w-16 items-center justify-center rounded-full bg-theme text-white transition hover:bg-theme hover:text-white"
                    >
                        <LuArrowLeft size={28} />
                    </Link>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        {categoryLabel}
                    </h1>
                </div>
            </section>

            <div className="mx-auto px-6 sm:px-8 lg:px-10 lg:pt-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_minmax(0,1fr)] z-50">
                    <aside className="hidden lg:block">
                        <div className="sticky top-14">
                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/75">
                                Categories
                            </p>

                            <nav className="max-h-[calc(100vh-100px)] overflow-y-auto pr-3 pt-4">
                                <div className="space-y-1">
                                    {categories.map((cat, idx) => {
                                        const isActive = cat.slug === slug;

                                        return (
                                            <Link
                                                key={cat.slug}
                                                href={`/news/${cat.slug}`}
                                                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                                    isActive
                                                        ? "bg-theme text-white"
                                                        : "text-foreground/75 hover:text-foreground"
                                                }`}
                                            >
                                                <span className="font-mono text-xs">
                                                    {String(idx + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>

                                                <span>{cat.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>
                        </div>
                    </aside>

                    <article className="min-w-0">
                        <div className="flex flex-col gap-8 lg:flex-row lg:gap-6 lg:items-start">
                            <Section
                                id="articles-0"
                                number="01"
                                title="Group 1"
                            >
                                {group0.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        {group0.map((article) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-foreground/50">
                                        No articles in this group yet.
                                    </p>
                                )}
                            </Section>

                            <Section
                                id="articles-1"
                                number="02"
                                title="Group 2"
                            >
                                {group1.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        {group1.map((article) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-foreground/50">
                                        No articles in this group yet.
                                    </p>
                                )}
                            </Section>

                            <Section
                                id="articles-2"
                                number="03"
                                title="Group 3"
                            >
                                {group2.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        {group2.map((article) => (
                                            <ArticleCard
                                                key={article.id}
                                                article={article}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-foreground/50">
                                        No articles in this group yet.
                                    </p>
                                )}
                            </Section>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
