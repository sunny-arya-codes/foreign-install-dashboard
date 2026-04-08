import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getDossier } from "@/lib/dossier";

export default function DocumentsPage() {
  const dossier = getDossier();
  const rootDocs = dossier.rootDocs.filter(
    (doc) =>
      doc.slug !== "country-priority-matrix" &&
      doc.slug !== "final-shortlist-recommendation",
  );

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Documents
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Common prep and planning library
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
          This section converts the static document folders into a readable
          operations hub. Common documents sit alongside the planning notes that
          explain how to prepare and sequence applications.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          {dossier.commonDocs.map((doc) => (
            <details
              key={doc.slug}
              className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.24)]"
            >
              <summary className="cursor-pointer list-none">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  {doc.title}
                </h3>
              </summary>
              <div className="mt-5">
                <MarkdownRenderer markdown={doc.markdown} />
              </div>
            </details>
          ))}
        </div>

        <div className="space-y-5">
          {rootDocs.map((doc) => (
            <details
              key={doc.slug}
              className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.24)]"
            >
              <summary className="cursor-pointer list-none">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  {doc.title}
                </h3>
              </summary>
              <div className="mt-5">
                <MarkdownRenderer markdown={doc.markdown} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
