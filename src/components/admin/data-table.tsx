import { cn } from "@/lib/utils";

export function DataTable({
  columns,
  rows,
  empty = "Nothing here yet.",
}: {
  columns: string[];
  rows: React.ReactNode[][];
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-medium text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn("border-b last:border-0 hover:bg-muted/30")}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
