import { createInternal, createLeaf } from "@/lib/tree23";
import { TreeCanvas } from "@/components/tree/TreeCanvas";

const NODO_2 = createInternal([10], [createLeaf([5]), createLeaf([15])]);
const NODO_3 = createInternal(
  [10, 20],
  [createLeaf([5]), createLeaf([15]), createLeaf([25])]
);

function OverflowPreview() {
  const width = 180;
  const height = 50;
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 220 }}>
      <svg width={width} height={height}>
        <rect
          x={1}
          y={1}
          width={width - 2}
          height={height - 2}
          rx={8}
          fill="#F0A500"
          stroke="#FFD166"
          strokeWidth={2}
        />
        <line x1={width / 3} y1={6} x2={width / 3} y2={height - 6} stroke="#0D1117" strokeWidth={1.5} />
        <line
          x1={(2 * width) / 3}
          y1={6}
          x2={(2 * width) / 3}
          y2={height - 6}
          stroke="#0D1117"
          strokeWidth={1.5}
        />
        {[10, 20, 30].map((k, i) => (
          <text
            key={k}
            x={width / 6 + (i * width) / 3}
            y={height / 2 + 5}
            textAnchor="middle"
            fontWeight={700}
            fontSize={16}
            fill="#0D1117"
          >
            {k}
          </text>
        ))}
      </svg>
    </div>
  );
}

const CASES = [
  {
    title: "Nodo-2",
    subtitle: "1 clave, 2 hijos",
    desc: "El caso más simple: un nodo con una sola clave K divide el espacio de búsqueda en dos — valores menores que K a la izquierda, mayores a la derecha.",
    render: () => <TreeCanvas root={NODO_2} minHeight={220} />,
  },
  {
    title: "Nodo-3",
    subtitle: "2 claves, 3 hijos",
    desc: "Un nodo con dos claves K1 < K2 divide el espacio en tres rangos: menores que K1, entre K1 y K2, y mayores que K2.",
    render: () => <TreeCanvas root={NODO_3} minHeight={220} />,
  },
  {
    title: "Nodo temporal-4 (overflow)",
    subtitle: "3 claves — estado transitorio",
    desc: "Ocurre únicamente durante una inserción: al agregar una clave a un nodo que ya tenía 2, queda con 3 claves temporalmente. Este estado es inválido y se resuelve inmediatamente con un split: la clave del medio sube al padre.",
    render: () => <OverflowPreview />,
  },
];

export function Casos() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">Casos de nodos</h2>
        <p className="mt-1 text-[#8B949E]">Tipos de nodos y sus variantes</p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {CASES.map((c) => (
          <div
            key={c.title}
            className="flex flex-col rounded-lg border border-[#30363D] bg-[#1C2128] p-5"
          >
            <h3 className="text-lg font-semibold text-[#F0A500]">{c.title}</h3>
            <p className="text-xs text-[#8B949E]">{c.subtitle}</p>
            <div className="my-4 flex flex-1 items-center justify-center overflow-hidden rounded-md">
              {c.render()}
            </div>
            <p className="text-sm leading-6 text-[#8B949E]">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
