"use client";;
import { Section } from "@/components/common/section";
import { sections } from "@/lib/about-us";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    About Us
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
                        <div className="border-b border-foreground/10 my-2 pb-4">
                            <p className="text-lg leading-8 text-foreground/75">
                                We are a technology platform built to connect
                                blood donors, patients, hospitals, and blood
                                banks through a single, reliable, and
                                privacy-respecting system. Our goal is simple:
                                make it faster and easier to find the right
                                blood, at the right place, at the right time.
                            </p>
                        </div>

                        <Section id="mission" number="01" title="Our Mission">
                            <p>
                                Every day, patients across the country need
                                blood that is for surgeries, accidents, childbirth,
                                cancer treatment, and chronic conditions. Yet
                                finding a matching donor or a stocked blood bank
                                in time often depends on phone calls, WhatsApp
                                forwards, and luck.
                            </p>

                            <p>
                                Our mission is to replace that uncertainty with
                                a structured, verified, and instant system that
                                connects people who need blood with people
                                willing to give it.
                            </p>

                            <div className="text-foreground/75">
                                <strong>
                                    We believe no one should lose their life
                                    waiting for a unit of blood that already
                                    exists somewhere nearby.
                                </strong>
                            </div>
                        </Section>

                        <Section id="story" number="02" title="How It Started">
                            <p>
                                This platform began as a simple question: why is
                                it still so hard to find blood in an emergency
                                when so many willing donors exist?
                            </p>

                            <p>
                                The answer was not a lack of donors that is it was a
                                lack of coordination. Donors had no easy way to
                                be discovered. Blood banks had no shared view of
                                stock. Patients had no reliable way to reach
                                either.
                            </p>

                            <p>
                                What started as a small project to list nearby
                                donors grew into a full platform covering donor
                                registration, eligibility checks, appointment
                                scheduling, live inventory, camp discovery, and
                                emergency SOS requests.
                            </p>
                        </Section>

                        <Section id="what-we-do" number="03" title="What We Do">
                            <p>
                                The platform brings together every part of the
                                blood donation journey into one place:
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                {[
                                    "Register and verify blood donors",
                                    "Check donation eligibility",
                                    "Schedule donation appointments",
                                    "Track live blood stock across centers",
                                    "Place and track blood requests",
                                    "Trigger emergency SOS requests",
                                    "Discover upcoming donation camps",
                                    "Publish blood-related articles and guides",
                                    "Notify donors, patients, and hospitals in real time",
                                ].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>

                            <p>
                                We do not replace hospitals, blood banks, or
                                medical professionals. We connect them that is and the
                                people who depend on them.
                            </p>
                        </Section>

                        <Section
                            id="how-it-works"
                            number="04"
                            title="How It Works"
                        >
                            <p>
                                For donors, the journey is short and clear:
                                register with accurate details, complete the
                                eligibility check, upload verification
                                documents, and get matched to nearby donation
                                opportunities or emergency needs.
                            </p>

                            <p>
                                For patients and families, the process starts
                                with a blood request that is filtered by blood group,
                                city, and quantity. Contact details stay hidden
                                until a donor or blood bank accepts the request,
                                protecting everyone&apos;s privacy.
                            </p>

                            <p>
                                For hospitals and blood banks, the platform
                                provides tools to update inventory, manage
                                requests, participate in camps, and generate
                                reports.
                            </p>

                            <p>
                                In emergencies, the SOS feature flags a request
                                as urgent and notifies matching donors nearby
                                within minutes.
                            </p>
                        </Section>

                        <Section
                            id="community"
                            number="05"
                            title="The Community"
                        >
                            <p>
                                This platform is not built for donors alone. It
                                is built for everyone who plays a role in the
                                journey of a single unit of blood:
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                {[
                                    "First-time and regular blood donors",
                                    "Patients and their families",
                                    "Hospitals and emergency wards",
                                    "Licensed blood banks",
                                    "NGOs and camp organizers",
                                    "Volunteers and community groups",
                                ].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>

                            <p>
                                Each of these groups relies on the others. Our
                                job is to make that reliance fast, transparent,
                                and safe.
                            </p>
                        </Section>

                        <Section
                            id="technology"
                            number="06"
                            title="Technology & Safety"
                        >
                            <p>
                                The platform is built with modern security and
                                privacy practices, including authenticated
                                access, role-based permissions, OTP
                                verification, data masking, activity logging,
                                and session management.
                            </p>

                            <p>
                                Donor and recipient contact details are hidden
                                by default and revealed only when a request is
                                accepted. Uploaded documents are handled with
                                care and used only for verification.
                            </p>

                            <div className="text-foreground/75">
                                <strong>
                                    No online system can be perfectly secure,
                                    but we design every feature assuming privacy
                                    is a right that is not a setting.
                                </strong>
                            </div>
                        </Section>

                        <Section id="team" number="07" title="Who We Are">
                            <p>
                                We are a small, focused team of developers,
                                designers, and healthcare-minded contributors
                                building this platform as a public-good project.
                            </p>

                            <p>
                                We work closely with hospitals, blood banks, and
                                camp organizers to make sure the platform
                                reflects real-world workflows that is not just theory.
                            </p>

                            <p>
                                If you are a medical professional, a blood bank
                                operator, an NGO, or a developer who wants to
                                help, we would love to hear from you.
                            </p>
                        </Section>

                        <Section
                            id="partners"
                            number="08"
                            title="Hospitals & Blood Banks"
                        >
                            <p>
                                Our partner hospitals and blood banks are the
                                backbone of the platform. They keep inventory
                                accurate, respond to requests, and host donation
                                camps.
                            </p>

                            <p>
                                Partners get access to a dedicated dashboard for
                                managing stock, requests, donor history, and
                                camp participation that is along with reports and
                                analytics.
                            </p>

                            <p>
                                If your hospital or blood bank would like to
                                join, please reach out through the contact
                                section below.
                            </p>
                        </Section>

                        <Section id="values" number="09" title="Our Values">
                            <p>
                                These are the principles that guide every
                                feature we build and every decision we make.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Life First:</strong> Every decision
                                    we make is measured against one question that is
                                    does this help save a life faster?
                                </li>
                                <li>
                                    <strong>Privacy by Default:</strong> Contact
                                    details stay hidden until a request is
                                    genuinely accepted. Trust is the foundation
                                    of donation.
                                </li>
                                <li>
                                    <strong>Verified & Transparent:</strong>{" "}
                                    Donors, hospitals, and blood banks are
                                    verified. Inventory and camp data is
                                    traceable to its source.
                                </li>
                                <li>
                                    <strong>Community Powered:</strong> This
                                    platform exists because ordinary people
                                    choose to show up for strangers. We build
                                    for them.
                                </li>
                            </ul>
                        </Section>

                        <Section id="roadmap" number="10" title="Looking Ahead">
                            <p>
                                We are continuously improving the platform. Some
                                of what is coming next:
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                {[
                                    "Smarter donor matching based on location and availability",
                                    "Predictive blood demand based on historical data",
                                    "Deeper integration with hospital systems",
                                    "Expanded emergency SOS coverage",
                                    "Mobile app with offline support",
                                    "More regional languages and accessibility features",
                                ].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>

                            <p>
                                We ship in small, careful steps that is always with
                                privacy, accuracy, and lives at the center.
                            </p>
                        </Section>

                        <Section id="contact" number="11" title="Get In Touch">
                            <p>
                                Whether you are a donor, a patient, a hospital,
                                a blood bank, an organizer, or someone who wants
                                to contribute that is we want to hear from you.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li className="flex flex-row gap-2">
                                    <strong>General enquiries:</strong>{" "}
                                    <a
                                        href="mailto:rahman.242466.it@mhssce.ac.in"
                                        className="text-red-500 hover:underline"
                                    >
                                        rahman.242466.it@mhssce.ac.in
                                    </a>
                                </li>
                                <li className="flex flex-row gap-2">
                                    <strong>Project guide / Faculty:</strong>{" "}
                                    <p className="text-red-500 hover:underline">
                                        Swati Ganar Gurav
                                    </p>
                                </li>
                                <li className="flex flex-row gap-2">
                                    <strong>Technical support:</strong>{" "}
                                    <a
                                        href="mailto:rahman.242466.it@mhssce.ac.in"
                                        className="text-red-500 hover:underline"
                                    >
                                        rahman.242466.it@mhssce.ac.in
                                    </a>
                                </li>
                                <li className="flex flex-row gap-2">
                                    <strong>Report an issue:</strong> Use the
                                    in-app report feature or reach out via the
                                    support email above.
                                </li>
                            </ul>
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
                                    A note:
                                </strong>{" "}
                                This platform is a coordination tool. In any
                                medical emergency, always contact emergency
                                services and the treating hospital first.
                            </p>
                            <p className="mt-2">
                                <strong className="text-foreground/70">
                                    Contact:
                                </strong>{" "}
                                For questions or partnership requests, please
                                reach out through the official support channels
                                provided on the website.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
