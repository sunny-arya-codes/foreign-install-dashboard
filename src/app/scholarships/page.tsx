import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getDossier } from "@/lib/dossier";

export default function ScholarshipsPage() {
  const dossier = getDossier();
  const scholarshipStrategy = dossier.rootDocs.find(
    (doc) => doc.slug === "scholarship-strategy",
  );

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Scholarships
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Funding map across the shortlist
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
          Country-level scholarship entry points grouped from the dossier, with
          the global scholarship strategy note attached for planning context.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
          {scholarshipStrategy ? (
            <MarkdownRenderer markdown={scholarshipStrategy.markdown} />
          ) : null}
        </div>

        <div className="grid gap-5">
          {dossier.countries.map((country) => (
            <article
              key={country.slug}
              className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.22)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                    Tier {country.tier}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {country.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {country.bestUseCase}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                  {country.scholarshipCount} links
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {country.scholarships.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 transition hover:bg-white hover:shadow-[0_18px_42px_-34px_rgba(15,23,42,0.28)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900">
                          {link.label}
                        </h4>
                        <p className="mt-2 break-all text-sm leading-6 text-slate-500">
                          {link.url}
                        </p>
                      </div>
                      <ExternalLink className="mt-1 h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
