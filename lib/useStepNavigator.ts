"use client";

import { useCallback, useState } from "react";
import type { TreeStep } from "@/lib/tree23";

export function useStepNavigator() {
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [index, setIndex] = useState(0);
  const [isStepping, setIsStepping] = useState(false);

  const start = useCallback((newSteps: TreeStep[]) => {
    setSteps(newSteps);
    setIndex(0);
    setIsStepping(true);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const finish = useCallback(() => {
    setIsStepping(false);
    setSteps([]);
    setIndex(0);
  }, []);

  return {
    steps,
    index,
    isStepping,
    current: steps[index],
    isLast: index === steps.length - 1,
    start,
    next,
    prev,
    finish,
  };
}
