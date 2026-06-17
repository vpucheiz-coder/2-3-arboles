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

const BTREE_ROWS = [
  { label: "Orden", arbol23: "Fijo: 3", btree: "Variable: m (configurable)" },
  { label: "Claves por nodo", arbol23: "1 o 2", btree: "1 a m-1" },
  { label: "Hijos por nodo", arbol23: "2 o 3", btree: "2 a m" },
  { label: "Balanceo", arbol23: "Perfecto (hojas al mismo nivel)", btree: "Perfecto (hojas al mismo nivel)" },
  { label: "Split", arbol23: "Siempre divide en 2 nodos", btree: "Divide según orden m" },
  { label: "Uso típico", arbol23: "Educación, estructuras académicas", btree: "Bases de datos, sistemas de archivos" },
  { label: "Altura máxima", arbol23: "O(log₂ n) a O(log₃ n)", btree: "O(log_m n) — crece más lento con m grande" },
];

const CONCLUSIONES = [
  {
    title: "¿Por qué estudiar el 2-3?",
    desc: "Es el B-Tree más simple. Al dominar el 2-3, se comprende el mecanismo de balance de toda la familia B.",
  },
  {
    title: "¿Por qué usan B-Trees en producción?",
    desc: "Con m=500 o más, el árbol cabe casi completo en memoria caché, reduciendo accesos a disco.",
  },
];

export function Caracteristicas() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-foreground">Características</h2>
        <p className="mt-1 text-secondary">Propiedades clave del Árbol 2-3</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-edge bg-card p-5"
          >
            <div className="mb-2 text-2xl">{f.icon}</div>
            <h3 className="font-semibold text-accent">{f.title}</h3>
            <p className="mt-1 text-sm leading-6 text-secondary">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-edge bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Árbol 2-3 y los B-Trees: una familia de estructuras
        </h3>
        <p className="mt-3 leading-7 text-secondary">
          El Árbol 2-3 es un caso especial de B-Tree de orden 3. Entender esta
          relación es fundamental para comprender por qué los B-Trees dominan
          los motores de bases de datos y sistemas de archivos.
        </p>

        <div className="mt-5 overflow-hidden rounded-lg border border-edge">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-accent/10 text-sm font-semibold text-foreground">
            <div className="p-3">Característica</div>
            <div className="p-3">Árbol 2-3</div>
            <div className="p-3">B-Tree genérico</div>
          </div>
          {BTREE_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.2fr_1fr_1fr] text-sm ${
                i % 2 === 0 ? "bg-card" : "bg-background"
              }`}
            >
              <div className="border-t border-edge p-3 font-medium text-foreground">
                {row.label}
              </div>
              <div className="border-t border-edge p-3 text-accent">{row.arbol23}</div>
              <div className="border-t border-edge p-3 text-secondary">{row.btree}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONCLUSIONES.map((c) => (
          <div key={c.title} className="rounded-lg border border-edge bg-card p-5">
            <h3 className="font-semibold text-accent">{c.title}</h3>
            <p className="mt-1 text-sm leading-6 text-secondary">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
