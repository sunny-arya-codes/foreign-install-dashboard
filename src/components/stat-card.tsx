type StatCardProps = {
  label: string;
  value: string;
  note: string;
};

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.28)]">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{note}</p>
    </div>
  );
}
