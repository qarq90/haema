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
        <footer className="flex w-full flex-col px-6 pt-12 pb-10 sm:px-8 md:px-18 md:pt-20 md:pb-16 lg:px-28 xl:px-40">
            <section className="grid grid-cols-2 items-start gap-x-6 gap-y-10 py-8 sm:gap-x-10 md:grid-cols-4 md:gap-12 lg:gap-20">
                <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
                    <Link
                        href="/"
                        className="w-fit text-2xl font-bold uppercase tracking-tight"
                    >
                        {" "}
                        H<span className="lowercase text-4xl">α</span>EM
                        <span className="lowercase text-4xl">α</span>
                    </Link>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/75 md:mt-6">
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

                <div className="flex flex-col gap-3 md:gap-4">
                    <p className="text-base font-bold">Quick Links</p>

                    <nav className="mt-2 flex flex-col items-start gap-2 md:mt-6">
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

                <div className="flex flex-col gap-3 md:gap-4">
                    <p className="text-base font-bold">Support</p>

                    <nav className="mt-2 flex flex-col items-start gap-2 md:mt-6">
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

                <div className="relative col-span-2 mx-auto mt-0 aspect-square w-full max-w-[220px] shrink-0 sm:max-w-[240px] md:col-span-1 md:mx-0 md:mt-[-4rem] md:max-w-[280px] md:scale-110 lg:mt-[-7rem]">
                    <Image
                        src={hands_cupped}
                        alt="Blood donation illustration"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 280px"
                        className="object-contain"
                    />
                </div>

            </section>

            <div
                className="my-8 h-px w-full bg-foreground/10 md:my-16"
                aria-hidden="true"
            />

            <section className="flex flex-col items-center justify-between gap-4 py-4 text-center text-sm text-foreground/50 md:flex-row md:gap-12 md:py-8 md:text-left lg:gap-32">
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
