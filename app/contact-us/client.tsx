"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contactTypes } from "@/lib/contact-us";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Client() {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitted(true);
    }

    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Need help?
                    <br />
                    <span className="text-red-500">We're here.</span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/75">
                    Have a question about blood donation, blood requests, your
                    account, or the HAEMA platform? Send us a message and we'll
                    help you find the right information.
                </p>
            </section>

            <section className="mx-auto pt-12 px-6 sm:px-10 lg:px-16 lg:pt-20">
                <div className="grid grid-cols-1 gap-20 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">
                            How can we help?
                        </p>

                        <div className="border-t border-foreground/10">
                            {contactTypes.map((type) => (
                                <div
                                    key={type.number}
                                    className="group border-b border-foreground/10 py-7"
                                >
                                    <div className="flex gap-5">
                                        <span className="pt-2 font-mono text-xs text-red-500">
                                            {type.number}
                                        </span>

                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground/85">
                                                {type.title}
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-foreground/50">
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <p className="text-sm font-semibold text-foreground/75">
                                Medical emergencies
                            </p>

                            <p className="mt-2 text-sm leading-6 text-foreground/50">
                                HAEMA is a blood coordination platform and does
                                not replace emergency medical services. For a
                                medical emergency, contact the appropriate
                                emergency service or treating hospital directly.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="mb-8">
                            <p className="text-2xl font-bold text-foreground/85">
                                Send us a message
                            </p>

                            <p className="mt-2 text-sm text-foreground/50">
                                Fill in the form below and provide as much
                                relevant information as possible.
                            </p>
                        </div>

                        {submitted ? (
                            <div className="border border-foreground/10 px-8 py-16 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl text-white">
                                    ✓
                                </div>

                                <h2 className="mt-6 text-2xl font-bold">
                                    Message sent.
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground/50">
                                    Thanks for contacting HAEMA. Your message
                                    has been received.
                                </p>

                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 text-sm font-semibold text-red-500 hover:text-red-400"
                                >
                                    Send another message →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-3 block text-xs font-bold uppercase tracking-widest text-foreground/50"
                                    >
                                        Your name
                                    </label>

                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        className="w-full border-b border-foreground/15 bg-transparent px-0 py-4 text-base outline-none placeholder:text-foreground/25 focus:border-red-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-3 block text-xs font-bold uppercase tracking-widest text-foreground/50"
                                    >
                                        Email
                                    </label>

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full border-b border-foreground/15 bg-transparent px-0 py-4 text-base outline-none placeholder:text-foreground/25 focus:border-red-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-3 block text-xs font-bold uppercase tracking-widest text-foreground/50"
                                    >
                                        Subject
                                    </label>

                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        defaultValue=""
                                        className="w-full border-b border-foreground/15 bg-transparent px-0 py-4 text-base outline-none focus:border-red-500"
                                    >
                                        <option value="" disabled>
                                            Select a topic
                                        </option>

                                        <option value="general">
                                            General Support
                                        </option>

                                        <option value="donation">
                                            Blood Donation
                                        </option>

                                        <option value="request">
                                            Blood Request
                                        </option>

                                        <option value="account">Account</option>

                                        <option value="privacy">
                                            Privacy & Security
                                        </option>

                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-3 block text-xs font-bold uppercase tracking-widest text-foreground/50"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        placeholder="Tell us how we can help..."
                                        className="w-full resize-none border-b border-foreground/15 bg-transparent px-0 py-4 text-base outline-none placeholder:text-foreground/25 focus:border-red-500"
                                    />
                                </div>

                                <div className="pt-2 mb-8">
                                    <Button type="submit" className="w-full">
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section className="border-t border-foreground/10 px-6 py-20 sm:px-10 lg:px-16">
                <div className="flex flex-col gap-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                            Before contacting us
                        </p>

                        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                            You might find the answer
                            <br />
                            in our FAQs.
                        </h2>
                    </div>

                    <Link href="/faqs">
                        <Button>Visit FAQs</Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
