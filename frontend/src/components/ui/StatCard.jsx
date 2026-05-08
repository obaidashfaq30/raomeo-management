import clsx from "clsx";

export default function StatCard({ icon: Icon, label, value, tone = "harbor" }) {
  const tones = {
    harbor: "bg-harbor/10 text-harbor ring-harbor/15",
    coral: "bg-coral/10 text-coral ring-coral/15",
    saffron: "bg-saffron/25 text-amber-800 ring-saffron/25",
    ink: "bg-ink/10 text-ink ring-ink/10"
  };

  return (
    <div className="glass-panel rounded-xl p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-glass">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className={clsx("flex h-12 w-12 items-center justify-center rounded-xl ring-1", tones[tone])}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
