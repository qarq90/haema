import { categories } from "@/lib/news";
import Client from "./client";

export function generateStaticParams() {
    return categories.map((cat) => ({ category: cat.slug }));
}

export default function NewsCategory() {
    return (
        <main className="mx-0 flex h-full flex-col px-4 py-4 md:mx-64 md:max-w-[calc(100dvw-0%)] md:px-0">
            <Client />
        </main>
    );
}
