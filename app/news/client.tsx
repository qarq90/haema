"use client";
import Link from "next/link";
import { sections } from "@/lib/news";
import { Section } from "@/components/common/section";
import { CategoryPreview } from "@/components/news/catergory-preview";
import { FeaturedStory } from "@/components/news/featured";
import { LatestArticles } from "@/components/news/latest";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    News
                </h1>
            </section>

            <div className="mx-auto px-6 sm:px-8 lg:px-10 lg:pt-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_minmax(0,1fr)] z-50">
                    <nav className="hidden lg:block">
                        <div className="sticky top-14">
                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/75">
                                Categories
                            </p>

                            <nav className="max-h-[calc(100vh-100px)] overflow-y-auto pr-3 pt-4">
                                <div className="space-y-1">
                                    {sections.map((section) => (
                                        <Link
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/75 transition hover:text-foreground"
                                        >
                                            <span className="font-mono text-xs">
                                                {section.number}
                                            </span>

                                            <span>{section.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        </div>
                    </nav>

                    <article className="min-w-0 rounded-2xl px-6 shadow-sm sm:px-10 lg:px-12">
                        <div className="border-b border-foreground/10 my-2 pb-4">
                            <p className="text-lg leading-8 text-foreground/75">
                                Health tips, myth-busting facts, donor stories,
                                historical milestones, event recaps, research
                                updates, and platform announcements, all in one
                                place. Stay informed, stay prepared, and help us
                                build a stronger donation community.
                            </p>
                        </div>

                        <Section
                            id="featured"
                            number="01"
                            title="Featured Story"
                        >
                            <FeaturedStory />
                        </Section>

                        <Section
                            id="latest"
                            number="02"
                            title="Latest Articles"
                        >
                            <LatestArticles />
                        </Section>

                        <Section id="historical" number="03" title="Historical">
                            <CategoryPreview
                                slug="historical"
                                fallbackLabel="Historical"
                            />
                        </Section>

                        <Section id="events" number="04" title="Events">
                            <CategoryPreview
                                slug="events"
                                fallbackLabel="Events"
                            />
                        </Section>

                        <Section
                            id="health-tips"
                            number="05"
                            title="Health Tips"
                        >
                            <CategoryPreview
                                slug="health-tips"
                                fallbackLabel="Health Tips"
                            />
                        </Section>

                        <Section
                            id="best-hospitals"
                            number="06"
                            title="Best Hospitals"
                        >
                            <CategoryPreview
                                slug="best-hospitals"
                                fallbackLabel="Best Hospitals"
                            />
                        </Section>

                        <Section
                            id="tragic-events"
                            number="07"
                            title="Tragic Events"
                        >
                            <CategoryPreview
                                slug="tragic-events"
                                fallbackLabel="Tragic Events"
                            />
                        </Section>

                        <Section
                            id="donor-stories"
                            number="08"
                            title="Donor Stories"
                        >
                            <CategoryPreview
                                slug="donor-stories"
                                fallbackLabel="Donor Stories"
                            />
                        </Section>

                        <Section id="myths" number="09" title="Myths & Facts">
                            <CategoryPreview
                                slug="myths"
                                fallbackLabel="Myths"
                            />
                        </Section>

                        <Section
                            id="research"
                            number="10"
                            title="Research & Innovation"
                        >
                            <CategoryPreview
                                slug="research"
                                fallbackLabel="Research"
                            />
                        </Section>

                        <Section
                            id="camp-updates"
                            number="11"
                            title="Camp Updates"
                        >
                            <CategoryPreview
                                slug="camp-updates"
                                fallbackLabel="Camp Updates"
                            />
                        </Section>

                        <Section
                            id="announcements"
                            number="12"
                            title="Announcements"
                        >
                            <CategoryPreview
                                slug="announcements"
                                fallbackLabel="Announcements"
                            />
                        </Section>

                        <div className="border-t border-foreground/10 py-10 text-sm leading-6 text-foreground/50">
                            <p>
                                <strong className="text-foreground/70">
                                    Last updated:
                                </strong>{" "}
                                25/09/2026
                            </p>
                            <p className="mt-2">
                                <strong className="text-foreground/70">
                                    Note:
                                </strong>{" "}
                                All articles are reviewed for accuracy. Nothing
                                published here replaces professional medical
                                advice.
                            </p>
                            <p className="mt-2">
                                <strong className="text-foreground/70">
                                    Contact:
                                </strong>{" "}
                                For story submissions, corrections, or
                                partnership requests, please reach out through
                                the official support channels provided on the
                                website.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
