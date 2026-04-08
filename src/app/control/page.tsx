import { ControlCenter } from "@/components/control-center";
import { getDossier } from "@/lib/dossier";

export default function ControlPage() {
  const dossier = getDossier();

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.3)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Control center
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Personal planning controls on top of the dossier
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
          Use this layer to manage your real application strategy: update your
          readiness, move countries between focus and backup, and keep a
          portable browser-based planning state.
        </p>
      </section>

      <ControlCenter countries={dossier.countries} />
    </main>
  );
}
