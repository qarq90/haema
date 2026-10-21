import { articles as allArticles } from "@/lib/news";
import { ArticleCard } from "@/components/news/article";

export function FeaturedStory() {
    if (allArticles.length === 0) {
        return (
            <p className="text-sm text-foreground/50">
                No articles available yet.
            </p>
        );
    }

    const randomIndex = Math.floor(Math.random() * allArticles.length);
    const featured = allArticles[randomIndex];

    return (
        <div className="grid grid-cols-1">
            <ArticleCard article={featured} />
        </div>
    );
}
