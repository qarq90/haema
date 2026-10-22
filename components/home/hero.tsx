import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import android_hand from "../../public/imgs/android_hand.png";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const Hero = () => {
    return (
        <section className="w-full h-dvh flex flex-row gap-32 items-center -mt-12">
            <div className="h-full w-3/5 shrink-0 flex flex-col justify-around">
                <p></p>
                <p></p>
                <p className="text-8xl leading-32 relative w-full">
                    <span>
                        Today{" "}
                        <span className="uppercase text-theme font-bold">
                            you
                        </span>{" "}
                        give. <br /> Tomorrow <br />{" "}
                        <span className="uppercase text-theme font-bold">
                            Someone
                        </span>{" "}
                        gives <br />
                        <span className="uppercase text-theme font-bold">
                            you
                        </span>{" "}
                        back.
                    </span>
                </p>

                <div className="flex flex-row gap-4">
                    <SignInButton mode="redirect">
                        <Button>Register Now</Button>
                    </SignInButton>
                    <Link
                        href="/donate"
                        className="text-sm font-semibold text-red-500 hover:underline"
                    >
                        <Button>Donate Blood</Button>
                    </Link>
                    <Link
                        href="/request"
                        className="text-sm font-semibold text-red-500 hover:underline"
                    >
                        <Button>Request Blood</Button>
                    </Link>
                    <Link
                        href="/camps"
                        className="text-sm font-semibold text-red-500 hover:underline"
                    >
                        <Button>Blood Camps</Button>
                    </Link>
                </div>

                <p></p>
            </div>

            <div className="h-full w-2/5 shrink-0 flex items-center scale-x-[-1] justify-center -ml-16">
                <div className="relative h-full w-full rounded-lg">
                    <Image
                        src={android_hand}
                        alt=""
                        fill
                        className="object-contain rounded-lg"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};
