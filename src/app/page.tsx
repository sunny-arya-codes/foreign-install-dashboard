import Link from "next/link";
import { ArrowRight, ExternalLink, Globe2, GraduationCap, Wallet } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PlannerHighlights } from "@/components/planner-highlights";
import { StatCard } from "@/components/stat-card";
import { getDossier } from "@/lib/dossier";

export default function HomePage() {
  const dossier = getDossier();
  const tierACountries = dossier.countries.filter((country) => country.tier === "A");
  const topCountries = [...dossier.countries].sort(
    (left, right) => right.programCount - left.programCount,
  );
  const immediatePlan = dossier.rootDocs.find(
    (doc) => doc.slug === "immediate-action-plan",
  );
  const shortlist = dossier.rootDocs.find(
    (doc) => doc.slug === "final-shortlist-recommendation",
  );

  return (
    <main className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[34px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_80px_-35px_rgba(2,6,23,0.7)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-teal-200">
              Spring / Fall 2027
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              scholarship aware
            </span>
          </div>

          <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Structured graduate-school dashboard for a budget-sensitive,
            high-upside abroad plan.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Built from the original dossier and mapped into a faster decision
            surface: country priority, programme fit, scholarships, common
            documents, and action sequencing in one place.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Profile anchor
              </p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-200">
                <p>{dossier.profile.degree}</p>
                <p>{dossier.profile.completion}</p>
                <p>{dossier.profile.cgpa}</p>
                <p>{dossier.profile.experience}</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Strongest route
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <p>Germany + Taiwan + South Korea as primary value routes.</p>
                <p>Finland only if tuition waiver lands.</p>
                <p>US only with funded PhD or thesis-MS funding.</p>
              </div>
              <Link
                href="/programs"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-200 transition hover:text-white"
              >
                Open programme explorer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <StatCard
            label="Countries"
            value={String(dossier.stats.totalCountries)}
            note="Tiered across A, B, and C priority based on cost, scholarships, and fit."
          />
          <StatCard
            label="Programmes"
            value={String(dossier.stats.totalPrograms)}
            note="Mapped across master's, research master's, PhD, and mixed MS/PhD routes."
          />
          <StatCard
            label="Scholarship Links"
            value={String(dossier.stats.totalScholarshipLinks)}
            note="Country-level funding links and official scholarship entry points."
          />
          <StatCard
            label="High-Fit Options"
            value={String(dossier.stats.totalHighFitPrograms)}
            note="Programmes labeled high-fit against the current profile assumptions."
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
                Tier A focus
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Countries worth the most attention
              </h3>
            </div>
            <Link
              href="/countries"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Explore countries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tierACountries.map((country) => (
              <Link
                key={country.slug}
                href={`/countries/${country.slug}`}
                className="group rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_-35px_rgba(13,148,136,0.42)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
                    Tier {country.tier}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
                </div>
                <h4 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                  {country.name}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {country.bestUseCase}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                    {country.programCount} programmes
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-slate-600">
                    {country.scholarshipCount} funding links
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Top density
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Where the shortlist is deepest
          </h3>

          <div className="mt-6 space-y-4">
            {topCountries.slice(0, 6).map((country) => (
              <div key={country.slug}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700">{country.name}</span>
                  <span className="text-slate-400">{country.programCount}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-amber-400"
                    style={{
                      width: `${(country.programCount / topCountries[0].programCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Highest concentration sits in Germany, Singapore, South Korea, and
            New Zealand, but budget-wise the strongest prioritization still
            starts with Germany, Taiwan, South Korea, Finland, and New Zealand.
          </div>
        </div>
      </section>

      <PlannerHighlights countries={dossier.countries} programs={dossier.tracker} />

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-teal-700" />
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              Immediate execution plan
            </h3>
          </div>
          <div className="mt-5">
            {immediatePlan ? <MarkdownRenderer markdown={immediatePlan.markdown} /> : null}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-amber-600" />
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              Final shortlist direction
            </h3>
          </div>
          <div className="mt-5">
            {shortlist ? <MarkdownRenderer markdown={shortlist.markdown} /> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-slate-700" />
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              Explore by route
            </h3>
          </div>
          <div className="mt-6 space-y-3">
            {[
              {
                title: "Control center",
                note: "Edit degree target, document readiness, country focus, and planner backups.",
                href: "/control",
              },
              {
                title: "Application tracker",
                note: "Run the shortlist through board and table views with saved local notes.",
                href: "/tracker",
              },
              {
                title: "Programme explorer",
                note: "Search and filter all mapped options by country, degree type, and fit.",
                href: "/programs",
              },
              {
                title: "Scholarships board",
                note: "Country-level funding links grouped for quick review.",
                href: "/scholarships",
              },
              {
                title: "Documents hub",
                note: "Common document prep and dossier planning notes in one place.",
                href: "/documents",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition hover:bg-white hover:shadow-[0_18px_42px_-34px_rgba(15,23,42,0.28)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.note}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Build note
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Latest Next.js baseline
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            This dashboard is scaffolded on <strong>Next.js 16.2.2</strong> and
            React 19, using the App Router and a static dossier snapshot stored
            inside this app repo.
          </p>
          <Link
            href="https://nextjs.org/blog"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100 hover:text-teal-900"
          >
            Open official Next.js references
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-6 shadow-[0_24px_55px_-35px_rgba(15,23,42,0.28)]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Decision lens
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            What not to do
          </h3>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <li>Do not spray applications across expensive self-funded routes.</li>
            <li>Do not treat all countries as equal effort buckets.</li>
            <li>Do not rely on one scholarship as the whole plan.</li>
            <li>Do not apply to US master&apos;s programmes without funding logic.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
