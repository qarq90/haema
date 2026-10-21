"use client";
import { Article, ArticleCard } from "@/components/news/article";
import { articles, categories } from "@/lib/news";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

export default function Client() {
    const params = useParams<{ category: string; id: string }>();
    const { category: slug, id } = params;

    const article = articles.find(
        (a) => a.id === Number(id) && a.slug === slug,
    );

    const related =
        article &&
        articles
            .filter((a) => a.slug === slug && a.id !== article.id)
            .slice(0, 2);

    if (!article) {
        return (
            <main className="min-h-screen">
                <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                        Article not found
                    </h1>
                </section>

                <div className="mx-auto px-6 sm:px-8 lg:px-10 lg:pt-12">
                    <div className="rounded-2xl border border-foreground/10 px-6 py-10 shadow-sm sm:px-10 lg:px-12">
                        <p className="text-lg leading-8 text-foreground/75">
                            The article you are looking for does not exist or
                            may have been moved.
                        </p>

                        <Link
                            href="/news"
                            className="mt-6 inline-block rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Back to News
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const headings = (article.content ?? []).map((_, i) => ({
        id: `part-${i + 1}`,
        number: String(i + 1).padStart(2, "0"),
        title: i === 0 ? "Introduction" : `Part ${i + 1}`,
    }));

    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl flex gap-4 items-center">
                <Link
                    href="/news"
                    aria-label="Back to news"
                    className="group flex h-16 w-16 items-center justify-center rounded-full bg-theme text-white transition hover:bg-theme hover:text-white"
                >
                    <LuArrowLeft size={28} />
                </Link>

                <h1 className="text-4xl font-bold tracking-tight">
                    {article.title}
                </h1>
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

                    <article className="min-w-0 rounded-2xl px-6 shadow-sm sm:px-10 lg:px-12">
                        <div className="border-b border-foreground/10 my-2 pb-4">
                            <p className="text-lg leading-8 text-foreground/75">
                                {article.excerpt}
                            </p>
                        </div>

                        {(article.content ?? []).map((paragraph, i) => (
                            <Article
                                key={i}
                                id={`part-${i + 1}`}
                                number={String(i + 1).padStart(2, "0")}
                                title={
                                    i === 0 ? "Introduction" : `Part ${i + 1}`
                                }
                            >
                                <p>{paragraph}</p>
                            </Article>
                        ))}

                        {related && related.length > 0 && (
                            <Article
                                id="related"
                                number={String(
                                    (article.content?.length ?? 0) + 1,
                                ).padStart(2, "0")}
                                title="Related Articles"
                            >
                                <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2">
                                    {related.map((rel) => (
                                        <ArticleCard
                                            key={rel.id}
                                            article={rel}
                                        />
                                    ))}
                                </div>
                            </Article>
                        )}

                        <div className="border-t border-foreground/10 py-10 text-sm leading-6 text-foreground/50">
                            <p className="mt-2">
                                <strong className="text-foreground/70">
                                    Note:
                                </strong>{" "}
                                This article is for general information only and
                                does not replace professional medical advice.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
