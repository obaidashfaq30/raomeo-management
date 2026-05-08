import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BedDouble, CalendarCheck, ClipboardList, Wrench } from "lucide-react";
import { endpoints } from "../api/client";
import StatCard from "../components/ui/StatCard.jsx";
import DataTable from "../components/ui/DataTable.jsx";

const fallbackTrend = [
  { date: "Mon", bookings: 18 },
  { date: "Tue", bookings: 24 },
  { date: "Wed", bookings: 21 },
  { date: "Thu", bookings: 32 },
  { date: "Fri", bookings: 38 },
  { date: "Sat", bookings: 44 },
  { date: "Sun", bookings: 29 }
];

export default function DashboardPage() {
  const [status, setStatus] = useState({});
  const [trends, setTrends] = useState(fallbackTrend);

  useEffect(() => {
    endpoints.dashboard().then((response) => setStatus(response.data.data)).catch(() => {});
    endpoints.reports.bookingTrends().then((response) => setTrends(response.data.data.length ? response.data.data : fallbackTrend)).catch(() => {});
  }, []);

  const roomsByStatus = status.rooms_by_status || {};
  const rows = Object.entries(roomsByStatus).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Live hotel operations</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BedDouble} label="Occupied Rooms" value={roomsByStatus.occupied || 0} tone="harbor" />
        <StatCard icon={CalendarCheck} label="Arrivals Today" value={status.arriving_today || 0} tone="saffron" />
        <StatCard icon={ClipboardList} label="Housekeeping" value={status.pending_housekeeping || 0} tone="ink" />
        <StatCard icon={Wrench} label="Maintenance" value={status.open_maintenance || 0} tone="coral" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Booking Trends</h2>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-harbor">30 days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="bookingTrend" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#0f766e" fill="url(#bookingTrend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-base font-semibold text-ink">Room Status</h2>
          <DataTable columns={[{ key: "name", label: "Status", badge: true }, { key: "count", label: "Rooms" }]} rows={rows} />
        </section>
      </div>
    </div>
  );
}
