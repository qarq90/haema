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
        <main className="mx-0 flex h-full flex-col px-4 py-4 md:mx-64 md:w-full md:px-0 lg:px-64 xl:px-64 md:ml-16">
            <Client />
        </main>
    );
}
