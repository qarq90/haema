"use client";

import { sections } from "@/lib/faqs";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Frequently Asked Questions
                </h1>
            </section>

            <div className="mx-auto px-6 sm:px-8 lg:px-10 lg:pt-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_minmax(0,1fr)] z-50">
                    <aside className="hidden lg:block">
                        <div className="sticky top-14">
                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/75">
                                On this page
                            </p>

                            <nav className="max-h-[calc(100vh-100px)] overflow-y-auto pr-3 pt-4">
                                <div className="space-y-1">
                                    {sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/75 transition hover:text-foreground"
                                        >
                                            <span className="font-mono text-xs">
                                                {section.number}
                                            </span>

                                            <span>{section.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </nav>
                        </div>
                    </aside>

                    <article className="min-w-0 rounded-2xl px-6 shadow-sm sm:px-10 lg:px-12">
                        {sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-28 border-b border-foreground/10 last:border-b-0 first:pt-0 pt-12 pb-6"
                            >
                                <div className="flex gap-5">
                                    <span className="hidden shrink-0 pt-1 text-2xl font-bold text-red-500 sm:block">
                                        {section.number}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-2xl pb-4 font-bold tracking-tight text-foreground/75 sm:text-3xl">
                                            {section.title}
                                        </h2>

                                        <div className="mt-6">
                                            <div className="divide-y divide-foreground/10 border-t border-foreground/10">
                                                {section.faqs.map(
                                                    (faq, index) => (
                                                        <details
                                                            key={index}
                                                            className="group"
                                                        >
                                                            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-semibold text-foreground/75 transition hover:text-foreground [&::-webkit-details-marker]:hidden">
                                                                <span>
                                                                    {
                                                                        faq.question
                                                                    }
                                                                </span>

                                                                <span className="shrink-0 text-xl font-light text-foreground/40 transition-transform duration-200 group-open:rotate-45">
                                                                    +
                                                                </span>
                                                            </summary>

                                                            <div className="pb-6 pr-8 text-sm leading-7 text-foreground/75">
                                                                {faq.answer}
                                                            </div>
                                                        </details>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </article>
                </div>
            </div>
        </main>
    );
}
