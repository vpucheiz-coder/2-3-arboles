"use client";

import { motion } from "framer-motion";

const EXPOSITORES = ["Víctor Puche", "Juan A. Rodríguez", "Ignacio Campero"];

export function Inicio() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-[clamp(56px,9vw,128px)] font-extrabold leading-none tracking-tight text-accent"
      >
        Árbol 2-3
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="text-xl text-foreground sm:text-2xl"
      >
        Una estructura de datos que nunca pierde el equilibrio
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

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="text-sm text-secondary"
      >
        Algoritmos y Estructuras de Datos · UCAB
      </motion.p>
    </div>
  );
}
