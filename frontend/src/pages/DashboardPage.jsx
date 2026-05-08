import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BedDouble, CalendarCheck, ClipboardList, Sparkles, Wrench } from "lucide-react";
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
  const totalTrackedRooms = Object.values(roomsByStatus).reduce((sum, count) => sum + Number(count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="glass-panel-strong rounded-2xl p-5 md:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="eyebrow-pill">Live operations</span>
            <h1 className="mt-3 text-3xl font-bold text-ink md:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A clear view of occupancy, arrivals, housekeeping, and maintenance activity across the hotel.</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/55 p-4 text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-harbor">Tracked rooms</p>
            <p className="mt-2 text-4xl font-bold text-ink">{totalTrackedRooms}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BedDouble} label="Occupied Rooms" value={roomsByStatus.occupied || 0} tone="harbor" />
        <StatCard icon={CalendarCheck} label="Arrivals Today" value={status.arriving_today || 0} tone="saffron" />
        <StatCard icon={ClipboardList} label="Housekeeping" value={status.pending_housekeeping || 0} tone="ink" />
        <StatCard icon={Wrench} label="Maintenance" value={status.open_maintenance || 0} tone="coral" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="glass-panel rounded-2xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="icon-tile text-harbor">
                <Sparkles size={18} />
              </span>
              <h2 className="text-base font-bold text-ink">Booking Trends</h2>
            </div>
            <span className="eyebrow-pill">30 days</span>
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
                <CartesianGrid stroke="#cbd5e1" strokeDasharray="4 4" opacity={0.65} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#0f766e" fill="url(#bookingTrend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-base font-bold text-ink">Room Status</h2>
          <DataTable columns={[{ key: "name", label: "Status", badge: true }, { key: "count", label: "Rooms" }]} rows={rows} />
        </section>
      </div>
    </div>
  );
}
