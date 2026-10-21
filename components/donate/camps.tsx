import { useMemo, useState } from "react";
import { BLOOD_TYPES } from "@/constants/profile";
import { CITIES, MOCK_CAMPS } from "@/lib/donate";
import { LuMapPin, LuDroplet, LuSearch } from "react-icons/lu";
import { CampCard } from "./camp-card";
import { DropdownSelect } from "../profile/dropdown-select";

const ALL_CITIES = "All cities";
const ANY_BLOOD_TYPE = "Any blood type";

export function Camps() {
    const [city, setCity] = useState(ALL_CITIES);
    const [bloodType, setBloodType] = useState(ANY_BLOOD_TYPE);
    const [query, setQuery] = useState("");

    const filteredCamps = useMemo(() => {
        const q = query.trim().toLowerCase();

        return MOCK_CAMPS.filter((camp) => {
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
    }, [city, bloodType, query]);

    return (
        <div className="flex flex-col w-full">
            <section className="mx-auto w-full">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
                        <LuMapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                        <DropdownSelect
                            value={city}
                            onChange={setCity}
                            options={CITIES}
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
                {filteredCamps.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                        <p className="text-sm font-medium text-neutral-500">
                            No camps match your filters.
                        </p>
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