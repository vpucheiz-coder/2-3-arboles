"use client";

import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";

const ABB_MAX = 1_000_000;
const ARBOL23_MAX = 13;

const CARDS = [
  {
    title: "Bases de datos",
    desc: "PostgreSQL y MySQL usan B-Trees (generalizaciones del 2-3) para todos sus índices.",
  },
  {
    title: "Sistemas de archivos",
    desc: "macOS HFS+ y NTFS de Windows usan B-Trees para el directorio de archivos.",
  },
  {
    title: "Compiladores",
    desc: "Los árboles balanceados indexan las tablas de símbolos durante la compilación.",
  },
  {
    title: "Git",
    desc: "El sistema de objetos de Git usa estructuras similares para indexar el historial.",
  },
];

function useCountUp(target: number, durationSeconds: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration: durationSeconds,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, durationSeconds]);
  return value;
}

function ComparisonBar({
  label,
  count,
  target,
  barWidthPct,
  colorClass,
}: {
  label: string;
  count: number;
  target: number;
  barWidthPct: number;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold text-foreground">{label}</span>
        <span className="font-mono text-3xl font-bold text-foreground">
          {count.toLocaleString("es")}
        </span>
      </div>
      <div className="h-5 w-full overflow-hidden rounded-full bg-edge/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidthPct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
      <span className="text-xs text-secondary">
        máximo {target.toLocaleString("es")} comparaciones
      </span>
    </div>
  );
}

export function Aplicaciones() {
  const abbCount = useCountUp(ABB_MAX, 1.8);
  const arbolCount = useCountUp(ARBOL23_MAX, 1.2);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-5xl">
          Un millón de datos
        </h2>
        <p className="mt-2 text-secondary">
          Comparaciones necesarias para encontrar un valor entre 1,000,000 de claves
        </p>
      </header>

      <div className="flex flex-col gap-8 rounded-lg border border-edge bg-card p-6 sm:p-8">
        <ComparisonBar
          label="Árbol Binario (degenerado)"
          count={abbCount}
          target={ABB_MAX}
          barWidthPct={100}
          colorClass="bg-node-eliminado"
        />
        <ComparisonBar
          label="Árbol 2-3"
          count={arbolCount}
          target={ARBOL23_MAX}
          barWidthPct={Math.max((ARBOL23_MAX / ABB_MAX) * 100, 0.6)}
          colorClass="bg-node-nuevo"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <div
            key={c.title}
            className="rounded-lg border border-edge bg-card p-5"
          >
            <h3 className="font-semibold text-accent">{c.title}</h3>
            <p className="mt-1 text-sm leading-6 text-secondary">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
