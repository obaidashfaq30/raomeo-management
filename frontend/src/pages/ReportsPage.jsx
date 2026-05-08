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
        <h1 className="text-2xl font-semibold text-ink">Reports & Revenue Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Occupancy, revenue, booking trends, and exports</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Subtotal", revenue.subtotal_cents],
          ["Tax", revenue.tax_cents],
          ["Discounts", revenue.discount_cents],
          ["Paid", revenue.paid_cents]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">${((value || 0) / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="mb-5 text-base font-semibold text-ink">Bookings</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#e76f51" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
