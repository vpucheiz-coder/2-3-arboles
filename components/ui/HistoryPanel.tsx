import type { HistoryEntry } from "@/context/TreeContext";

export function HistoryPanel({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="rounded-lg border border-edge bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-secondary">Historial de operaciones</h3>
      {history.length === 0 ? (
        <p className="text-sm text-secondary">Sin operaciones todavía</p>
      ) : (
        <ul className="space-y-1.5">
          {history.map((entry) => (
            <li
              key={entry.id}
              className={`rounded px-2 py-1 font-mono text-sm ${
                entry.type === "insert" ? "text-node-nuevo" : "text-node-eliminado"
              }`}
            >
              {entry.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
