import { useEffect, useMemo, useState } from "react";
import { BLOOD_TYPES } from "@/constants/profile";
import { LuMapPin, LuDroplet, LuSearch } from "react-icons/lu";
import { CampCard } from "./camp-card";
import { DropdownSelect } from "../profile/dropdown-select";
import type { Camp } from "@/types/donate";

const ALL_CITIES = "All cities";
const ANY_BLOOD_TYPE = "Any blood type";

export function Camps() {
    const [camps, setCamps] = useState<Camp[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [city, setCity] = useState(ALL_CITIES);
    const [bloodType, setBloodType] = useState(ANY_BLOOD_TYPE);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadCamps = async () => {
            try {
                const response = await fetch("/api/camps");
                const result: { camps?: Camp[]; error?: string } =
                    await response.json();
                if (!response.ok) {
                    throw new Error(result.error ?? "Could not load camps.");
                }
                if (!cancelled) {
                    setCamps(result.camps ?? []);
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : "Could not load camps.",
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void loadCamps();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredCamps = useMemo(() => {
        const q = query.trim().toLowerCase();

        return camps.filter((camp) => {
            if (city !== ALL_CITIES && camp.city !== city) return false;

            if (bloodType !== ANY_BLOOD_TYPE) {
                const needsAll = camp.needs.length === 0;
                if (!needsAll && !camp.needs.includes(bloodType)) return false;
            }

            if (q) {
                const haystack = [
                    camp.name,
                    camp.hospital,
                    camp.address,
                    camp.city,
                ]
                    .join(" ")
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }

            return true;
        });
    }, [camps, city, bloodType, query]);
    const cityOptions = [ALL_CITIES, ...new Set(camps.map((camp) => camp.city))];

    return (
        <div className="flex flex-col w-full">
            <section className="mx-auto w-full">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
                        <LuMapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                        <DropdownSelect
                            value={city}
                            onChange={setCity}
                            options={cityOptions}
                            placeholder={ALL_CITIES}
                        />
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
                        <LuDroplet className="h-4 w-4 shrink-0 text-neutral-500" />
                        <DropdownSelect
                            value={bloodType}
                            onChange={setBloodType}
                            options={[ANY_BLOOD_TYPE, ...BLOOD_TYPES]}
                            placeholder={ANY_BLOOD_TYPE}
                        />
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
                        <LuSearch className="h-4 w-4 shrink-0 text-neutral-500" />
                        <input
                            name="q"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search camps…"
                            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full pb-24 pt-8">
                {loading ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                        <p role="status" className="text-sm font-medium text-neutral-500">Loading camps…</p>
                    </div>
                ) : loadError ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 py-12 text-center">
                        <p role="alert" className="text-sm font-medium text-destructive">{loadError}</p>
                    </div>
                ) : filteredCamps.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                        {camps.length === 0 ? (
                            <p className="text-sm font-medium text-neutral-500">
                                No camps are listed yet.
                            </p>
                        ) : (
                            <p className="text-sm font-medium text-neutral-500">
                                No camps match your filters.
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setCity(ALL_CITIES);
                                setBloodType(ANY_BLOOD_TYPE);
                                setQuery("");
                            }}
                            className="mt-3 text-sm font-semibold text-red-500 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCamps.map((camp) => (
                            <CampCard key={camp.id} camp={camp} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
