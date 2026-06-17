"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) ?? "dark";
}

export function ThemeToggle() {
  // Server and first client render must agree ("dark") to avoid a hydration
  // mismatch; the real theme (set by the blocking script in <head>) is
  // picked up right after mount.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the DOM attribute set by the pre-hydration theme script; can't be known during SSR.
    setTheme(getStoredTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-edge bg-card text-base transition-colors hover:bg-accent/10"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
