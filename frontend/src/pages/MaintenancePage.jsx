import { useEffect, useState } from "react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

export default function MaintenancePage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    endpoints.maintenanceTickets().then((response) => setTickets(response.data.data)).catch(() => setTickets([]));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Maintenance</h1>
        <p className="mt-1 text-sm text-slate-500">Room issues, assignments, priority, and status updates</p>
      </div>
      <DataTable
        columns={[
          { key: "room", label: "Room", render: (ticket) => ticket.room?.number },
          { key: "title", label: "Issue" },
          { key: "priority", label: "Priority" },
          { key: "assigned", label: "Assigned", render: (ticket) => ticket.assigned_to?.name || "Open" },
          { key: "status", label: "Status", badge: true }
        ]}
        rows={tickets}
      />
    </div>
  );
}
