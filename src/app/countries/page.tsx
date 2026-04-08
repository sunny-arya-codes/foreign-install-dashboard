import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDossier } from "@/lib/dossier";

export default function CountriesPage() {
  const dossier = getDossier();

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.3)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          Countries
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Country-level control surface
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">
          Every country card maps back to the original dossier and includes
          program count, funding links, budget fit, and the best use case for
          your profile.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {dossier.countries.map((country) => (
          <Link
            key={country.slug}
            href={`/countries/${country.slug}`}
            className="group rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_58px_-34px_rgba(13,148,136,0.28)]"
          >
            <div className="flex items-center justify-between gap-4">
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
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-900" />
            </div>

            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
              {country.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {country.bestUseCase}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-[20px] bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{country.programCount}</p>
                <p className="mt-1 text-slate-500">programmes</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{country.scholarshipCount}</p>
                <p className="mt-1 text-slate-500">funding links</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{country.highFitCount}</p>
                <p className="mt-1 text-slate-500">high-fit</p>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Budget fit
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{country.budgetFit}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
