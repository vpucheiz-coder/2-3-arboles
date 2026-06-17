import type { TreeStep } from "@/lib/tree23";
import { INSERT_STAGES, DELETE_STAGES } from "@/lib/tree23";

interface StepExplainerProps {
  steps: TreeStep[];
  currentIndex: number;
  operation: "insert" | "delete" | null;
}

export function StepExplainer({ steps, currentIndex, operation }: StepExplainerProps) {
  const stages = operation === "delete" ? DELETE_STAGES : INSERT_STAGES;
  const current = steps[currentIndex];
  const currentStage = current?.stepIndex ?? -1;
  // The algorithm can revisit an earlier stage (e.g. "¿Overflow?" is checked
  // again for the parent after "Split"/"Subir al padre"), so "done" tracks
  // every stage seen so far rather than just everything before the current one.
  const visitedStages = new Set(steps.slice(0, currentIndex + 1).map((s) => s.stepIndex));

  return (
    <div className="rounded-lg border border-edge bg-card p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {stages.map((label, i) => {
          const state =
            i === currentStage ? "active" : visitedStages.has(i) ? "done" : "pending";
          return (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  state === "active"
                    ? "bg-accent text-black"
                    : state === "done"
                      ? "bg-node-nuevo text-white"
                      : "bg-edge/40 text-secondary"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs ${state === "active" ? "font-semibold text-foreground" : "text-secondary"}`}
              >
                {label}
              </span>
              {i < stages.length - 1 && <span className="mx-1 text-secondary">→</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-edge pt-3">
        {current ? (
          <>
            <h4 className="text-sm font-semibold text-foreground">
              Paso {currentIndex + 1} — {current.stepName}
            </h4>
            <p className="mt-1 text-sm leading-6 text-secondary">{current.description}</p>
          </>
        ) : (
          <p className="text-sm text-secondary">
            Inserta o elimina un valor para ver la explicación paso a paso.
          </p>
        )}
      </div>
    </div>
  );
}
