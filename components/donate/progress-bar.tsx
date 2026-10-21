type Props = {
    step: number;
    total: number;
};

export default function ProgressBar({ step, total }: Props) {
    const progress = ((step + 1) / total) * 100;

    return (
        <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-foreground/50">
                <span>
                    Step {step + 1} of {total}
                </span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                <div
                    className="h-full rounded-full bg-red-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}