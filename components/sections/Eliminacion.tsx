"use client";

import { useState } from "react";
import { useTree } from "@/context/TreeContext";
import { TreeCanvas } from "@/components/tree/TreeCanvas";
import { Pseudocode } from "@/components/ui/Pseudocode";
import { Button } from "@/components/ui/Button";
import { DELETE_PSEUDOCODE } from "@/lib/pseudocode";

export function Eliminacion() {
  const {
    root,
    highlightedNodes,
    newNodes,
    removedNodes,
    currentLine,
    currentOperation,
    currentDescription,
    isAnimating,
    deleteValue,
    clearTree,
  } = useTree();

  const [value, setValue] = useState("");

  const parsed = Number(value);
  const isValid = value.trim() !== "" && !Number.isNaN(parsed);

  const handleDelete = (stepByStep: boolean) => {
    if (!isValid) return;
    deleteValue(parsed, stepByStep);
    setValue("");
  };

  const activeLine = currentOperation === "delete" ? currentLine : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">Eliminación</h2>
        <p className="mt-1 text-[#8B949E]">
          Redistribución y fusión de nodos al eliminar claves
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-2 rounded-lg border border-[#30363D] bg-[#1C2128] p-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#8B949E]">Valor a eliminar</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDelete(false)}
                disabled={isAnimating}
                className="w-28 rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#E6EDF3] outline-none focus:border-[#F0A500] disabled:opacity-50"
              />
            </div>
            <Button variant="primary" disabled={!isValid || isAnimating} onClick={() => handleDelete(false)}>
              Eliminar
            </Button>
            <Button disabled={!isValid || isAnimating} onClick={() => handleDelete(true)}>
              Paso a paso
            </Button>
            <Button variant="danger" disabled={isAnimating} onClick={clearTree}>
              Limpiar
            </Button>
          </div>

          <TreeCanvas
            root={root}
            highlightedNodes={highlightedNodes}
            newNodes={newNodes}
            removedNodes={removedNodes}
            minHeight={380}
          />

          {currentDescription && (
            <div className="rounded-md border border-[#F0A500]/40 bg-[#F0A500]/10 px-4 py-2 text-sm text-[#FFD166]">
              {currentDescription}
            </div>
          )}
        </div>

        <Pseudocode lines={DELETE_PSEUDOCODE} activeLine={activeLine} title="eliminar(clave)" />
      </div>
    </div>
  );
}
