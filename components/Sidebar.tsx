"use client";

export type SectionId =
  | "definicion"
  | "caracteristicas"
  | "casos"
  | "insercion"
  | "eliminacion"
  | "visualizador";

interface SidebarItem {
  id: SectionId;
  label: string;
  icon: string;
}

const ITEMS: SidebarItem[] = [
  { id: "definicion", label: "Definición", icon: "◆" },
  { id: "caracteristicas", label: "Características", icon: "▤" },
  { id: "casos", label: "Casos", icon: "▣" },
  { id: "insercion", label: "Inserción", icon: "➕" },
  { id: "eliminacion", label: "Eliminación", icon: "✕" },
  { id: "visualizador", label: "Visualizador", icon: "▦" },
];

interface SidebarProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[#30363D] bg-[#161B22]">
      <div className="px-5 py-6">
        <h1 className="text-base font-bold text-[#E6EDF3]">Árbol 2-3</h1>
        <p className="text-xs text-[#8B949E]">Estructuras de Datos</p>
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
                  ? "bg-[#F0A500] text-black"
                  : "text-[#E6EDF3] hover:bg-[#21262D]"
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
