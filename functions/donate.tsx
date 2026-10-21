import { eligibilityQuestions } from "@/lib/donate";
import { EligibilityAnswer, EligibilityResult, EligibilityQuestion } from "@/types/donate";

export function evaluateEligibility(
    answers: Record<string, EligibilityAnswer>,
): EligibilityResult {
    const disqualifiedBy: EligibilityQuestion[] = [];
    const reasons: string[] = [];
    let maxRetryDays = 0;

    for (const q of eligibilityQuestions) {
        const answer = answers[q.id];
        if (answer === undefined || answer === null) continue;

        let disqualified = false;

        if (q.type === "boolean") {
            if (q.disqualifyIfYes === true && answer === true)
                disqualified = true;
            if (q.disqualifyIfYes === false && answer === false)
                disqualified = true;
        }

        if (q.type === "select" && q.options) {
            const opt = q.options.find((o) => o.value === answer);
            if (opt?.disqualifies) disqualified = true;
        }

        if (disqualified) {
            disqualifiedBy.push(q);
            if (q.disqualifyReason) reasons.push(q.disqualifyReason);
            if (q.retryAfterDays && q.retryAfterDays > maxRetryDays) {
                maxRetryDays = q.retryAfterDays;
            }
        }
    }

    const retryAfter =
        maxRetryDays > 0
            ? new Date(Date.now() + maxRetryDays * 24 * 60 * 60 * 1000)
            : undefined;

    return {
        eligible: disqualifiedBy.length === 0,
        disqualifiedBy,
        retryAfter,
        reasons,
    };
}