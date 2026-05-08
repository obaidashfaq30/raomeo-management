import StatusBadge from "./StatusBadge.jsx";

export default function DataTable({ columns, rows, emptyLabel = "No records" }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-mist">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50">
                  {columns.map((column) => {
                    const value = column.render ? column.render(row) : row[column.key];
                    return (
                      <td key={column.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
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
