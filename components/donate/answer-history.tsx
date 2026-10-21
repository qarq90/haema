import { eligibilityQuestions } from "@/lib/donate";
import { EligibilityAnswer } from "@/types/donate";

type Props = {
    step: number;
    answers: Record<string, EligibilityAnswer>;
};

export default function AnswerHistory({ step, answers }: Props) {
    return (
        <div className="mt-8 space-y-2 text-sm text-foreground/50">
            {eligibilityQuestions.slice(0, step).map((q) => (
                <div key={q.id} className="flex items-center justify-between">
                    <span>{q.label}</span>
                    <span className="text-foreground/70">
                        {String(answers[q.id])}
                    </span>
                </div>
            ))}
        </div>
    );
}
