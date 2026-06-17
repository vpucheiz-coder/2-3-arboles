"use client";

import { motion } from "framer-motion";

const EXPOSITORES = ["Víctor Puche", "Juan A. Rodríguez", "Ignacio Campero"];

function MiniTree() {
  return (
    <motion.svg
      width={140}
      height={90}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <line x1={70} y1={20} x2={30} y2={60} stroke="var(--color-borde)" strokeWidth={2} />
      <line x1={70} y1={20} x2={110} y2={60} stroke="var(--color-borde)" strokeWidth={2} />
      <rect x={50} y={4} width={40} height={28} rx={6} fill="var(--color-accent)" />
      <text x={70} y={23} textAnchor="middle" fontWeight={700} fontSize={13} fill="var(--color-node-text-active)">
        10
      </text>
      <rect x={10} y={56} width={40} height={28} rx={6} fill="var(--color-node-normal)" />
      <text x={30} y={75} textAnchor="middle" fontWeight={700} fontSize={13} fill="var(--color-node-text-default)">
        5
      </text>
      <rect x={90} y={56} width={40} height={28} rx={6} fill="var(--color-node-normal)" />
      <text x={110} y={75} textAnchor="middle" fontWeight={700} fontSize={13} fill="var(--color-node-text-default)">
        15
      </text>
    </motion.svg>
  );
}

export function Cierre() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-[clamp(56px,9vw,128px)] font-extrabold leading-none tracking-tight text-accent"
      >
        ¿Preguntas?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="text-xl text-foreground sm:text-2xl"
      >
        Estamos aquí para responder
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col gap-3 sm:flex-row sm:gap-4"
      >
        {EXPOSITORES.map((nombre, i) => (
          <motion.div
            key={nombre}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
            className="rounded-lg border border-edge bg-card px-6 py-3 text-base font-medium text-foreground"
          >
            {nombre}
          </motion.div>
        ))}
      </motion.div>

      <MiniTree />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="text-sm text-secondary"
      >
        Gracias por su atención
      </motion.p>
    </div>
  );
}
