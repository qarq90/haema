"use client";

import { Section } from "@/components/common/section";
import { sections } from "@/lib/privacy-policy";

export default function Client() {
    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Privacy Policy
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
                                This Privacy Policy explains how HAEMA collects,
                                uses, protects, and handles personal information
                                when you use our blood donation and blood
                                request platform.
                            </p>

                            <p className="text-sm text-foreground/40">
                                Last updated: September 2026
                            </p>
                        </div>

                        <Section
                            id="introduction"
                            number="01"
                            title="Introduction"
                        >
                            <p>
                                HAEMA is a digital platform designed to help
                                coordinate blood donors, people requiring blood,
                                hospitals, blood banks, and blood donation
                                camps.
                            </p>

                            <p>
                                We understand that blood donation and blood
                                requests may involve personal and sensitive
                                information. This Privacy Policy explains what
                                information may be collected through the
                                platform, why it is used, and how we aim to
                                protect it.
                            </p>

                            <p>
                                By using HAEMA, you acknowledge the practices
                                described in this Privacy Policy.
                            </p>
                        </Section>

                        <Section
                            id="information-we-collect"
                            number="02"
                            title="Information We Collect"
                        >
                            <p>
                                Depending on the features you use, we may
                                collect information necessary to provide and
                                operate the platform.
                            </p>

                            <p>Information may include:</p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>Name and account details</li>
                                <li>Email address and phone number</li>
                                <li>Blood group</li>
                                <li>Age and other registration information</li>
                                <li>Donation-related information</li>
                                <li>Blood request information</li>
                                <li>Location-related information</li>
                                <li>Uploaded documents and photographs</li>
                                <li>Communication preferences</li>
                                <li>Account and platform activity</li>
                            </ul>

                            <p>
                                The specific information collected depends on
                                which services and features you choose to use.
                            </p>
                        </Section>

                        <Section
                            id="account-information"
                            number="03"
                            title="Account Information"
                        >
                            <p>
                                When you create an account, we may collect
                                information such as your name, email address,
                                phone number, username, and authentication
                                information.
                            </p>

                            <p>
                                This information is used to create and maintain
                                your account, authenticate you, provide platform
                                functionality, and communicate important
                                account-related information.
                            </p>

                            <p>
                                You are responsible for keeping your account
                                credentials secure and should notify us if you
                                believe your account has been accessed without
                                authorization.
                            </p>
                        </Section>

                        <Section
                            id="donor-information"
                            number="04"
                            title="Donor Information"
                        >
                            <p>
                                Users registering as blood donors may be asked
                                to provide information such as name, age,
                                gender, weight, blood group, contact details,
                                address, medical history, identification
                                documents, and photographs.
                            </p>

                            <p>
                                Donor information may be used to facilitate
                                donation registration, eligibility-related
                                workflows, donation appointments, blood
                                requests, donation history, and communication.
                            </p>

                            <div className="text-foreground/75">
                                <strong>
                                    Providing donor information does not
                                    automatically establish medical eligibility
                                    to donate blood.
                                </strong>
                            </div>
                        </Section>

                        <Section
                            id="blood-requests"
                            number="05"
                            title="Blood Request Information"
                        >
                            <p>
                                When submitting a blood request, users may
                                provide information such as blood group,
                                location, quantity required, reason for the
                                request, and urgency.
                            </p>

                            <p>
                                This information may be used to coordinate blood
                                requests and notify potentially matching donors,
                                hospitals, blood banks, or authorized
                                organizations.
                            </p>

                            <p>
                                Users should only provide information that is
                                necessary for the relevant request.
                            </p>
                        </Section>

                        <Section
                            id="documents"
                            number="06"
                            title="Documents & Verification"
                        >
                            <p>
                                Certain platform features may require users to
                                upload identification documents, photographs,
                                medical information, or other supporting
                                documents.
                            </p>

                            <p>
                                Documents may be used for identity, eligibility,
                                organizational, or other verification purposes
                                associated with the platform.
                            </p>

                            <p>
                                Users should only upload authentic documents
                                that they are authorized to provide.
                            </p>
                        </Section>

                        <Section
                            id="location"
                            number="07"
                            title="Location Information"
                        >
                            <p>
                                Some features may require location-related
                                information to help users find nearby blood
                                banks, hospitals, donation camps, donors, or
                                other relevant services.
                            </p>

                            <p>
                                Location information may also be associated with
                                blood requests when necessary for coordination.
                            </p>

                            <p>
                                Where possible, users should avoid sharing more
                                precise location information than is necessary
                                for the intended feature.
                            </p>
                        </Section>

                        <Section
                            id="communications"
                            number="08"
                            title="Communications"
                        >
                            <p>
                                Depending on your settings and the services you
                                use, HAEMA may communicate with you through
                                email, SMS, push notifications, or in-app
                                notifications.
                            </p>

                            <p>Communications may include:</p>

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
                            id="how-we-use"
                            number="09"
                            title="How We Use Your Information"
                        >
                            <p>
                                We may use collected information to operate,
                                maintain, and improve the platform.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>Create and manage user accounts</li>
                                <li>Facilitate blood donation activities</li>
                                <li>Process blood requests</li>
                                <li>Coordinate donors and recipients</li>
                                <li>Provide donation camp information</li>
                                <li>Send important notifications</li>
                                <li>Verify users and submitted information</li>
                                <li>Maintain platform security</li>
                                <li>Prevent misuse and fraudulent activity</li>
                                <li>Improve platform functionality</li>
                            </ul>
                        </Section>

                        <Section
                            id="sharing"
                            number="10"
                            title="When We Share Information"
                        >
                            <p>
                                We do not intend to make users' personal
                                information publicly available unless it is
                                necessary for a feature or the user has
                                authorized its disclosure.
                            </p>

                            <p>
                                Information may be shared with authorized
                                hospitals, blood banks, administrators, camp
                                organizers, donors, recipients, service
                                providers, or other parties when necessary to
                                provide the requested platform service.
                            </p>

                            <p>
                                Information may also be disclosed when required
                                by applicable law, legal process, or to protect
                                the security and integrity of the platform.
                            </p>
                        </Section>

                        <Section
                            id="contact-protection"
                            number="11"
                            title="Contact Information Protection"
                        >
                            <p>
                                Where the platform provides privacy controls for
                                donor and recipient information, direct contact
                                details may be hidden until the appropriate
                                request or interaction has been accepted.
                            </p>

                            <p>
                                Users must not attempt to bypass these controls
                                or obtain another user's private contact
                                information without authorization.
                            </p>
                        </Section>

                        <Section
                            id="third-party"
                            number="12"
                            title="Third-Party Services"
                        >
                            <p>
                                HAEMA may use third-party services to support
                                platform functionality.
                            </p>

                            <p>These services may include:</p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>Cloud infrastructure</li>
                                <li>Authentication services</li>
                                <li>Mapping providers</li>
                                <li>Communication providers</li>
                                <li>Analytics or monitoring services</li>
                                <li>Calendar or scheduling services</li>
                            </ul>

                            <p>
                                Third-party services may process information
                                according to their own privacy policies and
                                terms.
                            </p>
                        </Section>

                        <Section
                            id="cookies"
                            number="13"
                            title="Cookies & Similar Technologies"
                        >
                            <p>
                                HAEMA may use cookies, local storage, session
                                technologies, or similar mechanisms to maintain
                                authentication sessions, remember preferences,
                                improve functionality, and maintain platform
                                security.
                            </p>

                            <p>
                                The use of these technologies may vary depending
                                on the features and configuration of the
                                platform.
                            </p>
                        </Section>

                        <Section
                            id="security"
                            number="14"
                            title="Data Security"
                        >
                            <p>
                                We aim to protect personal information through
                                appropriate technical and organizational
                                safeguards.
                            </p>

                            <p>
                                Depending on the platform configuration,
                                security measures may include encrypted
                                communication, authentication, access controls,
                                activity logging, session management, OTP
                                verification, and other safeguards.
                            </p>

                            <div className="text-foreground/75">
                                <strong>
                                    No online system can be guaranteed to be
                                    completely secure.
                                </strong>
                            </div>
                        </Section>

                        <Section
                            id="retention"
                            number="15"
                            title="Data Retention"
                        >
                            <p>
                                We may retain personal information for as long
                                as necessary to provide the requested services,
                                maintain account functionality, comply with
                                applicable obligations, resolve disputes, and
                                protect the security of the platform.
                            </p>

                            <p>
                                The length of time information is retained may
                                depend on the type of information and the
                                purpose for which it was collected.
                            </p>
                        </Section>

                        <Section
                            id="your-rights"
                            number="16"
                            title="Your Privacy Rights"
                        >
                            <p>
                                Depending on applicable law and the
                                configuration of the platform, users may have
                                rights relating to their personal information.
                            </p>

                            <ul className="list-disc space-y-2 pl-6">
                                <li>Request access to personal information</li>
                                <li>
                                    Request correction of inaccurate information
                                </li>
                                <li>Request deletion of certain information</li>
                                <li>Update account information</li>
                                <li>
                                    Manage available communication preferences
                                </li>
                                <li>Request information about data handling</li>
                            </ul>

                            <p>
                                Requests may be subject to identity verification
                                and applicable legal requirements.
                            </p>
                        </Section>

                        <Section
                            id="account-deletion"
                            number="17"
                            title="Account Deletion"
                        >
                            <p>
                                Users may request account deactivation or
                                deletion through available account settings or
                                official support channels.
                            </p>

                            <p>
                                Some information may need to be retained where
                                required for legal, security, operational, or
                                other legitimate purposes.
                            </p>
                        </Section>

                        <Section
                            id="children"
                            number="18"
                            title="Children's Privacy"
                        >
                            <p>
                                HAEMA is not intended to knowingly collect
                                personal information from children in situations
                                where such collection is prohibited by
                                applicable law.
                            </p>

                            <p>
                                If you believe that a child has provided
                                personal information to the platform without
                                appropriate authorization, please contact the
                                platform administrator.
                            </p>
                        </Section>

                        <Section
                            id="medical-information"
                            number="19"
                            title="Medical Information"
                        >
                            <p>
                                Some donor registration and blood-related
                                features may involve medical or health-related
                                information.
                            </p>

                            <p>
                                Such information should only be provided when
                                required for the relevant platform feature and
                                should be accurate to the best of the user's
                                knowledge.
                            </p>

                            <p>
                                HAEMA is a technology and coordination platform
                                and does not replace qualified healthcare
                                professionals or medical institutions.
                            </p>
                        </Section>

                        <Section
                            id="changes"
                            number="20"
                            title="Changes to This Privacy Policy"
                        >
                            <p>
                                We may update this Privacy Policy from time to
                                time to reflect changes to the platform,
                                applicable laws, security requirements, or
                                services.
                            </p>

                            <p>
                                Updated versions will be published on this page
                                with a revised "Last updated" date.
                            </p>

                            <p>
                                We encourage users to review this page
                                periodically for changes.
                            </p>
                        </Section>

                        <Section id="contact" number="21" title="Contact Us">
                            <p>
                                If you have questions, concerns, complaints, or
                                requests regarding this Privacy Policy or the
                                handling of your personal information, please
                                contact the HAEMA platform administrator through
                                the official support channels provided on the
                                website.
                            </p>
                        </Section>
                    </article>
                </div>
            </div>
        </main>
    );
}
