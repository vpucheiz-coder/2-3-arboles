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
  default: "#2D3748",
  active: "#F0A500",
  new: "#22C55E",
  removed: "#EF4444",
};

export function TreeNodeShape({ x, y, keys, status, depth }: TreeNodeShapeProps) {
  const width = Math.max(keys.length, 1) * KEY_WIDTH;
  const textColor = status === "active" ? "#0D1117" : "#E6EDF3";

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
        stroke={status === "active" ? "#F0A500" : "#30363D"}
        strokeWidth={status === "active" ? 2 : 1}
        style={
          status === "active"
            ? { filter: "drop-shadow(0 0 6px rgba(240, 165, 0, 0.55))" }
            : undefined
        }
      />
      {keys.length === 2 && (
        <line
          x1={0}
          y1={-HEIGHT / 2 + 6}
          x2={0}
          y2={HEIGHT / 2 - 6}
          stroke="#30363D"
          strokeWidth={1.5}
        />
      )}
      {keys.map((k, i) => {
        const keyX = keys.length === 1 ? 0 : i === 0 ? -width / 4 : width / 4;
        return (
          <text
            key={i}
            x={keyX}
            y={5}
            textAnchor="middle"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight={700}
            fontSize={16}
            fill={textColor}
          >
            {k}
          </text>
        );
      })}
      {depth !== undefined && (
        <text
          x={0}
          y={HEIGHT / 2 + 16}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize={11}
          fill="#8B949E"
        >
          nivel {depth}
        </text>
      )}
    </motion.g>
  );
}
