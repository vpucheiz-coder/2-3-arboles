import { DELETE_LINE, INSERT_LINE } from "./pseudocode";

export interface TreeNode {
  id: string;
  keys: number[];
  children: TreeNode[];
  isLeaf: boolean;
}

export type StepStatus = "default" | "active" | "new" | "removed";

export interface TreeStep {
  tree: TreeNode | null;
  highlightedNodes: string[];
  newNodes: string[];
  removedNodes: string[];
  line: number;
  description: string;
  stepIndex: number;
  stepName: string;
}

export const INSERT_STAGES = [
  "Descender al nodo hoja",
  "Insertar clave",
  "¿Overflow?",
  "Split",
  "Subir al padre",
  "¿Nueva raíz?",
] as const;

export const DELETE_STAGES = [
  "Buscar clave",
  "¿Es hoja?",
  "Eliminar / Reemplazar con sucesor",
  "¿Underflow?",
  "Redistribuir o Fusionar",
  "¿Raíz vacía?",
] as const;

const INSERT_STAGE_BY_LINE: Record<number, number> = {
  [INSERT_LINE.buscarHoja]: 0,
  [INSERT_LINE.agregar]: 1,
  [INSERT_LINE.checkOverflow]: 2,
  [INSERT_LINE.dividirCall]: 3,
  [INSERT_LINE.split]: 3,
  [INSERT_LINE.padreAgregar]: 4,
  [INSERT_LINE.checkPadreOverflow]: 2,
  [INSERT_LINE.dividirPadre]: 3,
  [INSERT_LINE.esRaiz]: 5,
  [INSERT_LINE.nuevaRaiz]: 5,
};

const DELETE_STAGE_BY_LINE: Record<number, number> = {
  [DELETE_LINE.buscar]: 0,
  [DELETE_LINE.eliminarClave]: 2,
  [DELETE_LINE.checkUnderflow]: 3,
  [DELETE_LINE.sucesor]: 2,
  [DELETE_LINE.reemplazarSucesor]: 2,
  [DELETE_LINE.eliminarSucesor]: 2,
  [DELETE_LINE.hermano]: 4,
  [DELETE_LINE.redistribuir]: 4,
  [DELETE_LINE.fusionar]: 4,
  [DELETE_LINE.corregirUnderflowPadre]: 5,
};

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function createLeaf(keys: number[]): TreeNode {
  return { id: newId(), keys, children: [], isLeaf: true };
}

export function createInternal(keys: number[], children: TreeNode[]): TreeNode {
  return { id: newId(), keys, children, isLeaf: false };
}

export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    id: node.id,
    keys: [...node.keys],
    children: node.children.map((c) => cloneTree(c)!),
    isLeaf: node.isLeaf,
  };
}

export function search(root: TreeNode | null, value: number): TreeNode | null {
  let node = root;
  while (node) {
    if (node.keys.includes(value)) return node;
    if (node.isLeaf) return null;
    let i = 0;
    while (i < node.keys.length && value > node.keys[i]) i++;
    node = node.children[i];
  }
  return null;
}

interface BuildCtx {
  steps: TreeStep[];
  treeRef: { current: TreeNode | null };
  operation: "insert" | "delete";
}

function pushStep(
  ctx: BuildCtx,
  line: number,
  description: string,
  highlightedNodes: string[],
  newNodes: string[] = [],
  removedNodes: string[] = []
) {
  const stageByLine = ctx.operation === "insert" ? INSERT_STAGE_BY_LINE : DELETE_STAGE_BY_LINE;
  const stages = ctx.operation === "insert" ? INSERT_STAGES : DELETE_STAGES;
  const stepIndex = stageByLine[line] ?? 0;
  ctx.steps.push({
    tree: cloneTree(ctx.treeRef.current),
    highlightedNodes,
    newNodes,
    removedNodes,
    line,
    description,
    stepIndex,
    stepName: stages[stepIndex],
  });
}

// ---------- INSERT ----------

interface SplitResult {
  promotedKey: number;
  left: TreeNode;
  right: TreeNode;
}

function splitNode(node: TreeNode, ctx: BuildCtx): SplitResult {
  const [k0, k1, k2] = node.keys;
  const left = node.isLeaf
    ? createLeaf([k0])
    : createInternal([k0], [node.children[0], node.children[1]]);
  const right = node.isLeaf
    ? createLeaf([k2])
    : createInternal([k2], [node.children[2], node.children[3]]);
  pushStep(
    ctx,
    INSERT_LINE.split,
    `Nodo desbordado (${k0}, ${k1}, ${k2}): la clave ${k1} sube, se crean dos nodos`,
    [node.id]
  );
  return { promotedKey: k1, left, right };
}

