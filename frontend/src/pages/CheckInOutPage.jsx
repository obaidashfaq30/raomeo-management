import { ClipboardCheck, LogOut } from "lucide-react";

const steps = [
  { title: "Identify Reservation", detail: "Reservation code, guest document, or walk-in allocation" },
  { title: "Assign Room", detail: "Available inventory with category and maintenance checks" },
  { title: "Check-out Summary", detail: "Late checkout, room status, invoice, and payment balance" }
];

export default function CheckInOutPage() {
  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow-pill">Stay flow</span>
        <h1 className="mt-3 page-title">Check-in / Check-out</h1>
        <p className="page-copy">Arrival and departure workflow</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="glass-panel rounded-xl p-5 transition hover:-translate-y-0.5">
            <div className="icon-tile mb-4 text-harbor">
              {index === 2 ? <LogOut size={22} /> : <ClipboardCheck size={22} />}
            </div>
            <h2 className="text-base font-bold text-ink">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{step.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
