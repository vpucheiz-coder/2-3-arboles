interface PseudocodeProps {
  lines: readonly string[];
  activeLine: number | null;
  title?: string;
}

export function Pseudocode({ lines, activeLine, title }: PseudocodeProps) {
  return (
    <div className="rounded-lg border border-edge bg-card p-4">
      {title && <div className="mb-2 text-sm font-semibold text-secondary">{title}</div>}
      <pre className="overflow-x-auto font-mono text-[13px] leading-6">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre rounded px-2 transition-colors duration-200 ${
              i === activeLine
                ? "bg-accent/20 text-accent-light"
                : "text-foreground"
            }`}
          >
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
