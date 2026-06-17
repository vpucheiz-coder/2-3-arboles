"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

export type SectionId =
  | "inicio"
  | "definicion"
  | "caracteristicas"
  | "casos"
  | "insercion"
  | "eliminacion"
  | "visualizador"
  | "aplicaciones"
  | "cierre";

interface SidebarItem {
  id: SectionId;
  label: string;
  icon: string;
}

const ITEMS: SidebarItem[] = [
  { id: "inicio", label: "Inicio", icon: "★" },
  { id: "definicion", label: "Definición", icon: "◆" },
  { id: "caracteristicas", label: "Características", icon: "▤" },
  { id: "casos", label: "Casos", icon: "▣" },
  { id: "insercion", label: "Inserción", icon: "➕" },
  { id: "eliminacion", label: "Eliminación", icon: "✕" },
  { id: "visualizador", label: "Visualizador", icon: "▦" },
  { id: "aplicaciones", label: "Aplicaciones", icon: "⌬" },
  { id: "cierre", label: "Cierre", icon: "◈" },
];

interface SidebarProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-edge bg-sidebar">
      <div className="flex items-start justify-between gap-2 px-5 py-6">
        <div>
          <h1 className="text-base font-bold text-foreground">Árbol 2-3</h1>
          <p className="text-xs text-secondary">Estructuras de Datos</p>
        </div>
        <ThemeToggle />
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-black"
                  : "text-foreground hover:bg-accent/10"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
