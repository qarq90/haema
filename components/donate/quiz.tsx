import { Button } from "@/components/ui/button";
import { eligibilityQuestions } from "@/lib/donate";
import { EligibilityAnswer } from "@/types/donate";
import AnswerHistory from "./answer-history";
import ProgressBar from "./progress-bar";

type Props = {
    step: number;
    total: number;
    answers: Record<string, EligibilityAnswer>;
    onAnswer: (value: EligibilityAnswer) => void;
    onBack: () => void;
};

export default function Quiz({
    step,
    total,
    answers,
    onAnswer,
    onBack,
}: Props) {
    const current = eligibilityQuestions[step];

    const options =
        current.type === "boolean"
            ? [
                  { label: "Yes", value: true },
                  { label: "No", value: false },
              ]
            : (current.options ?? []);

    return (
        <div className="flex w-full flex-col gap-4 px-8">
            <ProgressBar step={step} total={total} />

            <div className="transition-all duration-300">
                <p className="text-xs uppercase tracking-widest text-foreground/50">
                    {current.label}
                </p>

                <h2 className="mt-3 text-2xl font-semibold leading-snug">
                    {current.question}
                </h2>

                {current.hint && (
                    <p className="mt-2 text-sm text-foreground/60">
                        {current.hint}
                    </p>
                )}

                <div className="mt-8 grid w-full grid-cols-2 gap-3">
                    {options.map((opt) => (
                        <button
                            key={String(opt.value)}
                            onClick={() => onAnswer(opt.value)}
                            className="group flex items-center justify-center rounded-xl border border-foreground/10 px-5 py-4 text-left transition-all duration-300 hover:border-theme/40 hover:bg-theme/15"
                        >
                            <span className="font-medium">{opt.label}</span>
                        </button>
                    ))}
                </div>

                {step > 0 && (
                    <Button
                        onClick={onBack}
                        className="mt-6 text-sm text-foreground/50 hover:text-foreground"
                    >
                        Previous Question
                    </Button>
                )}
            </div>

            {/* {step > 0 && <AnswerHistory step={step} answers={answers} />} */}
        </div>
    );
}