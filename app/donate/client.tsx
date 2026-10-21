"use client";

import { useState } from "react";
import { EligibilityAnswer, EligibilityResult, Stage } from "@/types/donate";
import Result from "@/components/donate/result";
import Intro from "@/components/donate/intro";
import Quiz from "@/components/donate/quiz";
import { evaluateEligibility } from "@/functions/donate";
import { eligibilityQuestions } from "@/lib/donate";
import { Camps } from "@/components/donate/camps";

export default function Client() {
    const [stage, setStage] = useState<Stage>("intro");
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, EligibilityAnswer>>(
        {},
    );
    const [result, setResult] = useState<EligibilityResult | null>(null);

    const total = eligibilityQuestions.length;

    const handleStart = () => setStage("quiz");

    const handleAnswer = (value: EligibilityAnswer) => {
        const current = eligibilityQuestions[step];
        const next = { ...answers, [current.id]: value };
        setAnswers(next);

        if (step + 1 < total) {
            setStep(step + 1);
        } else {
            setResult(evaluateEligibility(next));
            setStage("result");
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleReset = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
        setStage("intro");
    };

    return (
        <main className="min-h-screen">
            <section className="pt-24 sm:px-10 lg:pt-20 max-w-7xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Donate
                </h1>
            </section>

            <section className="mx-auto w-full flex flex-row gap-8 px-3 pt-12">
                {stage === "intro" && <Intro onStart={handleStart} />}

                {stage === "quiz" && (
                    <Quiz
                        step={step}
                        total={total}
                        answers={answers}
                        onAnswer={handleAnswer}
                        onBack={handleBack}
                    />
                )}

                {stage === "result" && result && (
                    <Result result={result} onReset={handleReset} />
                )}
            </section>

            <section className="lg:pt-20 px-8">
                <h1 className="text-4xl py-4 font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    Camps
                </h1>
                <p className="text-sm text-neutral-500 py-4">
                    Used to match you with the right donation slots.
                </p>
                <Camps />
            </section>
        </main>
    );
}
