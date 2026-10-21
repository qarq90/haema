"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { socials, quickLinks, supportLinks } from "@/lib/footer";
import hands_cupped from "../public/imgs/hands_cupped.png";
import Image from "next/image";

export const Footer = () => {
    const pathname = usePathname();
    if (pathname.includes("/sign-in")) return;

    return (
        <footer className="w-full flex flex-col px-6 md:px-18 lg:px-28 xl:px-40 pt-20 pb-16">
            <section className="flex flex-row gap-12 justify-between lg:gap-32 py-8 items-start">
                <div></div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="w-fit text-2xl font-bold uppercase tracking-tight"
                    >
                        {" "}
                        H<span className="lowercase text-4xl">α</span>EM
                        <span className="lowercase text-4xl">α</span>
                    </Link>

                    <p className="mt-6 max-w-sm text-sm leading-6 text-foreground/75">
                        Every drop tells a story. We connect donors, patients,
                        and hospitals so no one waits for the blood that could
                        save them.
                    </p>

                    <div className="flex items-center gap-4">
                        {socials.map(({ icon: Icon, href, label }) => (
                            <Link
                                key={label}
                                href={href}
                                aria-label={label}
                                className="
                                    hover:rotate-360
                                    group flex h-12 w-12 items-center justify-center
                                    rounded-full
                                    text-foreground
                                    transition-all duration-300
                                    hover:border-theme hover:text-theme
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-theme/50
                                "
                            >
                                <Icon
                                    size={19}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-base font-bold">Quick Links</p>

                    <nav className="mt-6 flex flex-col items-start gap-2">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="
                                    text-sm text-foreground/75
                                    transition-colors duration-200
                                    hover:text-foreground
                                "
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-base font-bold">Support</p>

                    <nav className="mt-6 flex flex-col items-start gap-2">
                        {supportLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="
                                    text-sm text-foreground/75
                                    transition-colors duration-200
                                    hover:text-foreground
                                "
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-[280px] shrink-0 lg:mx-0 -mt-28 scale-125">
                    <Image
                        src={hands_cupped}
                        alt="Blood donation illustration"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 280px"
                        className="object-contain"
                    />
                </div>

                <div></div>
            </section>

            <div
                className="my-16 h-px w-full bg-foreground/10"
                aria-hidden="true"
            />

            <section className="flex flex-row gap-12 justify-between lg:gap-32 py-8 items-start text-sm text-foreground/50 md:flex-row md:items-center md:justify-between py-8">
                <p>© {new Date().getFullYear()} HAEMA. All rights reserved.</p>

                <div className="flex items-center gap-4">
                    <span>Donate Blood</span>

                    <span className="text-foreground/20">/</span>

                    <span>Save Lives</span>
                </div>
            </section>
        </footer>
    );
};
