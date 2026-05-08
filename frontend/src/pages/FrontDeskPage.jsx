import { useEffect, useState } from "react";
import { Bell, BedDouble, CalendarCheck } from "lucide-react";
import { endpoints } from "../api/client";
import StatCard from "../components/ui/StatCard.jsx";

export default function FrontDeskPage() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    endpoints.dashboard().then((response) => setStatus(response.data.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow-pill">Guest desk</span>
        <h1 className="mt-3 page-title">Front Desk</h1>
        <p className="page-copy">Room status, walk-ins, assistance, and notifications</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={BedDouble} label="Available" value={status.rooms_by_status?.available || 0} tone="harbor" />
        <StatCard icon={CalendarCheck} label="Departures" value={status.departing_today || 0} tone="saffron" />
        <StatCard icon={Bell} label="Open Issues" value={status.open_maintenance || 0} tone="coral" />
      </div>
      <section className="glass-panel rounded-2xl p-5">
        <h2 className="text-base font-bold text-ink">Assistance Queue</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Early check-in", "Extra towels", "Airport transfer"].map((item) => (
            <div key={item} className="rounded-xl border border-white/60 bg-white/50 p-4">
              <p className="font-bold text-ink">{item}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">Pending</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
