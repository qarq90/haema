export function Textarea({
    value,
    onChange,
    placeholder,
    rows = 3,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            rows={rows}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-none bg-transparent text-sm font-medium leading-relaxed outline-none placeholder:text-neutral-400"
        />
    );
}