"use client";

import { useMemo } from "react";
import { computeTreeLayout } from "@/lib/treeLayout";
import type { TreeNode } from "@/lib/tree23";

export function useTreeLayout(root: TreeNode | null) {
  return useMemo(() => computeTreeLayout(root), [root]);
}
