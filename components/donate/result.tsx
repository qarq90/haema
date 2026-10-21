import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EligibilityResult } from "@/types/donate";
import andriod_give from "../../public/imgs/andriod_give.png";
import andriod_kneel from "../../public/imgs/andriod_kneel.png";

type Props = {
    result: EligibilityResult;
    onReset: () => void;
};

export default function Result({ result, onReset }: Props) {
    return (
        <div className="flex w-full flex-row items-center gap-16 rounded-xl transition-all duration-300 px-8">
            <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-foreground/50">
                    Eligibility Result
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                    {result.eligible ? (
                        <>You're eligible to donate</>
                    ) : (
                        <>You're not eligible right now</>
                    )}
                </h2>

                {result.eligible ? (
                    <EligibleResult onReset={onReset} />
                ) : (
                    <NotEligibleResult result={result} onReset={onReset} />
                )}

                <p className="mt-8 text-xs text-foreground/40">
                    This screening is a guide, not a medical diagnosis. Final
                    eligibility is confirmed by medical staff at the camp.
                </p>
            </div>

            <div className="relative h-[400px] w-1/3 shrink-0">
                <Image
                    src={result.eligible ? andriod_give : andriod_kneel}
                    alt={
                        result.eligible
                            ? "Eligible to donate blood illustration"
                            : "Not eligible to donate blood right now illustration"
                    }
                    fill
                    className="object-contain rounded-lg"
                    priority
                />
            </div>
        </div>
    );
}

function EligibleResult({ onReset }: { onReset: () => void }) {
    return (
        <>
            <p className="mt-4 text-foreground/70">
                Great — you've passed the pre-donation screening. Book a slot at
                a nearby camp and our medical team will do a quick check before
                your donation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-red-500 hover:bg-red-600">
                    Book a Camp
                </Button>
                <Button onClick={onReset}>Retake Quiz</Button>
            </div>
        </>
    );
}

function NotEligibleResult({
    result,
    onReset,
}: {
    result: EligibilityResult;
    onReset: () => void;
}) {
    return (
        <>
            <p className="mt-4 text-foreground/70">
                Based on your answers, you can't donate right now. Here's why:
            </p>
            <ul className="mt-4 space-y-2">
                {result.reasons.map((reason, i) => (
                    <li
                        key={i}
                        className="flex gap-2 text-sm text-foreground/80"
                    >
                        <span className="text-red-500">•</span>
                        {reason}
                    </li>
                ))}
            </ul>

            {result.retryAfter && (
                <p className="mt-6 text-sm text-foreground/60">
                    You can try again after{" "}
                    <strong className="text-foreground/80">
                        {result.retryAfter.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </strong>
                    .
                </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={onReset}>Retake Quiz</Button>
            </div>
        </>
    );
}
