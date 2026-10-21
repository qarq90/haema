import Link from "next/link";
import { articles as allArticles } from "@/lib/news";
import { ArticleCard } from "@/components/news/article";

export function CategoryPreview({
    slug,
    fallbackLabel,
}: {
    slug: string;
    fallbackLabel: string;
}) {
    const pool = allArticles.filter((a) => a.slug === slug);

    if (pool.length === 0) {
        return (
            <p className="text-sm text-foreground/50">
                No articles in this category yet.
            </p>
        );
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 2);

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {picks.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            <Link
                href={`/news/${slug}`}
                className="text-sm font-semibold text-red-500 hover:underline"
            >
                Browse all {fallbackLabel.toLowerCase()} →
            </Link>
        </>
    );
}
