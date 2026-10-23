import { Button } from "../ui/button";
import Image from "next/image";
import android_hand from "../../public/imgs/android_hand.png";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const Hero = () => {
    return (
        <section className="-mt-12 flex min-h-dvh w-full flex-col items-center gap-4 pt-32 px-10 pb-8 md:h-dvh md:min-h-0 md:flex-row md:gap-32 md:pt-0 md:pb-0">
            <div className="flex w-full shrink-0 flex-col gap-8 md:h-full md:w-3/5 md:justify-around md:gap-0">
                <h1 className="relative w-full text-4xl leading-tight sm:text-6xl md:text-8xl md:leading-32">
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
                </h1>

                <div className="flex flex-wrap gap-3 md:flex-row md:gap-4">
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

            <div className="relative h-[32vh] min-h-56 w-full shrink-0 scale-x-[-1] md:ml-[-4rem] md:flex md:h-full md:w-2/5 md:items-center md:justify-center">
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
