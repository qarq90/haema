"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BLOOD_TYPES } from "@/constants/profile";
import { Button } from "@/components/ui/button";
import {
  LuDroplet,
  LuMapPin,
  LuClock3,
  LuPackageSearch,
  LuRefreshCw,
} from "react-icons/lu";

type InventoryEntry = {
  bloodType: string;
  units: number;
  locationCount: number;
  lastUpdated: string | null;
};

export default function Client() {
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportingLocations, setReportingLocations] = useState(0);
  const [restockMessage, setRestockMessage] = useState<string | null>(null);
  const [restockError, setRestockError] = useState<string | null>(null);
  const [restockSubmitting, setRestockSubmitting] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; bloodType: string; previousUnits: number; newUnits: number; updatedBy: string; createdAt: string }>>([]);

  useEffect(() => {
    void fetch(`/api/inventory/history${selectedBloodType ? `?bloodType=${encodeURIComponent(selectedBloodType)}` : ""}`).then(async (response) => {
      if (!response.ok) return;
      setHistory((await response.json()).history ?? []);
    });
  }, [selectedBloodType, refreshKey]);

  async function requestRestock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setRestockSubmitting(true);
    setRestockMessage(null);
    setRestockError(null);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/inventory/restock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data.entries())) }).catch(() => null);
    if (!response) setRestockError("Could not reach the server. Please try again.");
    else {
      const result: { error?: string } = await response.json();
      if (!response.ok) setRestockError(result.error ?? "Could not submit the restock request.");
      else { setRestockMessage("Restock request submitted."); form.reset(); }
    }
    setRestockSubmitting(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const loadInventory = async () => {
      setLoading(true);
      setError(null);
      setInventory([]);
      try {
        const params = new URLSearchParams();
        if (city) params.set("city", city);
        const query = params.toString();
        const response = await fetch(
          `/api/inventory${query ? `?${query}` : ""}`,
          { signal: controller.signal },
        );
        const result: {
          inventory?: InventoryEntry[];
          cities?: string[];
          locationCount?: number;
          error?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Could not load blood inventory.");
        }

        setInventory(result.inventory ?? []);
        setCities(result.cities ?? []);
        setReportingLocations(result.locationCount ?? 0);
      } catch (loadError) {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        )
          return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load blood inventory.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadInventory();
    return () => controller.abort();
  }, [city, refreshKey]);

  const latestUpdate = useMemo(() => {
    const timestamps = inventory
      .map((entry) => entry.lastUpdated)
      .filter((value): value is string => value !== null)
      .map((value) => new Date(value).getTime());
    const latest = Math.max(...timestamps);
    return Number.isFinite(latest) ? new Date(latest) : null;
  }, [inventory]);

  const entriesByType = new Map(
    inventory.map((entry) => [entry.bloodType, entry]),
  );
  return (
    <main className="min-h-screen">
      <section className="max-w-7xl px-4 pt-20 sm:px-10 lg:pt-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
          Know what&apos;s available.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
          Browse reported blood stock by group and location. Stock counts
          reflect the latest updates recorded by camps.
        </p>
      </section>

      <div className="mx-auto px-4 pt-8 pb-20 sm:px-10 lg:pt-12">
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-foreground/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <label className="flex min-w-0 items-center gap-4">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-foreground/5 text-foreground/60"
              aria-hidden="true"
            >
              <LuMapPin size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Filter by city</span>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={loading && cities.length === 0}
                className="mt-1 w-full max-w-sm bg-transparent text-sm text-foreground/60 outline-none disabled:opacity-60"
              >
                <option value="">All locations</option>
                {cities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <div
            aria-live="polite"
            className="flex flex-col gap-1 text-sm text-foreground/55 sm:items-end"
          >
            <span>
              {loading
                ? "Refreshing inventory…"
                : `${reportingLocations} reporting ${reportingLocations === 1 ? "location" : "locations"}`}
            </span>
            {latestUpdate && !loading && (
              <span className="inline-flex items-center gap-1.5 text-xs">
                <LuClock3 size={13} /> Updated {latestUpdate.toLocaleString()}
              </span>
            )}
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="secondary"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              <LuRefreshCw size={16} /> Try again
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {BLOOD_TYPES.map((type) => {
            const entry = entriesByType.get(type);
            const hasReport = (entry?.locationCount ?? 0) > 0;
            const critical = hasReport && (entry?.units ?? 0) < 5;

            return (
              <button
                key={type}
                type="button"
                aria-pressed={selectedBloodType === type}
                onClick={() =>
                  setSelectedBloodType((selected) =>
                    selected === type ? null : type,
                  )
                }
                className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme sm:p-6 ${selectedBloodType === type ? "border-theme bg-theme/5" : "border-foreground/10 hover:border-theme/40"}`}
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-lg font-semibold">
                    <LuDroplet className="text-theme" size={18} /> {type}
                  </span>
                  {loading ? (
                    <span
                      className="h-5 w-16 animate-pulse rounded-full bg-foreground/10"
                      aria-label="Loading stock status"
                    />
                  ) : hasReport ? (
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${critical ? "bg-destructive/10 text-destructive" : "bg-foreground/5 text-foreground/55"}`}
                    >
                      {critical ? "Critical" : "Reported"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-foreground/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/45 sm:text-xs">
                      No report
                    </span>
                  )}
                </span>
                <span
                  className={`mt-5 block text-2xl font-bold tabular-nums sm:text-3xl ${hasReport ? "text-foreground" : "text-foreground/35"}`}
                >
                  {loading ? "—" : hasReport ? (entry?.units ?? 0) : "—"}
                </span>
                <span className="mt-1 block text-xs text-foreground/50">
                  {hasReport
                    ? `${entry?.units === 1 ? "unit" : "units"} across ${entry?.locationCount} ${entry?.locationCount === 1 ? "location" : "locations"}`
                    : "Units not reported"}
                </span>
              </button>
            );
          })}
        </div>

        {selectedBloodType && (
          <section
            aria-live="polite"
            className="mt-5 flex flex-col gap-4 rounded-xl border border-theme/25 bg-theme/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div>
              <h2 className="font-semibold">
                What would you like to do for {selectedBloodType}?
              </h2>
              <p className="mt-1 text-sm text-foreground/55">
                Request this blood type or find camps that need it.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href={`/request?bloodType=${encodeURIComponent(selectedBloodType)}`}
                className="inline-flex w-full items-center justify-center rounded-md bg-theme px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-theme/90 sm:w-auto"
              >
                Request {selectedBloodType}
              </Link>
              <Link
                href={`/camps?bloodType=${encodeURIComponent(selectedBloodType)}`}
                className="inline-flex w-full items-center justify-center rounded-md border border-theme/30 px-5 py-2.5 text-base font-medium text-theme transition-colors hover:bg-theme/5 sm:w-auto"
              >
                Donate {selectedBloodType}
              </Link>
            </div>
          </section>
        )}

        {!loading && !error && reportingLocations === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-foreground/15 px-5 py-8 text-center">
            <p className="font-medium">
              No inventory has been reported for this location.
            </p>
            <p className="mt-2 text-sm text-foreground/55">
              Try another city or check back after a camp updates its stock.
            </p>
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-foreground/15 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <LuPackageSearch className="text-foreground/45" size={22} />
              <h2 className="text-lg font-semibold">Stock update history</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-foreground/55">
              {history.length === 0 ? "No stock updates have been recorded yet." : `${history.length} recent stock updates.`}
            </p>
            {history.length > 0 && <div className="mt-4 grid gap-2 text-sm">{history.slice(0, 5).map((entry) => <p key={entry.id} className="text-foreground/60">{entry.bloodType}: {entry.previousUnits} → {entry.newUnits} units · {new Date(entry.createdAt).toLocaleString()}</p>)}</div>}
          </div>
          <form onSubmit={requestRestock} className="rounded-2xl bg-foreground/[0.03] p-6 sm:p-8">
            <div>
              <h2 className="text-lg font-semibold">Request a restock</h2>
              <p className="mt-2 text-sm leading-6 text-foreground/55">Tell a blood bank which stock is needed.</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3"><select name="bloodType" required defaultValue={selectedBloodType ?? ""} className="rounded-lg border border-foreground/15 bg-background px-3 py-3 text-sm"><option value="" disabled>Blood type</option>{BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select><input name="unitsNeeded" type="number" min="1" max="1000" required placeholder="Units" className="rounded-lg border border-foreground/15 bg-transparent px-3 py-3 text-sm" /></div>
            <input name="city" required placeholder="City" className="mt-3 w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-3 text-sm" />
            <textarea name="notes" rows={2} placeholder="Notes (optional)" className="mt-3 w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-3 text-sm" />
            {restockError && <p role="alert" className="mt-3 text-sm text-destructive">{restockError}</p>}{restockMessage && <p role="status" className="mt-3 text-sm text-theme">{restockMessage}</p>}
            <Button type="submit" disabled={restockSubmitting} className="mt-4">{restockSubmitting ? "Submitting…" : "Request restock"}</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
