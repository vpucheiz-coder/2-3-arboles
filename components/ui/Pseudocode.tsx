interface PseudocodeProps {
  lines: readonly string[];
  activeLine: number | null;
  title?: string;
}

export function Pseudocode({ lines, activeLine, title }: PseudocodeProps) {
  return (
    <div className="rounded-lg border border-[#30363D] bg-[#1C2128] p-4">
      {title && <div className="mb-2 text-sm font-semibold text-[#8B949E]">{title}</div>}
      <pre className="overflow-x-auto font-mono text-[13px] leading-6">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre rounded px-2 transition-colors duration-200 ${
              i === activeLine
                ? "bg-[#F0A500]/20 text-[#FFD166]"
                : "text-[#E6EDF3]"
            }`}
          >
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
