"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import type { TrackerRow } from "@/lib/dossier";
import { usePlanner } from "@/components/planner-provider";
import {
  PRIORITY_LEVELS,
  TRACKER_STAGES,
  type PriorityLevel,
  type TrackerStage,
  getProgramFallbackPlan,
} from "@/lib/planner-state";

type TrackerWorkspaceProps = {
  programs: TrackerRow[];
};

type EnrichedProgram = TrackerRow & {
  stage: TrackerStage;
  priority: PriorityLevel;
  shortlist: boolean;
  deadline: string;
  note: string;
};

const stageAccent: Record<TrackerStage, string> = {
  research: "bg-slate-100 text-slate-700",
  priority: "bg-teal-50 text-teal-700",
  applying: "bg-amber-50 text-amber-700",
  submitted: "bg-sky-50 text-sky-700",
  decision: "bg-emerald-50 text-emerald-700",
};

const priorityAccent: Record<PriorityLevel, string> = {
  P1: "bg-rose-50 text-rose-700",
  P2: "bg-amber-50 text-amber-700",
  P3: "bg-slate-100 text-slate-600",
};

export function TrackerWorkspace({ programs }: TrackerWorkspaceProps) {
  const { planner, updateProgramPlan } = usePlanner();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [view, setView] = useState<"board" | "table">("board");
  const [shortlistOnly, setShortlistOnly] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const countries = Array.from(new Set(programs.map((program) => program.country))).sort();

  const enrichedPrograms: EnrichedProgram[] = programs
    .map((program) => {
      const plan = planner.programs[program.programKey] ?? getProgramFallbackPlan(program);
      return {
        ...program,
        ...plan,
      };
    })
    .filter((program) => {
      const queryMatch =
        deferredQuery.trim().length === 0 ||
        [program.country, program.university, program.program, program.degreeType]
          .join(" ")
          .toLowerCase()
          .includes(deferredQuery.trim().toLowerCase());
      const countryMatch = country === "all" || program.country === country;
      const shortlistMatch = !shortlistOnly || program.shortlist;

      return queryMatch && countryMatch && shortlistMatch;
    });

  const stageCounts = TRACKER_STAGES.map((stage) => ({
    ...stage,
    count: enrichedPrograms.filter((program) => program.stage === stage.id).length,
  }));

  const shortlistedCount = enrichedPrograms.filter((program) => program.shortlist).length;
  const p1Count = enrichedPrograms.filter((program) => program.priority === "P1").length;

  const programsByStage = TRACKER_STAGES.reduce<Record<TrackerStage, EnrichedProgram[]>>(
    (accumulator, stage) => {
      accumulator[stage.id] = enrichedPrograms.filter((program) => program.stage === stage.id);
      return accumulator;
    },
    {
      research: [],
      priority: [],
      applying: [],
      submitted: [],
      decision: [],
    },
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.35)]">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-slate-600 xl:col-span-2">
              Search programme
              <input
                value={query}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  startTransition(() => setQuery(nextValue));
                }}
                placeholder="Search by country, university, or programme..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              Country
              <select
                value={country}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  startTransition(() => setCountry(nextValue));
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              >
                <option value="all">All countries</option>
                {countries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <button
              type="button"
              onClick={() => setView("board")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                view === "board"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Board
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                view === "table"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setShortlistOnly((current) => !current)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                shortlistOnly
                  ? "bg-teal-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {shortlistOnly ? "Showing shortlisted" : "Shortlist only"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-7">
          <div className="rounded-[24px] bg-slate-950 p-4 text-white xl:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Active view
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {enrichedPrograms.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {shortlistedCount} shortlisted and {p1Count} marked as P1 priority
              in the current filtered view.
            </p>
          </div>
          {stageCounts.map((stage) => (
            <div key={stage.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {stage.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {stage.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {view === "board" ? (
        <section className="grid gap-4 xl:grid-cols-5">
          {TRACKER_STAGES.map((stage) => (
            <div
              key={stage.id}
              className="rounded-[30px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.24)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {stage.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                    {programsByStage[stage.id].length}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${stageAccent[stage.id]}`}>
                  {stage.label}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {programsByStage[stage.id].map((program) => (
                  <article
                    key={program.programKey}
                    className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                          {program.country}
                        </p>
                        <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950">
                          {program.program}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {program.university}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateProgramPlan(program.programKey, {
                            shortlist: !program.shortlist,
                          })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          program.shortlist
                            ? "bg-teal-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {program.shortlist ? "Shortlisted" : "Add shortlist"}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                      <span className={`rounded-full px-3 py-1 ${priorityAccent[program.priority]}`}>
                        {program.priority}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                        {program.degreeType}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        {program.fitLabel}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <label className="space-y-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Move stage
                        <select
                          value={program.stage}
                          onChange={(event) =>
                            updateProgramPlan(program.programKey, {
                              stage: event.target.value as TrackerStage,
                            })
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none transition focus:border-teal-500"
                        >
                          {TRACKER_STAGES.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                          Priority
                          <select
                            value={program.priority}
                            onChange={(event) =>
                              updateProgramPlan(program.programKey, {
                                priority: event.target.value as PriorityLevel,
                              })
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none transition focus:border-teal-500"
                          >
                            {PRIORITY_LEVELS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="space-y-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                          Deadline
                          <input
                            type="date"
                            value={program.deadline}
                            onChange={(event) =>
                              updateProgramPlan(program.programKey, {
                                deadline: event.target.value,
                              })
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none transition focus:border-teal-500"
                          />
                        </label>
                      </div>

                      <label className="space-y-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Note
                        <textarea
                          rows={3}
                          value={program.note}
                          onChange={(event) =>
                            updateProgramPlan(program.programKey, {
                              note: event.target.value,
                            })
                          }
                          placeholder="Professor outreach, SOP angle, scholarship cue..."
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-900 outline-none transition focus:border-teal-500"
                        />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                      <p className="text-xs leading-5 text-slate-500">{program.status}</p>
                      <Link
                        href={`/countries/${program.countrySlug}`}
                        className="text-sm font-medium text-teal-700 transition hover:text-teal-900"
                      >
                        Open country
                      </Link>
                    </div>
                  </article>
                ))}

                {programsByStage[stage.id].length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                    No programmes in this stage.
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.24)]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  {["Programme", "Country", "Stage", "Priority", "Shortlist", "Deadline", "Note", "Open"].map((heading) => (
                    <th key={heading} className="px-4 py-4 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrichedPrograms.map((program) => (
                  <tr key={program.programKey} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{program.program}</p>
                      <p className="mt-1 text-sm text-slate-500">{program.university}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{program.country}</td>
                    <td className="px-4 py-4">
                      <select
                        value={program.stage}
                        onChange={(event) =>
                          updateProgramPlan(program.programKey, {
                            stage: event.target.value as TrackerStage,
                          })
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                      >
                        {TRACKER_STAGES.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={program.priority}
                        onChange={(event) =>
                          updateProgramPlan(program.programKey, {
                            priority: event.target.value as PriorityLevel,
                          })
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                      >
                        {PRIORITY_LEVELS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateProgramPlan(program.programKey, {
                            shortlist: !program.shortlist,
                          })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          program.shortlist
                            ? "bg-teal-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {program.shortlist ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="date"
                        value={program.deadline}
                        onChange={(event) =>
                          updateProgramPlan(program.programKey, {
                            deadline: event.target.value,
                          })
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <textarea
                        rows={2}
                        value={program.note}
                        onChange={(event) =>
                          updateProgramPlan(program.programKey, {
                            note: event.target.value,
                          })
                        }
                        placeholder="Personal note..."
                        className="min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/countries/${program.countrySlug}`}
                        className="text-sm font-medium text-teal-700 transition hover:text-teal-900"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {enrichedPrograms.length === 0 ? (
            <div className="border-t border-slate-200 px-6 py-10 text-center text-sm text-slate-500">
              No programmes matched the current tracker filters.
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
