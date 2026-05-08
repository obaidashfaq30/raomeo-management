import clsx from "clsx";

const variants = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  checked_in: "bg-harbor/10 text-harbor ring-harbor/20",
  checked_out: "bg-slate-100 text-slate-700 ring-slate-200",
  occupied: "bg-coral/10 text-coral ring-coral/20",
  cleaning: "bg-saffron/20 text-amber-800 ring-saffron/30",
  pending: "bg-saffron/20 text-amber-800 ring-saffron/30",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  open: "bg-coral/10 text-coral ring-coral/20",
  default: "bg-slate-100 text-slate-700 ring-slate-200"
};

export default function StatusBadge({ value }) {
  const label = String(value || "unknown").replaceAll("_", " ");
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1", variants[value] || variants.default)}>
      {label}
    </span>
  );
}
