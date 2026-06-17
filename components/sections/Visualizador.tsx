"use client";

import { useState } from "react";
import { useTree } from "@/context/TreeContext";
import { TreeCanvas } from "@/components/tree/TreeCanvas";
import { Pseudocode } from "@/components/ui/Pseudocode";
import { Button } from "@/components/ui/Button";
import { HistoryPanel } from "@/components/ui/HistoryPanel";
import { DELETE_PSEUDOCODE, INSERT_PSEUDOCODE } from "@/lib/pseudocode";

export function Visualizador() {
  const {
    root,
    highlightedNodes,
    newNodes,
    removedNodes,
    currentLine,
    currentOperation,
    currentDescription,
    history,
    isAnimating,
    insertValue,
    deleteValue,
    loadExample,
    clearTree,
  } = useTree();

  const [insertVal, setInsertVal] = useState("");
  const [deleteVal, setDeleteVal] = useState("");
  const [stepByStep, setStepByStep] = useState(true);
  const [showDepth, setShowDepth] = useState(false);

  const doInsert = () => {
    const n = Number(insertVal);
    if (insertVal.trim() === "" || Number.isNaN(n)) return;
    insertValue(n, stepByStep);
    setInsertVal("");
  };

  const doDelete = () => {
    const n = Number(deleteVal);
    if (deleteVal.trim() === "" || Number.isNaN(n)) return;
    deleteValue(n, stepByStep);
    setDeleteVal("");
  };

  const pseudocode = currentOperation === "delete" ? DELETE_PSEUDOCODE : INSERT_PSEUDOCODE;
  const pseudoTitle = currentOperation === "delete" ? "eliminar(clave)" : "insertar(clave)";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-foreground">Visualizador</h2>
        <p className="mt-1 text-secondary">
          Sandbox libre — combina inserciones y eliminaciones
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr_260px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-edge bg-card p-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary">Insertar</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doInsert()}
                  disabled={isAnimating}
                  className="w-full rounded-md border border-edge bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent disabled:opacity-50"
                />
                <Button variant="primary" disabled={isAnimating} onClick={doInsert}>
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary">Eliminar</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={deleteVal}
                  onChange={(e) => setDeleteVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doDelete()}
                  disabled={isAnimating}
                  className="w-full rounded-md border border-edge bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent disabled:opacity-50"
                />
                <Button variant="danger" disabled={isAnimating} onClick={doDelete}>
                  −
                </Button>
              </div>
            </div>

            <label className="flex items-center justify-between text-sm text-foreground">
              Modo paso a paso
              <input
                type="checkbox"
                checked={stepByStep}
                onChange={(e) => setStepByStep(e.target.checked)}
                className="accent-(--color-accent)"
              />
            </label>
            <label className="flex items-center justify-between text-sm text-foreground">
              Mostrar nivel de nodos
              <input
                type="checkbox"
                checked={showDepth}
                onChange={(e) => setShowDepth(e.target.checked)}
                className="accent-(--color-accent)"
              />
            </label>

            <div className="flex gap-2 pt-1">
              <Button disabled={isAnimating} onClick={() => loadExample()}>
                Ejemplo
              </Button>
              <Button variant="danger" disabled={isAnimating} onClick={clearTree}>
                Limpiar
              </Button>
            </div>
          </div>

          {currentDescription && (
            <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent-light">
              {currentDescription}
            </div>
          )}
        </div>

        <TreeCanvas
          root={root}
          highlightedNodes={highlightedNodes}
          newNodes={newNodes}
          removedNodes={removedNodes}
          showDepth={showDepth}
          minHeight={460}
        />

        <HistoryPanel history={history} />
      </div>

      <Pseudocode lines={pseudocode} activeLine={currentLine} title={pseudoTitle} />
    </div>
  );
}
