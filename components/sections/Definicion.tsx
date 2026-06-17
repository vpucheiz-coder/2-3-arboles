import { createInternal, createLeaf } from "@/lib/tree23";
import { TreeCanvas } from "@/components/tree/TreeCanvas";

const EXAMPLE_TREE = createInternal(
  [10],
  [
    createInternal([5], [createLeaf([3]), createLeaf([7])]),
    createInternal(
      [20, 30],
      [createLeaf([15]), createLeaf([25]), createLeaf([35])]
    ),
  ]
);

export function Definicion() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">Definición</h2>
        <p className="mt-1 text-[#8B949E]">¿Qué es un Árbol 2-3?</p>
      </header>

      <div className="rounded-lg border border-[#30363D] bg-[#1C2128] p-6">
        <p className="leading-7 text-[#E6EDF3]">
          Un <strong className="text-[#F0A500]">árbol 2-3</strong> es un árbol
          de búsqueda <strong>perfectamente balanceado</strong> en el que cada
          nodo interno tiene 2 o 3 hijos y 1 o 2 claves. Es un caso particular
          de B-árbol de orden 3.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[#E6EDF3]">
          <li>
            Un nodo con <strong className="text-[#FFD166]">1 clave</strong>{" "}
            (nodo-2) tiene exactamente <strong>2 hijos</strong>.
          </li>
          <li>
            Un nodo con <strong className="text-[#FFD166]">2 claves</strong>{" "}
            (nodo-3) tiene exactamente <strong>3 hijos</strong>.
          </li>
          <li>
            <strong>Todas las hojas</strong> están en el mismo nivel — esto
            garantiza el balanceo perfecto.
          </li>
          <li>
            Dentro de cada nodo las claves están ordenadas, y se respeta la
            propiedad de un árbol de búsqueda binaria generalizado.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-[#30363D] bg-[#1C2128] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#8B949E]">
          Ejemplo visual
        </h3>
        <TreeCanvas root={EXAMPLE_TREE} minHeight={300} />
        <p className="mt-3 text-sm text-[#8B949E]">
          La raíz y el nodo izquierdo son nodos-2 (1 clave); el nodo derecho
          es un nodo-3 (2 claves). Todas las hojas están al mismo nivel.
        </p>
      </div>
    </div>
  );
}
