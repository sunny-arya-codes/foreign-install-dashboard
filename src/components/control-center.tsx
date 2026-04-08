"use client";

import { ChangeEvent, useRef, useState } from "react";
import type { CountryDetail } from "@/lib/dossier";
import { usePlanner } from "@/components/planner-provider";
import {
  BUDGET_MODES,
  COUNTRY_MODES,
  DEGREE_TARGETS,
  DOC_PROGRESS,
  GRE_MODES,
  INTAKE_TARGETS,
  TEST_STATUSES,
  getCountryFallbackMode,
} from "@/lib/planner-state";

type ControlCenterProps = {
  countries: CountryDetail[];
};

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}

export function ControlCenter({ countries }: ControlCenterProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { hydrated, planner, updatePreferences, updateCountryPlan, exportPlannerState, importPlannerState, resetPlannerState } =
    usePlanner();
  const [importError, setImportError] = useState("");

  const readyCount = [
    planner.preferences.englishTest === "Completed",
    planner.preferences.sopStatus === "Ready",
    planner.preferences.lorStatus === "Ready",
    planner.preferences.cvStatus === "Ready",
  ].filter(Boolean).length;
  const readinessPercent = Math.round((readyCount / 4) * 100);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      importPlannerState(content);
      setImportError("");
    } catch {
      setImportError("Could not import the planner JSON. Use an exported file from this dashboard.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Personal strategy
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Form-based control center
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
            This layer sits on top of the original research snapshot. It lets
            you steer country priorities, document readiness, and personal
            application planning without editing the markdown source.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm font-medium text-slate-600">
              Target degree
              <select
                value={planner.preferences.targetDegree}
                onChange={(event) =>
                  updatePreferences({ targetDegree: event.target.value as (typeof DEGREE_TARGETS)[number] })
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              >
                {DEGREE_TARGETS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              Target intake
              <select
                value={planner.preferences.targetIntake}
                onChange={(event) =>
                  updatePreferences({ targetIntake: event.target.value as (typeof INTAKE_TARGETS)[number] })
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              >
                {INTAKE_TARGETS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              Budget mode
              <select
                value={planner.preferences.budgetMode}
                onChange={(event) =>
                  updatePreferences({ budgetMode: event.target.value as (typeof BUDGET_MODES)[number] })
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              >
                {BUDGET_MODES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              GRE plan
              <select
                value={planner.preferences.grePlan}
                onChange={(event) =>
                  updatePreferences({ grePlan: event.target.value as (typeof GRE_MODES)[number] })
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              >
                {GRE_MODES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Readiness meter
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">
            {hydrated ? `${readinessPercent}%` : "..."}
          </p>
          <div className="mt-4 h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-amber-400"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3">
            <label className="space-y-2 text-sm font-medium text-slate-600">
              English test
              <select
                value={planner.preferences.englishTest}
                onChange={(event) =>
                  updatePreferences({ englishTest: event.target.value as (typeof TEST_STATUSES)[number] })
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              >
                {TEST_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {[
              { key: "sopStatus", label: "SOP" },
              { key: "lorStatus", label: "LORs" },
              { key: "cvStatus", label: "CV" },
            ].map((item) => (
              <label key={item.key} className="space-y-2 text-sm font-medium text-slate-600">
                {item.label}
                <select
                  value={planner.preferences[item.key as keyof typeof planner.preferences] as string}
                  onChange={(event) =>
                    updatePreferences({
                      [item.key]: event.target.value,
                    } as {
                      sopStatus?: (typeof DOC_PROGRESS)[number];
                      lorStatus?: (typeof DOC_PROGRESS)[number];
                      cvStatus?: (typeof DOC_PROGRESS)[number];
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
                >
                  {DOC_PROGRESS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
              Country map
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Choose focus, active, or backup countries
            </h3>
          </div>
          <p className="text-sm text-slate-500">
            Tier defaults are preloaded; you can override them here.
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {countries.map((country) => {
            const entry = planner.countries[country.slug] ?? {
              mode: getCountryFallbackMode(country.tier),
              note: "",
            };

            return (
              <article
                key={country.slug}
                className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xl font-semibold tracking-tight text-slate-950">
                        {country.name}
                      </h4>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                        Tier {country.tier}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {country.bestUseCase}
                    </p>
                  </div>

                  <select
                    value={entry.mode}
                    onChange={(event) =>
                      updateCountryPlan(country.slug, {
                        mode: event.target.value as (typeof COUNTRY_MODES)[number]["id"],
                      })
                    }
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                  >
                    {COUNTRY_MODES.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-[20px] bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Budget fit
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {country.budgetFit}
                    </p>
                  </div>
                  <label className="space-y-2 text-sm font-medium text-slate-600">
                    Country note
                    <textarea
                      value={entry.note}
                      onChange={(event) =>
                        updateCountryPlan(country.slug, { note: event.target.value })
                      }
                      rows={3}
                      placeholder="Why this country stays in or moves out of focus..."
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Backup + restore
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Export your planner layer or load it back
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            The main dossier remains static. Your personal control state is kept
            locally and can be exported as JSON for backup or moving to another
            browser.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                downloadTextFile(
                  "foreign-install-planner.json",
                  exportPlannerState(),
                )
              }
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Export planner JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Import planner JSON
            </button>
            <button
              type="button"
              onClick={resetPlannerState}
              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Reset local planner
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleImport}
            />
          </div>

          {importError ? (
            <p className="mt-4 text-sm text-rose-600">{importError}</p>
          ) : null}
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_24px_55px_-35px_rgba(2,6,23,0.7)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Current state
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <p>Degree target: {planner.preferences.targetDegree}</p>
            <p>Intake: {planner.preferences.targetIntake}</p>
            <p>Budget mode: {planner.preferences.budgetMode}</p>
            <p>GRE strategy: {planner.preferences.grePlan}</p>
            <p>
              Last updated: {planner.updatedAt ? new Date(planner.updatedAt).toLocaleString() : "Not saved yet"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