function insertRec(node: TreeNode, value: number, ctx: BuildCtx): SplitResult | null {
  if (node.isLeaf) {
    node.keys.push(value);
    node.keys.sort((a, b) => a - b);
    pushStep(
      ctx,
      INSERT_LINE.agregar,
      `Insertando ${value} en la hoja [${node.keys.join(", ")}]`,
      [node.id]
    );
    if (node.keys.length === 3) {
      pushStep(
        ctx,
        INSERT_LINE.checkOverflow,
        `Nodo en overflow: 3 claves temporales [${node.keys.join(", ")}]. Se requiere split.`,
        [node.id]
      );
      pushStep(ctx, INSERT_LINE.dividirCall, `Overflow: dividir la hoja`, [node.id]);
      return splitNode(node, ctx);
    }
    pushStep(ctx, INSERT_LINE.checkOverflow, `✓ No hay overflow — inserción completada.`, [node.id]);
    return null;
  }

  let i = 0;
  while (i < node.keys.length && value > node.keys[i]) i++;
  pushStep(
    ctx,
    INSERT_LINE.buscarHoja,
    `Descendiendo hacia el hijo ${i} de [${node.keys.join(", ")}]`,
    [node.id, node.children[i].id]
  );

  const result = insertRec(node.children[i], value, ctx);
  if (!result) return null;

  let insertPos = 0;
  while (insertPos < node.keys.length && result.promotedKey > node.keys[insertPos]) insertPos++;
  node.keys.splice(insertPos, 0, result.promotedKey);
  node.children.splice(i, 1, result.left, result.right);
  pushStep(
    ctx,
    INSERT_LINE.padreAgregar,
    `La clave ${result.promotedKey} sube al padre [${node.keys.join(", ")}]`,
    [node.id],
    [result.left.id, result.right.id]
  );
  if (node.keys.length === 3) {
    pushStep(
      ctx,
      INSERT_LINE.checkPadreOverflow,
      `Nodo en overflow: 3 claves temporales [${node.keys.join(", ")}]. Se requiere split.`,
      [node.id]
    );
    pushStep(ctx, INSERT_LINE.dividirPadre, `Overflow en el padre: dividir`, [node.id]);
    return splitNode(node, ctx);
  }
  pushStep(ctx, INSERT_LINE.checkPadreOverflow, `✓ No hay overflow — inserción completada.`, [node.id]);
  return null;
}

export function insertWithSteps(root: TreeNode | null, value: number): { root: TreeNode | null; steps: TreeStep[] } {
  const clonedRoot = cloneTree(root);
  const ctx: BuildCtx = { steps: [], treeRef: { current: clonedRoot }, operation: "insert" };

  if (!clonedRoot) {
    const leaf = createLeaf([value]);
    ctx.treeRef.current = leaf;
    pushStep(ctx, INSERT_LINE.buscarHoja, `Árbol vacío: ${value} es la raíz`, [leaf.id], [leaf.id]);
    return { root: leaf, steps: ctx.steps };
  }

  const result = insertRec(clonedRoot, value, ctx);
  if (result) {
    pushStep(ctx, INSERT_LINE.esRaiz, `El nodo dividido era la raíz`, []);
    const newRoot = createInternal([result.promotedKey], [result.left, result.right]);
    ctx.treeRef.current = newRoot;
    pushStep(
      ctx,
      INSERT_LINE.nuevaRaiz,
      `Se crea una nueva raíz con la clave ${result.promotedKey}`,
      [newRoot.id],
      [newRoot.id, result.left.id, result.right.id]
    );
    return { root: newRoot, steps: ctx.steps };
  }

  return { root: clonedRoot, steps: ctx.steps };
}

// ---------- DELETE ----------

function findMinLeaf(node: TreeNode): TreeNode {
  let n = node;
  while (!n.isLeaf) n = n.children[0];
  return n;
}

function fixUnderflow(parent: TreeNode, childIdx: number, ctx: BuildCtx) {
  const child = parent.children[childIdx];
  const leftSib = childIdx - 1 >= 0 ? parent.children[childIdx - 1] : null;
  const rightSib = childIdx + 1 < parent.children.length ? parent.children[childIdx + 1] : null;

  pushStep(
    ctx,
    DELETE_LINE.hermano,
    `Underflow en nodo [${child.keys.join(", ") || "vacío"}], buscando hermano con 2 claves`,
    [child.id]
  );

  if (rightSib && rightSib.keys.length === 2) {
    child.keys.push(parent.keys[childIdx]);
    parent.keys[childIdx] = rightSib.keys.shift()!;
    if (!child.isLeaf) child.children.push(rightSib.children.shift()!);
    pushStep(
      ctx,
      DELETE_LINE.redistribuir,
      `Redistribución: rota una clave desde el hermano derecho a través del padre`,
      [child.id, rightSib.id, parent.id]
    );
    return;
  }

  if (leftSib && leftSib.keys.length === 2) {
    child.keys.unshift(parent.keys[childIdx - 1]);
    parent.keys[childIdx - 1] = leftSib.keys.pop()!;
    if (!child.isLeaf) child.children.unshift(leftSib.children.pop()!);
    pushStep(
      ctx,
      DELETE_LINE.redistribuir,
      `Redistribución: rota una clave desde el hermano izquierdo a través del padre`,
      [child.id, leftSib.id, parent.id]
    );
    return;
  }

  if (rightSib) {
    child.keys.push(parent.keys[childIdx], ...rightSib.keys);
    child.children.push(...rightSib.children);
    parent.keys.splice(childIdx, 1);
    parent.children.splice(childIdx + 1, 1);
    pushStep(
      ctx,
      DELETE_LINE.fusionar,
      `Fusión: nodo + clave del padre + hermano derecho se combinan`,
      [child.id],
      [],
      [rightSib.id]
    );
    return;
  }

  if (leftSib) {
    leftSib.keys.push(parent.keys[childIdx - 1], ...child.keys);
    leftSib.children.push(...child.children);
    parent.keys.splice(childIdx - 1, 1);
    parent.children.splice(childIdx, 1);
    pushStep(
      ctx,
      DELETE_LINE.fusionar,
      `Fusión: hermano izquierdo + clave del padre + nodo se combinan`,
      [leftSib.id],
      [],
      [child.id]
    );
  }
}

