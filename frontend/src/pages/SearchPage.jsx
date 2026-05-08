import { useState } from "react";
import { Search } from "lucide-react";
import { endpoints } from "../api/client";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  const runSearch = async (event) => {
    event.preventDefault();
    const response = await endpoints.search({ q, limit: 30 });
    setResults(response.data.data);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">ParetoSearch</h1>
        <p className="mt-1 text-sm text-slate-500">Guests, bookings, rooms, and invoices</p>
      </div>
      <form onSubmit={runSearch} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-panel">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 outline-none focus:border-harbor" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search records" />
        </div>
        <button className="h-10 rounded-lg bg-harbor px-4 font-semibold text-white">Search</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.map((result) => (
          <article key={`${result.type}-${result.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
            <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold uppercase text-harbor">{result.type}</span>
            <h2 className="mt-3 text-base font-semibold text-ink">{result.label}</h2>
            <p className="mt-2 text-sm text-slate-500">Score {result.score}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
