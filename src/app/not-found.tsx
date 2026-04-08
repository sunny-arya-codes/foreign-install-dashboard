import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-xl rounded-[32px] border border-slate-200/80 bg-white/90 p-8 text-center shadow-[0_22px_52px_-34px_rgba(15,23,42,0.28)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          This route does not exist in the dashboard.
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-500">
          Go back to the overview or open the country index to continue
          browsing the dossier.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Overview
          </Link>
          <Link
            href="/countries"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Countries
          </Link>
        </div>
      </div>
    </main>
  );
}
