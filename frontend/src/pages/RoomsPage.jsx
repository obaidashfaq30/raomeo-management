import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";
import GlassSelect from "../components/ui/GlassSelect.jsx";
import { useAuthStore } from "../store/authStore";

const initialForm = {
  room_category_id: "",
  number: "",
  floor: "",
  status: "available",
  rate_override: ""
};

const statusOptions = ["available", "reserved", "occupied", "cleaning", "maintenance", "out_of_service"];
const roomStatusOptions = statusOptions.map((option) => ({ value: option, label: option.replace(/_/g, " ") }));
const roomStatusFilterOptions = [{ value: "", label: "All statuses" }, ...roomStatusOptions];

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const user = useAuthStore((state) => state.user);
  const canManageRooms = ["admin", "manager"].includes(user?.role);

  const loadRooms = useCallback(() => {
    endpoints.rooms(status ? { status } : {}).then((response) => setRooms(response.data.data)).catch(() => setRooms([]));
  }, [status]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    endpoints.roomCategories().then((response) => setCategories(response.data.data)).catch(() => setCategories([]));
  }, []);

  const validationErrors = useMemo(() => {
    const next = {};
    if (!form.room_category_id) next.room_category_id = "Select a category";
    if (!form.number.trim()) next.number = "Enter a room number";
    if (form.floor === "") next.floor = "Enter a floor";
    if (form.floor !== "" && Number.isNaN(Number(form.floor))) next.floor = "Floor must be a number";
    if (Number(form.floor) < 0) next.floor = "Floor cannot be negative";
    if (form.rate_override && Number.isNaN(Number(form.rate_override))) next.rate_override = "Rate must be a number";
    if (form.rate_override && Number(form.rate_override) < 0) next.rate_override = "Rate cannot be negative";
    return next;
  }, [form]);
  const categoryOptions = useMemo(
    () => [
      { value: "", label: "Select category" },
      ...categories.map((category) => ({ value: String(category.id), label: category.name }))
    ],
    [categories]
  );

  const submit = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!canManageRooms) {
      setNotice("Only admin and manager accounts can create rooms.");
      return;
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      room_category_id: form.room_category_id,
      number: form.number.trim(),
      floor: Number(form.floor),
      status: form.status
    };

    if (form.rate_override) {
      payload.rate_override_cents = Math.round(Number(form.rate_override) * 100);
    }

    setSaving(true);
    try {
      await endpoints.createRoom(payload);
      setForm(initialForm);
      setErrors({});
      setNotice("Room created.");
      loadRooms();
    } catch (error) {
      const message = error.response?.data?.error;
      setNotice(Array.isArray(message) ? message.join(", ") : message || "Unable to create room.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <form onSubmit={submit} className="glass-panel-strong rounded-2xl p-5">
        <div className="mb-5 flex items-center gap-2">
          <span className="icon-tile text-harbor">
            <Plus size={20} />
          </span>
          <div>
            <h1 className="text-lg font-bold text-ink">New Room</h1>
            <p className="text-xs font-medium text-slate-500">Admin and manager access</p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
            <GlassSelect
              disabled={!canManageRooms}
              value={form.room_category_id}
              onChange={(value) => setForm({ ...form, room_category_id: value })}
              options={categoryOptions}
            />
            {errors.room_category_id && <span className="text-xs text-coral">{errors.room_category_id}</span>}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Room number</span>
              <input
                className="field-glass"
                disabled={!canManageRooms}
                value={form.number}
                onChange={(event) => setForm({ ...form, number: event.target.value })}
                placeholder="401"
              />
              {errors.number && <span className="text-xs text-coral">{errors.number}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Floor</span>
              <input
                type="number"
                min="0"
                className="field-glass"
                disabled={!canManageRooms}
                value={form.floor}
                onChange={(event) => setForm({ ...form, floor: event.target.value })}
              />
              {errors.floor && <span className="text-xs text-coral">{errors.floor}</span>}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
              <GlassSelect
                disabled={!canManageRooms}
                value={form.status}
                onChange={(value) => setForm({ ...form, status: value })}
                options={roomStatusOptions}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Override rate</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="field-glass"
                disabled={!canManageRooms}
                value={form.rate_override}
                onChange={(event) => setForm({ ...form, rate_override: event.target.value })}
                placeholder="Optional"
              />
              {errors.rate_override && <span className="text-xs text-coral">{errors.rate_override}</span>}
            </label>
          </div>
          {notice && (
            <p className="rounded-xl border border-white/60 bg-white/55 px-3 py-2 text-sm font-medium text-slate-700">{notice}</p>
          )}
          <button
            className="btn-primary h-10 w-full"
            disabled={saving || !canManageRooms}
          >
            {saving ? <RefreshCw className="animate-spin" size={17} /> : <Plus size={17} />}
            Create Room
          </button>
          {!canManageRooms && (
            <p className="text-xs text-slate-500">Sign in as an admin or manager to manage room inventory.</p>
          )}
        </div>
      </form>
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow-pill">Inventory</span>
            <h1 className="mt-3 page-title">Room Inventory</h1>
            <p className="page-copy">Categories, pricing, amenities, and live room state</p>
          </div>
          <GlassSelect className="w-full sm:w-52" value={status} onChange={setStatus} options={roomStatusFilterOptions} />
        </div>
        <DataTable
          columns={[
            { key: "number", label: "Room" },
            { key: "floor", label: "Floor" },
            { key: "status", label: "Status", badge: true },
            { key: "category", label: "Category", render: (room) => room.room_category?.name },
            { key: "rate", label: "Rate", render: (room) => `$${((room.rate_override_cents || room.room_category?.base_rate_cents || 0) / 100).toFixed(2)}` }
          ]}
          rows={rooms}
        />
      </section>
    </div>
  );
}
