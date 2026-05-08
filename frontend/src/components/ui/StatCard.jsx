import clsx from "clsx";

export default function StatCard({ icon: Icon, label, value, tone = "harbor" }) {
  const tones = {
    harbor: "bg-harbor/10 text-harbor",
    coral: "bg-coral/10 text-coral",
    saffron: "bg-saffron/20 text-amber-800",
    ink: "bg-ink/10 text-ink"
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
        </div>
        <div className={clsx("flex h-11 w-11 items-center justify-center rounded-lg", tones[tone])}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
