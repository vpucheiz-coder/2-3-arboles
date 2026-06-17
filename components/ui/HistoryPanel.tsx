import type { HistoryEntry } from "@/context/TreeContext";

export function HistoryPanel({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="rounded-lg border border-[#30363D] bg-[#1C2128] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#8B949E]">Historial de operaciones</h3>
      {history.length === 0 ? (
        <p className="text-sm text-[#8B949E]">Sin operaciones todavía</p>
      ) : (
        <ul className="space-y-1.5">
          {history.map((entry) => (
            <li
              key={entry.id}
              className={`rounded px-2 py-1 font-mono text-sm ${
                entry.type === "insert" ? "text-[#22C55E]" : "text-[#EF4444]"
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
