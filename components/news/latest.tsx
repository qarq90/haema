import { articles as allArticles } from "@/lib/news";
import { ArticleCard } from "@/components/news/article";

export function LatestArticles() {
    if (allArticles.length === 0) {
        return (
            <p className="text-sm text-foreground/50">
                No articles available yet.
            </p>
        );
    }

    const latest = [...allArticles]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    );
}
