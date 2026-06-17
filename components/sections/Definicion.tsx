"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const MINI_BALANCED_TREE = createInternal([10], [createLeaf([5]), createLeaf([15])]);

function SkewedChain() {
  const positions = [10, 20, 16, 24, 18];
  const step = 38;
  const startY = 10;
  return (
    <svg width={140} height={220} className="mx-auto">
      {positions.slice(0, -1).map((_, i) => (
        <line
          key={i}
          x1={20 + i * 6}
          y1={startY + i * step + 12}
          x2={20 + (i + 1) * 6}
          y2={startY + (i + 1) * step + 12}
          stroke="var(--color-borde)"
          strokeWidth={2}
        />
      ))}
      {positions.map((v, i) => (
        <g key={i} transform={`translate(${20 + i * 6}, ${startY + i * step})`}>
          <rect
            x={-18}
            y={0}
            width={36}
            height={24}
            rx={6}
            fill="var(--color-bg-principal)"
            stroke="var(--color-node-eliminado)"
            strokeWidth={1.5}
          />
          <text
            x={0}
            y={16}
            textAnchor="middle"
            fontWeight={700}
            fontSize={12}
            fill="var(--color-text-principal)"
          >
            {v}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MiniComparisonDiagram() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 rounded-md border border-edge bg-background/40 p-4">
      <div className="flex flex-col items-center gap-2">
        <SkewedChain />
        <span className="text-xs text-secondary">ABB degenerado — altura 5</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <TreeCanvas root={MINI_BALANCED_TREE} minHeight={220} />
        <span className="text-xs text-secondary">Árbol 2-3 — altura 2</span>
      </div>
    </div>
  );
}

const COMPARACIONES = [
  {
    title: "Altura",
    abb: "Puede desbalancearse, O(n) en el peor caso",
    arbol23: "Siempre balanceado, O(log n) garantizado",
  },
  {
    title: "Nodos",
    abb: "1 clave por nodo, máx. 2 hijos",
    arbol23: "1–2 claves por nodo, 2–3 hijos",
  },
  {
    title: "Inserción",
    abb: "Puede crear cadenas largas",
    arbol23: "Split garantiza balance tras inserción",
  },
  {
    title: "Búsqueda",
    abb: "Recorre hasta n nodos en árbol degenerado",
    arbol23: "Máx. log₃(n) niveles siempre",
  },
];

function ComparisonCard({
  title,
  abb,
  arbol23,
}: {
  title: string;
  abb: string;
  arbol23: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      className="w-full rounded-lg border border-edge bg-card p-4 text-left transition-colors hover:border-accent/50"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <span className="text-xs text-secondary">
          {expanded ? "ocultar ▲" : "click para ver detalle ▼"}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-node-eliminado/30 bg-node-eliminado/5 p-3">
          <span className="text-xs font-semibold text-node-eliminado">ABB (ineficiente)</span>
          <p className="mt-1 text-sm text-secondary">{abb}</p>
        </div>
        <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
          <span className="text-xs font-semibold text-accent">Árbol 2-3</span>
          <p className="mt-1 text-sm text-secondary">{arbol23}</p>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <MiniComparisonDiagram />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Definicion() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-foreground">Definición</h2>
        <p className="mt-1 text-secondary">¿Qué es un Árbol 2-3?</p>
      </header>

      <div className="rounded-lg border border-edge bg-card p-6">
        <p className="leading-7 text-foreground">
          Un <strong className="text-accent">árbol 2-3</strong> es un árbol
          de búsqueda <strong>perfectamente balanceado</strong> en el que cada
          nodo interno tiene 2 o 3 hijos y 1 o 2 claves. Es un caso particular
          de B-árbol de orden 3.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground">
          <li>
            Un nodo con <strong className="text-accent-light">1 clave</strong>{" "}
            (nodo-2) tiene exactamente <strong>2 hijos</strong>.
          </li>
          <li>
            Un nodo con <strong className="text-accent-light">2 claves</strong>{" "}
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

      <div className="rounded-lg border border-edge bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-secondary">
          Ejemplo visual
        </h3>
        <TreeCanvas root={EXAMPLE_TREE} minHeight={300} />
        <p className="mt-3 text-sm text-secondary">
          La raíz y el nodo izquierdo son nodos-2 (1 clave); el nodo derecho
          es un nodo-3 (2 claves). Todas las hojas están al mismo nivel.
        </p>
      </div>

      <div className="rounded-lg border border-edge bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          ¿Cómo funciona la búsqueda?
        </h3>
        <p className="mt-3 leading-7 text-secondary">
          En cada nodo se comparan 1 o 2 claves. Si la clave buscada es menor
          que la primera clave, se desciende por el hijo izquierdo. Si el
          nodo tiene una segunda clave y la clave buscada está entre ambas,
          se desciende por el hijo central. Si la clave buscada es mayor que
          la última clave, se desciende por el hijo derecho. Esto garantiza
          una búsqueda en O(log n), con una base logarítmica mayor que 2.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {COMPARACIONES.map((c) => (
            <ComparisonCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