function deleteRec(node: TreeNode, value: number, ctx: BuildCtx): boolean {
  if (node.isLeaf) {
    const idx = node.keys.indexOf(value);
    node.keys.splice(idx, 1);
    pushStep(
      ctx,
      DELETE_LINE.eliminarClave,
      `Clave ${value} eliminada de la hoja [${node.keys.join(", ") || "vacía"}]`,
      [node.id]
    );
    pushStep(ctx, DELETE_LINE.checkUnderflow, `¿La hoja quedó sin claves?`, [node.id]);
    return node.keys.length === 0;
  }

  const keyIdx = node.keys.indexOf(value);
  if (keyIdx !== -1) {
    const childIdx = keyIdx + 1;
    const succLeaf = findMinLeaf(node.children[childIdx]);
    const succKey = succLeaf.keys[0];
    pushStep(
      ctx,
      DELETE_LINE.sucesor,
      `Clave ${value} es interna: se busca el sucesor (mínimo del subárbol derecho)`,
      [node.id, succLeaf.id]
    );
    node.keys[keyIdx] = succKey;
    pushStep(
      ctx,
      DELETE_LINE.reemplazarSucesor,
      `Se reemplaza ${value} por el sucesor ${succKey}`,
      [node.id]
    );
    pushStep(ctx, DELETE_LINE.eliminarSucesor, `Eliminar ${succKey} de la hoja`, [succLeaf.id]);
    const underflow = deleteRec(node.children[childIdx], succKey, ctx);
    if (underflow) fixUnderflow(node, childIdx, ctx);
    return node.keys.length === 0;
  }

  let i = 0;
  while (i < node.keys.length && value > node.keys[i]) i++;
  pushStep(
    ctx,
    DELETE_LINE.buscar,
    `Descendiendo hacia el hijo ${i} buscando ${value}`,
    [node.id, node.children[i].id]
  );
  const underflow = deleteRec(node.children[i], value, ctx);
  if (underflow) fixUnderflow(node, i, ctx);
  return node.keys.length === 0;
}

export function deleteWithSteps(root: TreeNode | null, value: number): { root: TreeNode | null; steps: TreeStep[] } {
  const clonedRoot = cloneTree(root);
  const ctx: BuildCtx = { steps: [], treeRef: { current: clonedRoot }, operation: "delete" };

  if (!clonedRoot) {
    return { root: null, steps: [] };
  }

  pushStep(ctx, DELETE_LINE.buscar, `Buscando ${value} desde la raíz`, [clonedRoot.id]);

  if (clonedRoot.isLeaf && clonedRoot.keys.length === 1 && clonedRoot.keys[0] === value) {
    ctx.treeRef.current = null;
    pushStep(ctx, DELETE_LINE.eliminarClave, `El árbol queda vacío`, [], [], [clonedRoot.id]);
    return { root: null, steps: ctx.steps };
  }

  const underflow = deleteRec(clonedRoot, value, ctx);
  if (underflow) {
    if (clonedRoot.children.length === 1) {
      const newRoot = clonedRoot.children[0];
      ctx.treeRef.current = newRoot;
      pushStep(
        ctx,
        DELETE_LINE.corregirUnderflowPadre,
        `La raíz quedó vacía: el árbol decrece en altura`,
        [newRoot.id],
        [],
        [clonedRoot.id]
      );
      return { root: newRoot, steps: ctx.steps };
    }
    ctx.treeRef.current = null;
    pushStep(ctx, DELETE_LINE.corregirUnderflowPadre, `El árbol queda vacío`, [], [], [clonedRoot.id]);
    return { root: null, steps: ctx.steps };
  }

  return { root: clonedRoot, steps: ctx.steps };
}

export function countNodes(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + root.children.reduce((sum, c) => sum + countNodes(c), 0);
}

export function treeHeight(root: TreeNode | null): number {
  if (!root) return 0;
  if (root.isLeaf) return 1;
  return 1 + treeHeight(root.children[0]);
}
