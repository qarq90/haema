"use client";;
import { Section } from "@/components/common/section";
import { sections } from "@/lib/terms-of-service";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Terms Of Service
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
                                Welcome to our blood donation and blood request
                                platform. These Terms of Service explain the
                                rules and conditions governing your use of our
                                platform, including blood donation, blood
                                requests, blood inventory information, donation
                                camps, notifications, and related services.
                            </p>
                        </div>

                        <Section
                            id="acceptance"
                            number="01"
                            title="Acceptance of These Terms"
                        >
                            <p>
                                By accessing, registering for, or using this
                                platform, you agree to comply with these Terms
                                of Service and all applicable laws and
                                regulations. If you do not agree with these
                                Terms, please do not use the platform.
                            </p>

                            <p>
                                These Terms apply to all users, including
                                donors, blood recipients, hospitals, blood
                                banks, camp organizers, administrators, and
                                guest users.
                            </p>

                            <p>
                                We may update these Terms from time to time to
                                reflect changes to the platform, applicable
                                laws, security requirements, or services.
                                Updated Terms will be published on this page
                                with a revised &quot;Last updated&quot; date.
                                Continued use of the platform after changes are
                                published constitutes acceptance of the updated
                                Terms.
                            </p>

                            <p>
                                These Terms shall be interpreted and governed by
                                the applicable laws and regulations of the
                                jurisdiction in which the platform operator is
                                legally established, unless otherwise required
                                by applicable law.
                            </p>
                        </Section>

                        <Section
                            id="platform"
                            number="02"
                            title="About the Platform"
                        >
                            <p>
                                Our platform is designed to help connect blood
                                donors, people requiring blood, hospitals, blood
                                banks, and blood donation camps through a
                                centralized digital system.
                            </p>

                            <p>The platform may provide features such as:</p>

                            <ul className="list-disc space-y-2 pl-6">
                                {[
                                    "Blood donor registration",
                                    "Eligibility checking",
                                    "Donation appointment scheduling",
                                    "Blood request tracking",
                                    "Blood inventory information",
                                    "Emergency blood requests",
                                    "Donation camp discovery",
                                    "Notifications and reminders",
                                    "Donation history",
                                ].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>

                            <p>
                                The platform is intended to facilitate
                                communication and coordination. It does not
                                replace medical professionals, hospitals,
                                licensed blood banks, or emergency medical
                                services.
                            </p>
                        </Section>

                        <Section
                            id="eligibility"
                            number="03"
                            title="Eligibility to Use the Platform"
                        >
                            <p>
                                You must provide accurate information when
                                creating an account or submitting any form
                                through the platform.
                            </p>

                            <p>
                                Users must meet any applicable age, medical,
                                legal, or organizational requirements before
                                participating in blood donation activities.
                            </p>

                            <p>
                                We reserve the right to restrict or suspend
                                access if information provided by a user is
                                inaccurate, misleading, fraudulent, or violates
                                these Terms.
                            </p>
                        </Section>

                        <Section
                            id="accounts"
                            number="04"
                            title="User Accounts"
                        >
                            <p>
                                Certain features require you to create an
                                account. You are responsible for maintaining the
                                confidentiality of your login credentials and
                                for activities performed through your account.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    Provide accurate and current information.
                                </li>
                                <li>
                                    Keep your password and authentication
                                    information secure.
                                </li>
                                <li>
                                    Notify the platform of suspected
                                    unauthorized access.
                                </li>
                                <li>
                                    Do not share your account with another
                                    person.
                                </li>
                                <li>
                                    Do not create accounts for fraudulent or
                                    misleading purposes.
                                </li>
                            </ul>

                            <p>
                                We may suspend or terminate an account if we
                                reasonably believe that the user has violated
                                these Terms, submitted fraudulent information,
                                abused the platform, compromised platform
                                security, or engaged in unlawful activity. Users
                                may also request account deactivation through
                                the available account settings or support
                                channels.
                            </p>
                        </Section>

                        <Section
                            id="donor-registration"
                            number="05"
                            title="Donor Registration"
                        >
                            <p>
                                Users registering as blood donors may be asked
                                to provide personal information such as name,
                                age, gender, weight, blood group, contact
                                details, address, medical history,
                                identification documents, and photographs.
                            </p>

                            <p className="pb-4">
                                You agree that all information submitted during
                                donor registration is truthful and belongs to
                                you or has been submitted with appropriate
                                authorization.
                            </p>

                            <div className="text-foreground/75">
                                <strong>Medical eligibility:</strong> Completing
                                registration does not automatically guarantee
                                that you are medically eligible to donate blood.
                                Final eligibility must be determined by
                                qualified medical professionals.
                            </div>
                        </Section>

                        <Section
                            id="medical"
                            number="06"
                            title="Blood Donation & Medical Disclaimer"
                        >
                            <p>
                                The platform may provide general eligibility
                                information, questionnaires, reminders, and
                                scheduling tools. Such information is provided
                                for coordination and educational purposes only.
                            </p>

                            <div className="text-foreground/75">
                                <strong>
                                    The platform does not provide medical
                                    diagnosis, treatment, or professional
                                    medical advice.
                                </strong>
                            </div>

                            <p>
                                A donor must follow the instructions of
                                qualified healthcare professionals and the blood
                                donation center.
                            </p>

                            <p>
                                The platform may publish articles covering blood
                                donation, health tips, myths, donor experiences,
                                and related topics. Educational content is
                                provided for general informational purposes and
                                should not be considered personalized medical
                                advice.
                            </p>

                            <p>
                                The platform may offer badges, points,
                                achievements, leaderboards, certificates, or
                                other recognition features based on donation
                                activity or participation. These features are
                                intended to encourage participation and do not
                                constitute financial compensation for donating
                                blood.
                            </p>
                        </Section>

                        <Section
                            id="requests"
                            number="07"
                            title="Blood Requests"
                        >
                            <p>
                                Users may submit blood requests by providing
                                information such as blood group, location,
                                quantity required, reason for the request, and
                                urgency.
                            </p>

                            <p>
                                Blood requests must be genuine and must not be
                                created for fraudulent, commercial, abusive, or
                                misleading purposes.
                            </p>

                            <p>
                                Submission of a request does not guarantee that
                                blood, donors, hospitals, or blood banks will be
                                available.
                            </p>
                        </Section>

                        <Section
                            id="emergency"
                            number="08"
                            title="Emergency SOS Requests"
                        >
                            <p>
                                The platform may provide an emergency request
                                feature that allows users to mark a blood
                                request as urgent and notify potentially
                                matching donors or organizations.
                            </p>

                            <div className="text-foreground/75">
                                <p className="font-bold">
                                    Emergency requests are not a replacement for
                                    emergency medical services.
                                </p>

                                <p className="mt-2 text-sm leading-6 text-foreground/75">
                                    In a life-threatening situation, immediately
                                    contact appropriate emergency medical
                                    services and the treating hospital.
                                </p>
                            </div>
                        </Section>

                        <Section id="roles" number="09" title="User Roles">
                            <p>
                                Depending on the platform configuration, users
                                may have different roles and permissions.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                {[
                                    [
                                        "Super Admin",
                                        "Overall platform administration.",
                                    ],
                                    [
                                        "Blood Bank Admin",
                                        "Manages their authorized blood bank.",
                                    ],
                                    [
                                        "Hospital Admin",
                                        "Manages hospital blood tasks.",
                                    ],
                                    [
                                        "Camp Organizer",
                                        "Creates and manages donation camps.",
                                    ],
                                    [
                                        "Donor",
                                        "Registers, donates, and views donation history.",
                                    ],
                                    [
                                        "Guest User",
                                        "Accesses publicly available information.",
                                    ],
                                ].map(([role, description]) => (
                                    <li key={role}>
                                        <p className="mt-1">
                                            <strong>{role}:</strong>{" "}
                                            {description}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        <Section
                            id="privacy"
                            number="10"
                            title="Privacy & Personal Information"
                        >
                            <p>
                                We may collect and process information required
                                to provide the platform&apos;s services,
                                including account information, donation
                                information, blood group, location-related
                                information, request information, uploaded
                                documents, and communication preferences.
                            </p>

                            <p>
                                We aim to protect personal information through
                                appropriate technical and organizational
                                safeguards.
                            </p>

                            <p>
                                Users should avoid posting sensitive personal
                                information publicly or sharing another
                                person&apos;s information without authorization.
                            </p>
                        </Section>

                        <Section
                            id="contact-protection"
                            number="11"
                            title="Contact Information Protection"
                        >
                            <p>
                                Where the platform provides privacy protection
                                for donor and recipient information, direct
                                contact details may be hidden until the
                                appropriate request or interaction has been
                                accepted.
                            </p>

                            <p>
                                Users must not attempt to bypass these privacy
                                controls or obtain another user&apos;s private
                                information without authorization.
                            </p>
                        </Section>

                        <Section
                            id="documents"
                            number="12"
                            title="Documents & Verification"
                        >
                            <p>
                                Users may be required to upload identification
                                documents, photographs, medical information, or
                                other supporting documents.
                            </p>

                            <p>
                                Documents must be authentic and must belong to
                                the person submitting them or be provided with
                                proper authorization.
                            </p>
                        </Section>

                        <Section
                            id="notifications"
                            number="13"
                            title="Notifications & Communications"
                        >
                            <p>
                                Depending on your settings and the services you
                                use, the platform may send notifications through
                                email, SMS, push notifications, or in-app
                                notifications.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>Blood request updates</li>
                                <li>Emergency notifications</li>
                                <li>Donation appointment reminders</li>
                                <li>Donation eligibility reminders</li>
                                <li>Blood camp reminders</li>
                                <li>Account and security notifications</li>
                            </ul>
                        </Section>

                        <Section
                            id="prohibited"
                            number="14"
                            title="Prohibited Activities"
                        >
                            <p>Users must not use the platform to:</p>

                            <ul className="list-disc space-y-2 pl-6">
                                {[
                                    "Submit false blood requests",
                                    "Provide false medical information",
                                    "Impersonate another person",
                                    "Upload fraudulent documents",
                                    "Harass or threaten users",
                                    "Obtain private information",
                                    "Access systems without authorization",
                                    "Introduce malware or harmful code",
                                    "Disrupt platform operations",
                                    "Abuse automated systems",
                                    "Conduct unlawful activities",
                                    "Misuse emergency features",
                                ].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </Section>

                        <Section
                            id="compatibility"
                            number="15"
                            title="Blood Group Compatibility"
                        >
                            <p>
                                The platform may provide a blood group
                                compatibility checker for educational and
                                informational purposes.
                            </p>

                            <p>
                                Compatibility information must not be used as
                                the sole basis for a transfusion decision.
                            </p>

                            <div className="text-foreground/75">
                                Blood transfusions must always be performed
                                under the supervision of qualified healthcare
                                professionals and according to applicable
                                medical protocols and testing requirements.
                            </div>
                        </Section>

                        <Section
                            id="intellectual"
                            number="16"
                            title="Intellectual Property"
                        >
                            <p>
                                Unless otherwise stated, the platform&apos;s
                                software, design, branding, logos, graphics,
                                text, interface, and original content are
                                protected by applicable intellectual property
                                laws.
                            </p>

                            <p>
                                Users may not reproduce, modify, distribute,
                                sell, or commercially exploit platform content
                                without appropriate authorization.
                            </p>
                        </Section>

                        <Section
                            id="third-party"
                            number="17"
                            title="Third-Party Services"
                        >
                            <p>
                                The platform may integrate with third-party
                                services, including mapping providers,
                                communication providers, authentication
                                services, cloud infrastructure, calendar
                                services, and social media platforms.
                            </p>

                            <p>
                                Third-party services may have their own terms,
                                policies, and privacy practices.
                            </p>
                        </Section>

                        <Section
                            id="accuracy"
                            number="18"
                            title="Accuracy of Information"
                        >
                            <p>
                                We make reasonable efforts to provide useful and
                                accurate information. However, blood stock,
                                donor availability, camp schedules, hospital
                                information, and request status may change
                                rapidly due to donations, transfusions,
                                reservations, expiry, testing, cancellations, or
                                other operational circumstances.
                            </p>

                            <p>
                                Blood inventory information may be provided by
                                hospitals, blood banks, administrators, or
                                authorized personnel. Displayed stock
                                information should not be treated as a guarantee
                                that blood will be available when you arrive at
                                a particular center.
                            </p>

                            <p>
                                Camp dates, venues, schedules, eligibility
                                requirements, and organizers may change. Users
                                should verify important details with the
                                relevant organizer before attending.
                            </p>

                            <p>
                                Users should verify critical information with
                                the relevant hospital, blood bank, healthcare
                                professional, or event organizer.
                            </p>
                        </Section>

                        <Section
                            id="responsibility"
                            number="19"
                            title="Limitation of Responsibility"
                        >
                            <p>
                                The platform serves primarily as a technology
                                and coordination service. We do not directly
                                control the actions of individual donors,
                                recipients, hospitals, blood banks, camp
                                organizers, or other third parties.
                            </p>

                            <p>
                                We aim to keep the platform available and
                                reliable, but continuous availability cannot be
                                guaranteed. The platform may occasionally become
                                unavailable due to maintenance, technical
                                failures, network problems, security incidents,
                                infrastructure failures, or other circumstances
                                beyond our reasonable control.
                            </p>

                            <p>We cannot guarantee that:</p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>A blood request will be fulfilled.</li>
                                <li>A donor will be available.</li>
                                <li>
                                    Blood stock information will always be
                                    current.
                                </li>
                                <li>
                                    A donation appointment will occur as
                                    scheduled.
                                </li>
                                <li>
                                    An emergency notification will reach every
                                    recipient.
                                </li>
                                <li>
                                    A donation camp will operate exactly as
                                    listed.
                                </li>
                            </ul>
                        </Section>

                        <Section id="security" number="20" title="Security">
                            <p>
                                We may use security measures such as encrypted
                                communication, authentication, access controls,
                                activity logging, session management, OTP
                                verification, and other safeguards to protect
                                the platform and its users.
                            </p>

                            <p>
                                However, no online system can be guaranteed to
                                be completely secure.
                            </p>
                        </Section>

                        <div className="border-t border-foreground/10 py-10 text-sm leading-6 text-foreground/50">
                            <p>
                                <strong className="text-foreground/70">
                                    Last updated:
                                </strong>{" "}
                                [Insert date]
                            </p>
                            <p className="mt-2">
                                <strong className="text-foreground/70">
                                    Governing law:
                                </strong>{" "}
                                These Terms are governed by the applicable laws
                                and regulations of the jurisdiction in which the
                                platform operator is legally established.
                            </p>
                            <p className="mt-2">
                                <strong className="text-foreground/70">
                                    Contact:
                                </strong>{" "}
                                For questions, concerns, complaints, or requests
                                regarding these Terms or the platform, please
                                contact the platform administrator through the
                                official support channels provided on the
                                website.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
