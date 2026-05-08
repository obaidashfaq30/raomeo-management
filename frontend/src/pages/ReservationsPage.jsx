import { useEffect, useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

const initialForm = {
  room_category_id: "",
  check_in_date: "",
  check_out_date: "",
  adults: 1,
  children: 0,
  source: "direct"
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const load = () => endpoints.reservations().then((response) => setReservations(response.data.data)).catch(() => setReservations([]));

  useEffect(() => {
    load();
    endpoints.roomCategories().then((response) => setCategories(response.data.data)).catch(() => setCategories([]));
  }, []);

  const valid = useMemo(() => {
    const next = {};
    if (!form.room_category_id) next.room_category_id = "Required";
    if (!form.check_in_date) next.check_in_date = "Required";
    if (!form.check_out_date) next.check_out_date = "Required";
    if (form.check_in_date && form.check_out_date && form.check_out_date <= form.check_in_date) next.check_out_date = "After check-in";
    return next;
  }, [form]);

  const submit = async (event) => {
    event.preventDefault();
    setErrors(valid);
    if (Object.keys(valid).length > 0) return;
    await endpoints.createReservation(form);
    setForm(initialForm);
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-5 flex items-center gap-2">
          <CalendarPlus className="text-harbor" size={20} />
          <h1 className="text-lg font-semibold text-ink">New Reservation</h1>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
            <select className="h-10 w-full rounded-lg border border-slate-200 px-3" value={form.room_category_id} onChange={(event) => setForm({ ...form, room_category_id: event.target.value })}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.room_category_id && <span className="text-xs text-coral">{errors.room_category_id}</span>}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Check-in</span>
              <input type="date" className="h-10 w-full rounded-lg border border-slate-200 px-3" value={form.check_in_date} onChange={(event) => setForm({ ...form, check_in_date: event.target.value })} />
              {errors.check_in_date && <span className="text-xs text-coral">{errors.check_in_date}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Check-out</span>
              <input type="date" className="h-10 w-full rounded-lg border border-slate-200 px-3" value={form.check_out_date} onChange={(event) => setForm({ ...form, check_out_date: event.target.value })} />
              {errors.check_out_date && <span className="text-xs text-coral">{errors.check_out_date}</span>}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Adults</span>
              <input type="number" min="1" className="h-10 w-full rounded-lg border border-slate-200 px-3" value={form.adults} onChange={(event) => setForm({ ...form, adults: event.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Children</span>
              <input type="number" min="0" className="h-10 w-full rounded-lg border border-slate-200 px-3" value={form.children} onChange={(event) => setForm({ ...form, children: event.target.value })} />
            </label>
          </div>
          <button className="h-10 w-full rounded-lg bg-harbor font-semibold text-white">Create</button>
        </div>
      </form>
      <section>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-ink">Reservations</h1>
          <p className="mt-1 text-sm text-slate-500">Bookings, allocation, and status tracking</p>
        </div>
        <DataTable
          columns={[
            { key: "code", label: "Code" },
            { key: "status", label: "Status", badge: true },
            { key: "room", label: "Room", render: (reservation) => reservation.room?.number || "Unassigned" },
            { key: "category", label: "Category", render: (reservation) => reservation.room_category?.name },
            { key: "dates", label: "Dates", render: (reservation) => `${reservation.check_in_date} to ${reservation.check_out_date}` }
          ]}
          rows={reservations}
        />
      </section>
    </div>
  );
}
