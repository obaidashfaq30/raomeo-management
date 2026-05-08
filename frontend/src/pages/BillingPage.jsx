import { useEffect, useState } from "react";
import { endpoints } from "../api/client";
import DataTable from "../components/ui/DataTable.jsx";

export default function BillingPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    endpoints.invoices().then((response) => setInvoices(response.data.data)).catch(() => setInvoices([]));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow-pill">Finance</span>
        <h1 className="mt-3 page-title">Billing & Invoicing</h1>
        <p className="page-copy">Invoices, payments, taxes, discounts, and refunds</p>
      </div>
      <DataTable
        columns={[
          { key: "number", label: "Invoice" },
          { key: "guest", label: "Guest", render: (invoice) => invoice.guest ? `${invoice.guest.first_name} ${invoice.guest.last_name}` : "" },
          { key: "issued_on", label: "Issued" },
          { key: "total", label: "Total", render: (invoice) => `$${(invoice.total_cents / 100).toFixed(2)}` },
          { key: "status", label: "Status", badge: true }
        ]}
        rows={invoices}
      />
    </div>
  );
}
