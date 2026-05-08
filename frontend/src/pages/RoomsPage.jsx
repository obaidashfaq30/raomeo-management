import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    endpoints.rooms(status ? { status } : {}).then((response) => setRooms(response.data.data)).catch(() => setRooms([]));
  }, [status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Room Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">Categories, pricing, amenities, and live room state</p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-harbor px-4 text-sm font-semibold text-white">
          <Plus size={18} />
          New Room
        </button>
      </div>
      <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">All statuses</option>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="occupied">Occupied</option>
        <option value="cleaning">Cleaning</option>
        <option value="maintenance">Maintenance</option>
      </select>
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
    </div>
  );
}
