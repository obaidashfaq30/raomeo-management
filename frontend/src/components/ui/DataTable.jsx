import StatusBadge from "./StatusBadge.jsx";

export default function DataTable({ columns, rows, emptyLabel = "No records" }) {
  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white/45">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm font-medium text-slate-500" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index} className="transition hover:bg-white/55">
                  {columns.map((column) => {
                    const value = column.render ? column.render(row) : row[column.key];
                    return (
                      <td key={column.key} className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-700">
                        {column.badge ? <StatusBadge value={value} /> : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
