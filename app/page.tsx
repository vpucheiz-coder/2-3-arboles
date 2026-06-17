"use client";

import { useState } from "react";
import { Sidebar, SectionId } from "@/components/Sidebar";
import { Inicio } from "@/components/sections/Inicio";
import { Definicion } from "@/components/sections/Definicion";
import { Caracteristicas } from "@/components/sections/Caracteristicas";
import { Casos } from "@/components/sections/Casos";
import { Insercion } from "@/components/sections/Insercion";
import { Eliminacion } from "@/components/sections/Eliminacion";
import { Visualizador } from "@/components/sections/Visualizador";
import { Aplicaciones } from "@/components/sections/Aplicaciones";
import { Cierre } from "@/components/sections/Cierre";

const SECTION_COMPONENTS: Record<SectionId, () => React.JSX.Element> = {
  inicio: Inicio,
  definicion: Definicion,
  caracteristicas: Caracteristicas,
  casos: Casos,
  insercion: Insercion,
  eliminacion: Eliminacion,
  visualizador: Visualizador,
  aplicaciones: Aplicaciones,
  cierre: Cierre,
};

export default function Home() {
  const [active, setActive] = useState<SectionId>("inicio");
  const ActiveSection = SECTION_COMPONENTS[active];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar active={active} onSelect={setActive} />
      <main className="flex-1 overflow-y-auto p-8">
        <ActiveSection />
      </main>
    </div>
  );
}
