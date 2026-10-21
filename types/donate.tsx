export type EligibilityAnswer = boolean | string | number;

export type Stage = "intro" | "quiz" | "result";

export type QuestionType = "boolean" | "select" | "number";

export interface EligibilityOption {
    label: string;
    value: string;
    disqualifies?: boolean;
}

export interface EligibilityQuestion {
    id: string;
    label: string;
    question: string;
    hint?: string;
    type: QuestionType;
    options?: EligibilityOption[];
    min?: number;
    max?: number;
    unit?: string;
    disqualifyIfYes?: boolean;
    retryAfterDays?: number;
    disqualifyReason?: string;
}

export interface EligibilityResult {
    eligible: boolean;
    disqualifiedBy: EligibilityQuestion[];
    retryAfter?: Date;
    reasons: string[];
}

export type Camp = {
    id: string;
    name: string;
    hospital: string;
    address: string;
    city: string;
    date: string;
    startTime: string;
    endTime: string;
    slotsTotal: number;
    slotsLeft: number;
    needs: string[];
};
