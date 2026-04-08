import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getCountryBySlug, getDossier } from "@/lib/dossier";

type CountryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDossier().countries.map((country) => ({
    slug: country.slug,
  }));
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
              country.tier === "A"
                ? "bg-emerald-50 text-emerald-700"
                : country.tier === "B"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            Tier {country.tier}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
            {country.budgetFit}
          </span>
        </div>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          {country.name}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
          {country.bestUseCase}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{country.programCount}</p>
            <p className="mt-1 text-sm text-slate-500">total programmes</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{country.highFitCount}</p>
            <p className="mt-1 text-sm text-slate-500">high-fit options</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{country.scholarshipCount}</p>
            <p className="mt-1 text-sm text-slate-500">scholarship links</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            Overview
          </h3>
          <div className="mt-5">
            <MarkdownRenderer markdown={country.overviewMarkdown} />
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            Country documents
          </h3>
          <div className="mt-5">
            <MarkdownRenderer markdown={country.documentsMarkdown} />
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
          Scholarships and funding links
        </h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {country.scholarships.map((scholarship) => (
            <Link
              key={scholarship.url}
              href={scholarship.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 transition hover:bg-white hover:shadow-[0_18px_42px_-34px_rgba(15,23,42,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {scholarship.label}
                  </h4>
                  <p className="mt-2 break-all text-sm leading-6 text-slate-500">
                    {scholarship.url}
                  </p>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        {country.universities.map((university) => (
          <article
            key={university.slug}
            className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {university.name}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                  {university.whyShortlisted}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  Academic fit: {university.academicFit}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  Funding fit: {university.fundingFit}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {university.programs.map((program) => (
                <details
                  key={program.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold tracking-tight text-slate-950">
                          {program.title}
                        </h4>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                          {program.why}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-medium">
                        <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                          {program.degreeType}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                          {program.fitLabel}
                        </span>
                      </div>
                    </div>
                  </summary>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">
                    <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Requirements
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {program.requirements.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Documents
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {program.documents.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Timing note
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {program.timingNote}
                      </p>
                      <div className="mt-4 space-y-2">
                        {program.sources.map((source) => (
                          <Link
                            key={source.url}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <span>{source.label}</span>
                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
              {university.finalNote}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
