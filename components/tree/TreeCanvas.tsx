"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TreeNode } from "@/lib/tree23";
import { useTreeLayout } from "./useTreeLayout";
import { TreeNodeShape, NodeStatus } from "./TreeNodeShape";

interface TreeCanvasProps {
  root: TreeNode | null;
  highlightedNodes?: string[];
  newNodes?: string[];
  removedNodes?: string[];
  className?: string;
  minHeight?: number;
  showDepth?: boolean;
}

export function TreeCanvas({
  root,
  highlightedNodes = [],
  newNodes = [],
  removedNodes = [],
  className,
  minHeight = 360,
  showDepth = false,
}: TreeCanvasProps) {
  const { nodes, links, width, height } = useTreeLayout(root);

  const getStatus = (id: string): NodeStatus => {
    if (removedNodes.includes(id)) return "removed";
    if (newNodes.includes(id)) return "new";
    if (highlightedNodes.includes(id)) return "active";
    return "default";
  };

  if (!root) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-[#30363D] text-sm text-[#8B949E] ${className ?? ""}`}
        style={{ minHeight }}
      >
        Árbol vacío — inserta un valor para comenzar
      </div>
    );
  }

  return (
    <div
      className={`overflow-auto rounded-lg bg-[#1C2128] ${className ?? ""}`}
      style={{ minHeight }}
    >
      <svg width={Math.max(width, 200)} height={Math.max(height, minHeight)}>
        <g>
          {links.map((link) => (
            <motion.line
              key={link.id}
              initial={{ opacity: 0, x1: link.x1, y1: link.y1, x2: link.x2, y2: link.y2 }}
              animate={{ x1: link.x1, y1: link.y1, x2: link.x2, y2: link.y2, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              stroke="#30363D"
              strokeWidth={2}
            />
          ))}
        </g>
        <AnimatePresence>
          {nodes.map((node) => (
            <TreeNodeShape
              key={node.id}
              x={node.x}
              y={node.y}
              keys={node.keys}
              status={getStatus(node.id)}
              depth={showDepth ? node.depth : undefined}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}
