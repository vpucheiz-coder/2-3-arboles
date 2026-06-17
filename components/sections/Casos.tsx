"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          fill="var(--color-accent)"
          stroke="var(--color-accent-light)"
          strokeWidth={2}
        />
        <line x1={width / 3} y1={6} x2={width / 3} y2={height - 6} stroke="var(--color-node-text-active)" strokeWidth={1.5} />
        <line
          x1={(2 * width) / 3}
          y1={6}
          x2={(2 * width) / 3}
          y2={height - 6}
          stroke="var(--color-node-text-active)"
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
            fill="var(--color-node-text-active)"
          >
            {k}
          </text>
        ))}
      </svg>
    </div>
  );
}

function KeyBox({
  x,
  y = 70,
  keys,
  highlightIndex,
  overflow,
}: {
  x: number;
  y?: number;
  keys: number[];
  highlightIndex?: number;
  overflow?: boolean;
}) {
  const keyWidth = 40;
  const width = keys.length * keyWidth;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={-width / 2}
        y={0}
        width={width}
        height={36}
        rx={6}
        fill={overflow ? "var(--color-node-eliminado)" : "var(--color-node-normal)"}
        stroke={overflow ? "var(--color-node-eliminado)" : "var(--color-borde)"}
        strokeWidth={1.5}
      />
      {keys.slice(0, -1).map((_, i) => (
        <line
          key={i}
          x1={-width / 2 + (i + 1) * keyWidth}
          y1={4}
          x2={-width / 2 + (i + 1) * keyWidth}
          y2={32}
          stroke={overflow ? "var(--color-bg-principal)" : "var(--color-borde)"}
          strokeWidth={1}
          opacity={0.5}
        />
      ))}
      {keys.map((k, i) => (
        <text
          key={i}
          x={-width / 2 + keyWidth * (i + 0.5)}
          y={23}
          textAnchor="middle"
          fontWeight={700}
          fontSize={14}
          fill={
            highlightIndex === i
              ? "var(--color-accent)"
              : overflow
                ? "var(--color-node-text-default)"
                : "var(--color-text-principal)"
          }
        >
          {k}
        </text>
      ))}
    </g>
  );
}

const SPLIT_STEPS = [
  {
    label: "Nodo en overflow",
    text: "El nodo tiene 3 claves — excede la capacidad. Se produce overflow.",
    render: () => (
      <svg width={220} height={140}>
        <KeyBox x={110} keys={[10, 20, 30]} overflow />
      </svg>
    ),
  },
  {
    label: "Identificar la clave media",
    text: "La clave central (20) subirá al nodo padre.",
    render: () => (
      <svg width={220} height={140}>
        <KeyBox x={110} keys={[10, 20, 30]} overflow highlightIndex={1} />
      </svg>
    ),
  },
  {
    label: "Dividir en dos nodos",
    text: "10 forma el hijo izquierdo. 30 forma el hijo derecho.",
    render: () => (
      <svg width={220} height={160}>
        <text x={110} y={20} textAnchor="middle" fontWeight={700} fontSize={14} fill="var(--color-accent)">
          20 ↑
        </text>
        <KeyBox x={55} keys={[10]} />
        <KeyBox x={165} keys={[30]} />
      </svg>
    ),
  },
  {
    label: "K2 sube al padre",
    text: "20 se agrega al padre. Si el padre también entra en overflow, el proceso se repite.",
    render: () => (
      <svg width={220} height={170}>
        <KeyBox x={110} y={16} keys={[20]} highlightIndex={0} />
        <line x1={100} y1={52} x2={55} y2={106} stroke="var(--color-borde)" strokeWidth={1.5} />
        <line x1={120} y1={52} x2={165} y2={106} stroke="var(--color-borde)" strokeWidth={1.5} />
        <KeyBox x={55} y={106} keys={[10]} />
        <KeyBox x={165} y={106} keys={[30]} />
      </svg>
    ),
  },
  {
    label: "Caso especial: split en la raíz",
    text: "Si la raíz hace split, el árbol crece en altura — es la única forma en que crece.",
    render: () => (
      <svg width={220} height={170}>
        <text x={110} y={12} textAnchor="middle" fontSize={12} fill="var(--color-text-secundario)">
          nueva raíz
        </text>
        <KeyBox x={110} y={16} keys={[20]} highlightIndex={0} />
        <line x1={100} y1={52} x2={55} y2={106} stroke="var(--color-borde)" strokeWidth={1.5} />
        <line x1={120} y1={52} x2={165} y2={106} stroke="var(--color-borde)" strokeWidth={1.5} />
        <KeyBox x={55} y={106} keys={[10]} />
        <KeyBox x={165} y={106} keys={[30]} />
      </svg>
    ),
  },
];

function SplitPasoAPaso() {
  const [step, setStep] = useState(0);
  const total = SPLIT_STEPS.length;
  const current = SPLIT_STEPS[step];

  return (
    <div className="rounded-lg border border-edge bg-card p-5">
      <h3 className="text-lg font-semibold text-accent">Split paso a paso</h3>
      <p className="text-xs text-secondary">
        Paso {step + 1} de {total} — {current.label}
      </p>

      <div className="my-4 flex min-h-[180px] items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {current.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="min-h-[40px] text-sm leading-6 text-secondary">{current.text}</p>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-md border border-edge bg-background px-4 py-2 text-sm font-medium text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
          disabled={step === total - 1}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
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
        <h2 className="text-2xl font-bold text-foreground">Casos de nodos</h2>
        <p className="mt-1 text-secondary">Tipos de nodos y sus variantes</p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {CASES.map((c) => (
          <div
            key={c.title}
            className="flex flex-col rounded-lg border border-edge bg-card p-5"
          >
            <h3 className="text-lg font-semibold text-accent">{c.title}</h3>
            <p className="text-xs text-secondary">{c.subtitle}</p>
            <div className="my-4 flex flex-1 items-center justify-center overflow-hidden rounded-md">
              {c.render()}
            </div>
            <p className="text-sm leading-6 text-secondary">{c.desc}</p>
          </div>
        ))}
      </div>

      <SplitPasoAPaso />
    </div>
  );
}
