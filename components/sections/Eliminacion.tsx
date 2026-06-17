"use client";

import { useState } from "react";
import { useTree } from "@/context/TreeContext";
import { TreeCanvas } from "@/components/tree/TreeCanvas";
import { Pseudocode } from "@/components/ui/Pseudocode";
import { Button } from "@/components/ui/Button";
import { StepExplainer } from "@/components/ui/StepExplainer";
import { DELETE_PSEUDOCODE } from "@/lib/pseudocode";
import { deleteWithSteps, search } from "@/lib/tree23";
import { useStepNavigator } from "@/lib/useStepNavigator";

export function Eliminacion() {
  const {
    root,
    highlightedNodes,
    newNodes,
    removedNodes,
    currentLine,
    currentOperation,
    currentDescription,
    lastSteps,
    isAnimating,
    deleteValue,
    clearTree,
    commitRoot,
  } = useTree();

  const [value, setValue] = useState("");
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const nav = useStepNavigator();

  const parsed = Number(value);
  const isValid = value.trim() !== "" && !Number.isNaN(parsed);
  const busy = isAnimating || nav.isStepping;

  const handleDeleteNow = () => {
    if (!isValid || busy) return;
    setError("");
    deleteValue(parsed, false);
    setValue("");
  };

  const handleStepByStep = () => {
    if (!isValid || busy) return;
    if (!search(root, parsed)) {
      setError(`La clave ${parsed} no existe en el árbol`);
      return;
    }
    setError("");
    const { steps } = deleteWithSteps(root, parsed);
    setPendingValue(parsed);
    nav.start(steps);
    setValue("");
  };

  const handleComplete = () => {
    if (!nav.isStepping || pendingValue === null) return;
    const last = nav.steps[nav.steps.length - 1];
    commitRoot(last.tree, nav.steps, `- ${pendingValue} eliminado`, "delete");
    nav.finish();
    setPendingValue(null);
  };

  const activeLine = nav.isStepping
    ? nav.current?.line ?? null
    : currentOperation === "delete"
      ? currentLine
      : null;

  const explainerSteps = nav.isStepping ? nav.steps : currentOperation === "delete" ? lastSteps : [];
  const explainerIndex = nav.isStepping ? nav.index : explainerSteps.length - 1;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-foreground">Eliminación</h2>
        <p className="mt-1 text-secondary">
          Redistribución y fusión de nodos al eliminar claves
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-2 rounded-lg border border-edge bg-card p-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary">Valor a eliminar</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDeleteNow()}
                disabled={busy}
                className="w-28 rounded-md border border-edge bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent disabled:opacity-50"
              />
            </div>
            <Button variant="primary" disabled={!isValid || busy} onClick={handleDeleteNow}>
              Eliminar
            </Button>
            <Button disabled={!isValid || busy} onClick={handleStepByStep}>
              Paso a paso
            </Button>
            <Button variant="danger" disabled={busy} onClick={clearTree}>
              Limpiar
            </Button>
          </div>

          <TreeCanvas
            root={nav.isStepping ? nav.current?.tree ?? null : root}
            highlightedNodes={nav.isStepping ? nav.current?.highlightedNodes : highlightedNodes}
            newNodes={nav.isStepping ? nav.current?.newNodes : newNodes}
            removedNodes={nav.isStepping ? nav.current?.removedNodes : removedNodes}
            minHeight={380}
          />

          {nav.isStepping && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-edge bg-card p-3">
              <button
                onClick={nav.prev}
                disabled={nav.index === 0}
                className="rounded-md border border-edge bg-background px-3 py-1.5 text-sm font-medium text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-xs text-secondary">
                Paso {nav.index + 1} de {nav.steps.length}
                {nav.current ? ` — ${nav.current.stepName}` : ""}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={nav.next}
                  disabled={nav.isLast}
                  className="rounded-md border border-edge bg-background px-3 py-1.5 text-sm font-medium text-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente →
                </button>
                <button
                  onClick={handleComplete}
                  className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-black transition"
                >
                  ⏩ Completar
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md border border-node-eliminado/40 bg-node-eliminado/10 px-4 py-2 text-sm text-node-eliminado">
              {error}
            </div>
          )}

          {!nav.isStepping && currentDescription && (
            <div className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent-light">
              {currentDescription}
            </div>
          )}

          <StepExplainer steps={explainerSteps} currentIndex={explainerIndex} operation="delete" />
        </div>

        <Pseudocode lines={DELETE_PSEUDOCODE} activeLine={activeLine} title="eliminar(clave)" />
      </div>
    </div>
  );
}
