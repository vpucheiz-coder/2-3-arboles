const FEATURES = [
  {
    icon: "⚖️",
    title: "Balanceo perfecto",
    desc: "Todas las hojas están al mismo nivel, sin excepción.",
  },
  {
    icon: "🔢",
    title: "Claves ordenadas",
    desc: "En un nodo-3, la clave izquierda es siempre menor que la derecha.",
  },
  {
    icon: "🔍",
    title: "Invariante BST",
    desc: "La propiedad de árbol de búsqueda se mantiene en todo momento, incluso durante splits y fusiones.",
  },
  {
    icon: "📏",
    title: "Altura garantizada",
    desc: "La altura del árbol siempre es O(log n) respecto al número de claves.",
  },
];

const COMPLEXITY = [
  { op: "Búsqueda", complexity: "O(log n)" },
  { op: "Inserción", complexity: "O(log n)" },
  { op: "Eliminación", complexity: "O(log n)" },
  { op: "Espacio", complexity: "O(n)" },
];

export function Caracteristicas() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">Características</h2>
        <p className="mt-1 text-[#8B949E]">Propiedades clave del Árbol 2-3</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-[#30363D] bg-[#1C2128] p-5"
          >
            <div className="mb-2 text-2xl">{f.icon}</div>
            <h3 className="font-semibold text-[#F0A500]">{f.title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#8B949E]">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#30363D] bg-[#1C2128] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[#8B949E]">
          Complejidad
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#30363D] text-left text-[#8B949E]">
              <th className="py-2 pr-4 font-medium">Operación</th>
              <th className="py-2 font-medium">Complejidad</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEXITY.map((row) => (
              <tr key={row.op} className="border-b border-[#30363D]/60">
                <td className="py-2 pr-4 text-[#E6EDF3]">{row.op}</td>
                <td className="py-2 font-mono text-[#F0A500]">
                  {row.complexity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
