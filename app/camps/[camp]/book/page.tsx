import { notFound } from "next/navigation";
import { MOCK_CAMPS } from "@/lib/donate";
import { slugify } from "@/functions/slugify";
import Client from "./client";

export function generateStaticParams() {
    return MOCK_CAMPS.map((c) => ({ camp: slugify(c.name) }));
}

export default async function BookCampPage({
    params,
}: {
    params: Promise<{ camp: string }>;
}) {
    const { camp: campSlug } = await params;
    const currentCamp = MOCK_CAMPS.find((c) => slugify(c.name) === campSlug);

    if (!currentCamp) notFound();

    return (
        <main className="flex flex-col py-4 h-full max-w-[calc(100dvw-0%)] mx-64">
            <Client camp={currentCamp} />
        </main>
    );
}