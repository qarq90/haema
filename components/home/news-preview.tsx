"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { articles as allArticles } from "@/lib/news";
import { ArticleCard } from "@/components/news/article";
import { Button } from "../ui/button";

export const NewsPreview = () => {
    const [picks, setPicks] = useState<typeof allArticles>([]);

    useEffect(() => {
        if (allArticles.length === 0) return;

        const shuffled = [...allArticles].sort(() => Math.random() - 0.5);
        setPicks(shuffled.slice(0, 4));
    }, []);

    return (
        <section className="w-full flex flex-col gap-y-12 items-center py-20">
            <div className="flex flex-col items-center gap-y-3 text-center">
                <p className="text-8xl leading-tight">
                    From our{" "}
                    <span className="uppercase text-theme font-bold">
                        newsroom
                    </span>
                </p>
                <p className="max-w-2xl text-foreground/60">
                    Health tips, donor stories, and updates from the Haema
                    community.
                </p>
            </div>

            {picks.length === 0 ? (
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                    {[0, 1].map((i) => (
                        <div
                            key={i}
                            className="h-64 animate-pulse rounded-xl border border-foreground/5 bg-foreground/5"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                    {picks.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}

            <Link
                href="/news"
                className="text-sm font-semibold text-red-500 hover:underline"
            >
                <Button>Open News</Button>
            </Link>
        </section>
    );
};
