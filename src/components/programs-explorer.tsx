"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import type { TrackerRow } from "@/lib/dossier";

type ProgramsExplorerProps = {
  programs: TrackerRow[];
};

const fitOrder = {
  High: 0,
  Medium: 1,
  Stretch: 2,
  Borderline: 3,
  Unknown: 4,
};

const fundingOrder = {
  Strong: 0,
  Medium: 1,
  Weak: 2,
};

export function ProgramsExplorer({ programs }: ProgramsExplorerProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [degreeType, setDegreeType] = useState("all");
  const [fitLabel, setFitLabel] = useState("all");
  const [fundingFit, setFundingFit] = useState("all");

  const deferredQuery = useDeferredValue(query);

  const countries = Array.from(new Set(programs.map((program) => program.country))).sort();
  const degrees = Array.from(new Set(programs.map((program) => program.degreeType))).sort();
  const fits = Array.from(new Set(programs.map((program) => program.fitLabel))).sort(
    (left, right) =>
      (fitOrder[left as keyof typeof fitOrder] ?? 99) -
      (fitOrder[right as keyof typeof fitOrder] ?? 99),
  );
  const fundingFits = Array.from(
    new Set(programs.map((program) => program.fundingFit)),
  ).sort((left, right) => {
    const leftKey = left.split(" ")[0] as keyof typeof fundingOrder;
    const rightKey = right.split(" ")[0] as keyof typeof fundingOrder;
    return (fundingOrder[leftKey] ?? 99) - (fundingOrder[rightKey] ?? 99);
  });

  const loweredQuery = deferredQuery.trim().toLowerCase();
  const filteredPrograms = programs
    .filter((program) => {
      const queryMatch =
        loweredQuery.length === 0 ||
        [program.country, program.university, program.program, program.degreeType]
          .join(" ")
          .toLowerCase()
          .includes(loweredQuery);
      const countryMatch = country === "all" || program.country === country;
      const degreeMatch = degreeType === "all" || program.degreeType === degreeType;
      const fitMatch = fitLabel === "all" || program.fitLabel === fitLabel;
      const fundingMatch =
        fundingFit === "all" || program.fundingFit === fundingFit;

      return queryMatch && countryMatch && degreeMatch && fitMatch && fundingMatch;
    })
    .sort((left, right) => {
      const fitScore =
        (fitOrder[left.fitLabel as keyof typeof fitOrder] ?? 99) -
        (fitOrder[right.fitLabel as keyof typeof fitOrder] ?? 99);
      if (fitScore !== 0) return fitScore;

      const fundingScore =
        (fundingOrder[left.fundingFit.split(" ")[0] as keyof typeof fundingOrder] ??
          99) -
        (fundingOrder[right.fundingFit.split(" ")[0] as keyof typeof fundingOrder] ??
          99);
      if (fundingScore !== 0) return fundingScore;

      return left.country.localeCompare(right.country);
    });

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.35)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Search
            <input
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => {
                  setQuery(nextValue);
                });
              }}
              placeholder="Search country, university, programme..."
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-teal-500 focus:bg-white"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Country
            <select
              value={country}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => setCountry(nextValue));
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
            >
              <option value="all">All countries</option>
              {countries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Degree type
            <select
              value={degreeType}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => setDegreeType(nextValue));
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
            >
              <option value="all">All degrees</option>
              {degrees.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Fit label
            <select
              value={fitLabel}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => setFitLabel(nextValue));
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
            >
              <option value="all">All fit labels</option>
              {fits.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Funding fit
            <select
              value={fundingFit}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => setFundingFit(nextValue));
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
            >
              <option value="all">All funding labels</option>
              {fundingFits.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredPrograms.map((program) => (
          <article
            key={`${program.countrySlug}-${program.universitySlug}-${program.program}`}
            className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.3)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                  {program.country}
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  {program.program}
                </h3>
                <p className="text-sm text-slate-500">{program.university}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  {program.fitLabel}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {program.degreeType}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  {program.fundingFit}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">{program.status}</p>
              <Link
                href={`/countries/${program.countrySlug}`}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Open country
              </Link>
            </div>
          </article>
        ))}
      </section>

      {filteredPrograms.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm text-slate-500">
          No programmes matched the current filters.
        </div>
      ) : null}
    </div>
  );
}
