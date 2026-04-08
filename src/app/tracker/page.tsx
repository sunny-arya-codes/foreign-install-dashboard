import { TrackerWorkspace } from "@/components/tracker-workspace";
import { getDossier } from "@/lib/dossier";

export default function TrackerPage() {
  const dossier = getDossier();

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.3)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Application tracker
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Kanban board and table for the real shortlist
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
          The original CSV is still the backbone, but this workspace adds local
          control for stage movement, shortlist toggles, deadline notes, and
          personal decision-making.
        </p>
      </section>

      <TrackerWorkspace programs={dossier.tracker} />
    </main>
  );
}
