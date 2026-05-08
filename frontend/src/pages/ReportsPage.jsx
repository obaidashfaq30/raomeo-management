import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { endpoints } from "../api/client";

export default function ReportsPage() {
  const [revenue, setRevenue] = useState({});
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    endpoints.reports.revenue().then((response) => setRevenue(response.data.data)).catch(() => {});
    endpoints.reports.bookingTrends().then((response) => setTrends(response.data.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow-pill">Analytics</span>
        <h1 className="mt-3 page-title">Reports & Revenue Analytics</h1>
        <p className="page-copy">Occupancy, revenue, booking trends, and exports</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Subtotal", revenue.subtotal_cents],
          ["Tax", revenue.tax_cents],
          ["Discounts", revenue.discount_cents],
          ["Paid", revenue.paid_cents]
        ].map(([label, value]) => (
          <div key={label} className="glass-panel rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-ink">${((value || 0) / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <section className="glass-panel rounded-2xl p-5">
        <h2 className="mb-5 text-base font-bold text-ink">Bookings</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid stroke="#cbd5e1" strokeDasharray="4 4" opacity={0.65} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#e76f51" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
