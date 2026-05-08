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
        <h1 className="text-2xl font-semibold text-ink">Front Desk</h1>
        <p className="mt-1 text-sm text-slate-500">Room status, walk-ins, assistance, and notifications</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={BedDouble} label="Available" value={status.rooms_by_status?.available || 0} tone="harbor" />
        <StatCard icon={CalendarCheck} label="Departures" value={status.departing_today || 0} tone="saffron" />
        <StatCard icon={Bell} label="Open Issues" value={status.open_maintenance || 0} tone="coral" />
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="text-base font-semibold text-ink">Assistance Queue</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Early check-in", "Extra towels", "Airport transfer"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 p-4">
              <p className="font-medium text-ink">{item}</p>
              <p className="mt-1 text-sm text-slate-500">Pending</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
