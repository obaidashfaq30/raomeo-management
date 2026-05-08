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
        <h1 className="text-2xl font-semibold text-ink">Check-in / Check-out</h1>
        <p className="mt-1 text-sm text-slate-500">Arrival and departure workflow</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-harbor/10 text-harbor">
              {index === 2 ? <LogOut size={22} /> : <ClipboardCheck size={22} />}
            </div>
            <h2 className="text-base font-semibold text-ink">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{step.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
