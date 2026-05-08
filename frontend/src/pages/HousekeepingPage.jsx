import { useEffect, useState } from "react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    endpoints.housekeepingTasks().then((response) => setTasks(response.data.data)).catch(() => setTasks([]));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Housekeeping</h1>
        <p className="mt-1 text-sm text-slate-500">Cleaning status, schedules, assignments, and staff workload</p>
      </div>
      <DataTable
        columns={[
          { key: "room", label: "Room", render: (task) => task.room?.number },
          { key: "task_type", label: "Task" },
          { key: "scheduled_for", label: "Scheduled" },
          { key: "assigned", label: "Assigned", render: (task) => task.assigned_to?.name || "Open" },
          { key: "status", label: "Status", badge: true }
        ]}
        rows={tasks}
      />
    </div>
  );
}
