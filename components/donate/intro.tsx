import Image from "next/image";
import { Button } from "@/components/ui/button";
import arm_injection from "../../public/imgs/arm_injection.png";
import { bullets } from "@/constants/donate";

type Props = {
    onStart: () => void;
};

export default function Intro({ onStart }: Props) {
    return (
        <div className="flex w-full flex-row items-center gap-16">
            <div className="flex-1 p-8 transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-foreground/50">
                    Before you donate
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-snug">
                    Take the{" "}
                    <span className="text-red-500">eligibility test</span>
                </h2>

                <p className="mt-4 text-foreground/70">
                    A quick 10-question screening to check if you can safely
                    donate blood today. It takes about 30 seconds and helps you
                    avoid a wasted trip to the camp.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-foreground/60">
                    {bullets.map((text) => (
                        <li key={text} className="flex gap-2">
                            <span className="text-red-500">•</span>
                            {text}
                        </li>
                    ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                        onClick={onStart}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Start Eligibility Test →
                    </Button>
                </div>
            </div>

            <div className="relative h-[400px] w-1/3 shrink-0">
                <Image
                    src={arm_injection}
                    alt="Blood donation illustration"
                    fill
                    className="object-contain rounded-lg"
                    priority
                />
            </div>
        </div>
    );
}
