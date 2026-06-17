import { hierarchy, tree as d3tree } from "d3-hierarchy";
import type { TreeNode } from "./tree23";

export interface PositionedNode {
  id: string;
  keys: number[];
  isLeaf: boolean;
  depth: number;
  x: number;
  y: number;
}

export interface PositionedLink {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TreeLayoutResult {
  nodes: PositionedNode[];
  links: PositionedLink[];
  width: number;
  height: number;
}

const NODE_WIDTH = 100;
const LEVEL_HEIGHT = 110;
const MARGIN = 50;

export function computeTreeLayout(root: TreeNode | null): TreeLayoutResult {
  if (!root) return { nodes: [], links: [], width: 0, height: 0 };

  const hierarchyRoot = hierarchy<TreeNode>(root, (d) => (d.children.length ? d.children : undefined));
  const layout = d3tree<TreeNode>().nodeSize([NODE_WIDTH, LEVEL_HEIGHT]);
  layout(hierarchyRoot);

  const descendants = hierarchyRoot.descendants();
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;
  descendants.forEach((d) => {
    minX = Math.min(minX, d.x ?? 0);
    maxX = Math.max(maxX, d.x ?? 0);
    maxY = Math.max(maxY, d.y ?? 0);
  });

  const offsetX = -minX + NODE_WIDTH / 2 + MARGIN;
  const offsetY = MARGIN;

  const nodes: PositionedNode[] = descendants.map((d) => ({
    id: d.data.id,
    keys: d.data.keys,
    isLeaf: d.data.isLeaf,
    depth: d.depth,
    x: (d.x ?? 0) + offsetX,
    y: (d.y ?? 0) + offsetY,
  }));

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const links: PositionedLink[] = hierarchyRoot.links().map((l) => {
    const source = nodeById.get(l.source.data.id)!;
    const target = nodeById.get(l.target.data.id)!;
    return {
      id: `${source.id}-${target.id}`,
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
    };
  });

  return {
    nodes,
    links,
    width: maxX - minX + NODE_WIDTH + MARGIN * 2,
    height: maxY + MARGIN * 2,
  };
}
