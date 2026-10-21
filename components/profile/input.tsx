export function Input({
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
        />
    );
}
