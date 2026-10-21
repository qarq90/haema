import { FiMinus, FiPlus } from "react-icons/fi";

export function Stepper({
    value,
    onChange,
    min = 0,
    max = 999,
    step = 1,
    unit,
}: {
    value: string;
    onChange: (v: string) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}) {
    const num = value === "" ? 0 : Number(value);

    const clamp = (n: number) => Math.min(max, Math.max(min, n));

    const increment = () => onChange(String(clamp(num + step)));
    const decrement = () => onChange(String(clamp(num - step)));

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={decrement}
                disabled={num <= min}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-900"
                aria-label="Decrement"
            >
                <FiMinus className="h-4 w-4" />
            </button>

            <div className="flex flex-1 items-center justify-center gap-1 rounded-md py-1.5">
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={(e) =>
                        e.target.value !== "" &&
                        onChange(String(clamp(Number(e.target.value))))
                    }
                    className="w-14 bg-transparent text-center text-sm font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                {unit && (
                    <span className="text-xs text-neutral-500">{unit}</span>
                )}
            </div>

            <button
                type="button"
                onClick={increment}
                disabled={num >= max}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-neutral-900"
                aria-label="Increment"
            >
                <FiPlus className="h-4 w-4" />
            </button>
        </div>
    );
}
