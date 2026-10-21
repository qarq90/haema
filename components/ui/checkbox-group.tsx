import { Checkbox } from "./checkbox";

export function CheckboxGroup({
    options,
    selected,
    onChange,
    columns = 3,
}: {
    options: string[];
    selected: string[];
    onChange: (next: string[]) => void;
    columns?: number;
}) {
    const toggle = (option: string) => {
        if (option === "None") {
            onChange(selected.includes("None") ? [] : ["None"]);
            return;
        }

        const withoutNone = selected.filter((s) => s !== "None");

        if (withoutNone.includes(option)) {
            onChange(withoutNone.filter((s) => s !== option));
        } else {
            onChange([...withoutNone, option]);
        }
    };

    const gridCols =
        columns === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : columns === 3
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-4";

    return (
        <div className={`grid ${gridCols} gap-2`}>
            {options.map((option) => (
                <Checkbox
                    key={option}
                    label={option}
                    checked={selected.includes(option)}
                    onChange={() => toggle(option)}
                />
            ))}
        </div>
    );
}
