import { categories } from "@/lib/news";
import Client from "./client";

export function generateStaticParams() {
    return categories.map((cat) => ({ category: cat.slug }));
}

export default function TermsOfService() {
    return (
        <main className="flex flex-col py-4 h-full max-w-[calc(100dvw-0%)] mx-64">
            <Client />
        </main>
    );
}
