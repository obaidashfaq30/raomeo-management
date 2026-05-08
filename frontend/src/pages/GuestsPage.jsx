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
        <span className="eyebrow-pill">CRM</span>
        <h1 className="mt-3 page-title">Guest Profiles</h1>
        <p className="page-copy">Details, stay history, preferences, notes, and loyalty</p>
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
