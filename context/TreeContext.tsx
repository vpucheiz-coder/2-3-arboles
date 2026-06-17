"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  TreeNode,
  TreeStep,
  deleteWithSteps,
  insertWithSteps,
  search,
} from "@/lib/tree23";

export interface HistoryEntry {
  id: string;
  text: string;
  type: "insert" | "delete";
}

interface TreeContextValue {
  root: TreeNode | null;
  highlightedNodes: string[];
  newNodes: string[];
  removedNodes: string[];
  currentLine: number | null;
  currentOperation: "insert" | "delete" | null;
  currentDescription: string;
  lastSteps: TreeStep[];
  history: HistoryEntry[];
  isAnimating: boolean;
  insertValue: (value: number, stepByStep: boolean) => Promise<void>;
  deleteValue: (value: number, stepByStep: boolean) => Promise<void>;
  loadExample: () => Promise<void>;
  clearTree: () => void;
  commitRoot: (
    finalRoot: TreeNode | null,
    steps: TreeStep[],
    historyText: string,
    type: "insert" | "delete"
  ) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

const STEP_DELAY = 800;
const EXAMPLE_VALUES = [5, 10, 3, 7, 15, 1, 8];

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function TreeProvider({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [newNodes, setNewNodes] = useState<string[]>([]);
  const [removedNodes, setRemovedNodes] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentOperation, setCurrentOperation] = useState<"insert" | "delete" | null>(null);
  const [currentDescription, setCurrentDescription] = useState("");
  const [lastSteps, setLastSteps] = useState<TreeStep[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const rootRef = useRef<TreeNode | null>(null);
  useEffect(() => {
    rootRef.current = root;
  }, [root]);
  const isAnimatingRef = useRef(false);

  const pushHistory = useCallback((text: string, type: "insert" | "delete") => {
    setHistory((prev) =>
      [{ id: Math.random().toString(36).slice(2), text, type }, ...prev].slice(0, 10)
    );
  }, []);

  const runSteps = useCallback(
    async (
      steps: TreeStep[],
      finalRoot: TreeNode | null,
      stepByStep: boolean,
      operation: "insert" | "delete"
    ) => {
      isAnimatingRef.current = true;
      setIsAnimating(true);
      setCurrentOperation(operation);
      setLastSteps(steps);

      if (stepByStep) {
        for (const step of steps) {
          setRoot(step.tree);
          setHighlightedNodes(step.highlightedNodes);
          setNewNodes(step.newNodes);
          setRemovedNodes(step.removedNodes);
          setCurrentLine(step.line);
          setCurrentDescription(step.description);
          await wait(STEP_DELAY);
        }
      } else {
        const last = steps[steps.length - 1];
        if (last) {
          setHighlightedNodes(last.highlightedNodes);
          setNewNodes(last.newNodes);
          setRemovedNodes(last.removedNodes);
          setCurrentLine(last.line);
          setCurrentDescription(last.description);
        }
      }

      setRoot(finalRoot);
      await wait(500);
      setHighlightedNodes([]);
      setNewNodes([]);
      setRemovedNodes([]);
      isAnimatingRef.current = false;
      setIsAnimating(false);
    },
    []
  );

  const insertValue = useCallback(
    async (value: number, stepByStep: boolean) => {
      if (isAnimatingRef.current) return;
      if (Number.isNaN(value)) return;
      if (search(rootRef.current, value)) {
        setCurrentDescription(`La clave ${value} ya existe en el árbol`);
        return;
      }
      const { root: newRoot, steps } = insertWithSteps(rootRef.current, value);
      await runSteps(steps, newRoot, stepByStep, "insert");
      pushHistory(`+ ${value} insertado`, "insert");
    },
    [runSteps, pushHistory]
  );

  const deleteValue = useCallback(
    async (value: number, stepByStep: boolean) => {
      if (isAnimatingRef.current) return;
      if (Number.isNaN(value)) return;
      if (!search(rootRef.current, value)) {
        setCurrentDescription(`La clave ${value} no existe en el árbol`);
        return;
      }
      const { root: newRoot, steps } = deleteWithSteps(rootRef.current, value);
      await runSteps(steps, newRoot, stepByStep, "delete");
      pushHistory(`- ${value} eliminado`, "delete");
    },
    [runSteps, pushHistory]
  );

  const loadExample = useCallback(async () => {
    for (const value of EXAMPLE_VALUES) {
      if (search(rootRef.current, value)) continue;
      const { root: newRoot, steps } = insertWithSteps(rootRef.current, value);
      await runSteps(steps, newRoot, false, "insert");
      pushHistory(`+ ${value} insertado`, "insert");
      await wait(250);
    }
  }, [runSteps, pushHistory]);

  const clearTree = useCallback(() => {
    setRoot(null);
    setHighlightedNodes([]);
    setNewNodes([]);
    setRemovedNodes([]);
    setCurrentLine(null);
    setCurrentDescription("");
    setCurrentOperation(null);
    setLastSteps([]);
  }, []);

  const commitRoot = useCallback(
    (
      finalRoot: TreeNode | null,
      steps: TreeStep[],
      historyText: string,
      type: "insert" | "delete"
    ) => {
      const last = steps[steps.length - 1];
      setRoot(finalRoot);
      setHighlightedNodes([]);
      setNewNodes([]);
      setRemovedNodes([]);
      setCurrentOperation(type);
      setLastSteps(steps);
      setCurrentLine(last ? last.line : null);
      setCurrentDescription(last ? last.description : "");
      pushHistory(historyText, type);
    },
    [pushHistory]
  );

  return (
    <TreeContext.Provider
      value={{
        root,
        highlightedNodes,
        newNodes,
        removedNodes,
        currentLine,
        currentOperation,
        currentDescription,
        lastSteps,
        history,
        isAnimating,
        insertValue,
        deleteValue,
        loadExample,
        clearTree,
        commitRoot,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTree() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTree debe usarse dentro de TreeProvider");
  return ctx;
}
