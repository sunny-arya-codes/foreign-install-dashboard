"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CountryDetail, TrackerRow } from "@/lib/dossier";
import { usePlanner } from "@/components/planner-provider";
import { getCountryFallbackMode, getProgramFallbackPlan } from "@/lib/planner-state";

type PlannerHighlightsProps = {
  countries: CountryDetail[];
  programs: TrackerRow[];
};

export function PlannerHighlights({
  countries,
  programs,
}: PlannerHighlightsProps) {
  const { hydrated, planner } = usePlanner();

  const focusCountries = countries.filter((country) => {
    const mode =
      planner.countries[country.slug]?.mode ?? getCountryFallbackMode(country.tier);
    return mode === "focus";
  });

  const shortlistCount = programs.filter((program) => {
    const plan = planner.programs[program.programKey] ?? getProgramFallbackPlan(program);
    return plan.shortlist;
  }).length;

  const p1Count = programs.filter((program) => {
    const plan = planner.programs[program.programKey] ?? getProgramFallbackPlan(program);
    return plan.priority === "P1";
  }).length;

  const readyCount = [
    planner.preferences.englishTest === "Completed",
    planner.preferences.sopStatus === "Ready",
    planner.preferences.lorStatus === "Ready",
    planner.preferences.cvStatus === "Ready",
  ].filter(Boolean).length;

  const readinessPercent = Math.round((readyCount / 4) * 100);

  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Control snapshot
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Personal planning overlay
          </h3>
        </div>
        <Link
          href="/control"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Open control center
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Focus countries
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {focusCountries.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {focusCountries.slice(0, 3).map((country) => country.name).join(", ") ||
              "Set your country priorities in the control center."}
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Shortlisted programmes
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {shortlistCount}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {p1Count} options are currently marked as P1 priority.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Readiness
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {hydrated ? `${readinessPercent}%` : "..." }
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-amber-400"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            IELTS/TOEFL, SOP, LORs, and CV progress tracked in-browser.
          </p>
        </div>
      </div>
    </section>
  );
}
