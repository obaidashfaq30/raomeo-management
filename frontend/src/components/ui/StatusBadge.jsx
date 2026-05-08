import clsx from "clsx";

const variants = {
  available: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 before:bg-emerald-500",
  confirmed: "bg-sky-500/10 text-sky-700 ring-sky-500/20 before:bg-sky-500",
  checked_in: "bg-harbor/10 text-harbor ring-harbor/20 before:bg-harbor",
  checked_out: "bg-slate-500/10 text-slate-700 ring-slate-500/20 before:bg-slate-500",
  occupied: "bg-coral/10 text-coral ring-coral/20 before:bg-coral",
  cleaning: "bg-saffron/25 text-amber-800 ring-saffron/35 before:bg-saffron",
  pending: "bg-saffron/25 text-amber-800 ring-saffron/35 before:bg-saffron",
  paid: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 before:bg-emerald-500",
  open: "bg-coral/10 text-coral ring-coral/20 before:bg-coral",
  default: "bg-slate-500/10 text-slate-700 ring-slate-500/20 before:bg-slate-500"
};

export default function StatusBadge({ value }) {
  const label = String(value || "unknown").replace(/_/g, " ");
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 before:h-1.5 before:w-1.5 before:rounded-full", variants[value] || variants.default)}>
      {label}
    </span>
  );
}
