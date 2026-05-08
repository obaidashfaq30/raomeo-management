import { useEffect, useState } from "react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

export default function FoodBeveragePage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    endpoints.foodBeverageOrders().then((response) => setOrders(response.data.data)).catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow-pill">F&B</span>
        <h1 className="mt-3 page-title">Food & Beverage</h1>
        <p className="page-copy">Room service, restaurant charges, and order tracking</p>
      </div>
      <DataTable
        columns={[
          { key: "room", label: "Room", render: (order) => order.room?.number || "-" },
          { key: "guest", label: "Guest", render: (order) => order.guest ? `${order.guest.first_name} ${order.guest.last_name}` : "-" },
          { key: "source", label: "Source" },
          { key: "total", label: "Total", render: (order) => `$${(order.total_cents / 100).toFixed(2)}` },
          { key: "status", label: "Status", badge: true }
        ]}
        rows={orders}
      />
    </div>
  );
}
