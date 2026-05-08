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
        <span className="eyebrow-pill">Fast lookup</span>
        <h1 className="mt-3 page-title">ParetoSearch</h1>
        <p className="page-copy">Guests, bookings, rooms, and invoices</p>
      </div>
      <form onSubmit={runSearch} className="glass-panel flex gap-3 rounded-2xl p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input className="field-glass pl-10" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search records" />
        </div>
        <button className="btn-primary h-11 px-4">Search</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.map((result) => (
          <article key={`${result.type}-${result.id}`} className="glass-panel rounded-xl p-4 transition hover:-translate-y-0.5">
            <span className="eyebrow-pill">{result.type}</span>
            <h2 className="mt-3 text-base font-bold text-ink">{result.label}</h2>
            <p className="mt-2 text-sm text-slate-500">Score {result.score}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
