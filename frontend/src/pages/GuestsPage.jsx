import { useEffect, useState } from "react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    endpoints.guests().then((response) => setGuests(response.data.data)).catch(() => setGuests([]));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Guest Profiles</h1>
        <p className="mt-1 text-sm text-slate-500">Details, stay history, preferences, notes, and loyalty</p>
      </div>
      <DataTable
        columns={[
          { key: "name", label: "Name", render: (guest) => `${guest.first_name} ${guest.last_name}` },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "loyalty_points", label: "Loyalty" },
          { key: "preferences", label: "Preferences" }
        ]}
        rows={guests}
      />
    </div>
  );
}
