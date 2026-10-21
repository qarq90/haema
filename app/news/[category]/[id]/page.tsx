import { articles } from "@/lib/news";
import Client from "./client";

export function generateStaticParams() {
    return articles.map((article) => ({
        category: article.slug,
        id: String(article.id),
    }));
}

export default function NewsCategoryId() {
    return (
        <main className="flex flex-col py-4 h-full max-w-[calc(100dvw-0%)] mx-64">
            <Client />
        </main>
    );
}
