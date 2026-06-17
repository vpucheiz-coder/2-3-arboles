"use client";

import { motion } from "framer-motion";

export type NodeStatus = "default" | "active" | "new" | "removed";

interface TreeNodeShapeProps {
  x: number;
  y: number;
  keys: number[];
  status: NodeStatus;
  depth?: number;
}

const HEIGHT = 44;
const KEY_WIDTH = 46;

const FILL: Record<NodeStatus, string> = {
  default: "var(--color-node-normal)",
  active: "var(--color-node-activo)",
  new: "var(--color-node-nuevo)",
  removed: "var(--color-node-eliminado)",
};

const TEXT: Record<NodeStatus, string> = {
  default: "var(--color-node-text-default)",
  active: "var(--color-node-text-active)",
  new: "#FFFFFF",
  removed: "#FFFFFF",
};

export function TreeNodeShape({ x, y, keys, status, depth }: TreeNodeShapeProps) {
  const width = Math.max(keys.length, 1) * KEY_WIDTH;
  const textColor = TEXT[status];
  // A node only ever has 3 keys transiently mid-insertion (overflow) — the
  // committed tree never has node-4s, so this alone is enough to flag it.
  const overflow = keys.length === 3;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6, x, y }}
      animate={{
        opacity: status === "removed" ? 0 : 1,
        scale: status === "active" ? 1.05 : 1,
        x,
        y,
      }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <rect
        x={-width / 2}
        y={-HEIGHT / 2}
        width={width}
        height={HEIGHT}
        rx={8}
        fill={FILL[status]}
        stroke={
          overflow
            ? "var(--color-node-eliminado)"
            : status === "active"
              ? "var(--color-accent)"
              : "var(--color-borde)"
        }
        strokeWidth={overflow ? 2.5 : status === "active" ? 2 : 1}
        style={{
          filter: overflow
            ? "drop-shadow(0 0 6px var(--color-node-eliminado))"
            : status === "active"
              ? "drop-shadow(0 0 6px var(--color-accent))"
              : undefined,
        }}
      />
      {keys.slice(0, -1).map((_, i) => (
        <line
          key={i}
          x1={-width / 2 + KEY_WIDTH * (i + 1)}
          y1={-HEIGHT / 2 + 6}
          x2={-width / 2 + KEY_WIDTH * (i + 1)}
          y2={HEIGHT / 2 - 6}
          stroke={textColor}
          strokeWidth={1.5}
          opacity={0.4}
        />
      ))}
      {keys.map((k, i) => (
        <text
          key={i}
          x={-width / 2 + KEY_WIDTH * (i + 0.5)}
          y={5}
          textAnchor="middle"
          fontFamily="var(--font-inter), sans-serif"
          fontWeight={700}
          fontSize={16}
          fill={textColor}
        >
          {k}
        </text>
      ))}
      {overflow && (
        <text
          x={0}
          y={-HEIGHT / 2 - 8}
          textAnchor="middle"
          fontFamily="var(--font-inter), sans-serif"
          fontWeight={700}
          fontSize={10}
          fill="var(--color-node-eliminado)"
        >
          OVERFLOW
        </text>
      )}
      {depth !== undefined && (
        <text
          x={0}
          y={HEIGHT / 2 + 16}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize={11}
          fill="var(--color-text-secundario)"
        >
          nivel {depth}
        </text>
      )}
    </motion.g>
  );
}
