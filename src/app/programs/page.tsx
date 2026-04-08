import { ProgramsExplorer } from "@/components/programs-explorer";
import { getDossier } from "@/lib/dossier";

export default function ProgramsPage() {
  const dossier = getDossier();

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Programme explorer
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Filter the full shortlist
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
          Search across the mapped options and narrow the shortlist by country,
          degree type, and fit label. This view is designed to cut through the
          raw markdown folder structure, while also letting you mark shortlist,
          stage, and priority inline.
        </p>
      </section>

      <ProgramsExplorer programs={dossier.tracker} />
    </main>
  );
}
