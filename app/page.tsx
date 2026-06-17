"use client";

import { useState } from "react";
import { Sidebar, SectionId } from "@/components/Sidebar";
import { Definicion } from "@/components/sections/Definicion";
import { Caracteristicas } from "@/components/sections/Caracteristicas";
import { Casos } from "@/components/sections/Casos";
import { Insercion } from "@/components/sections/Insercion";
import { Eliminacion } from "@/components/sections/Eliminacion";
import { Visualizador } from "@/components/sections/Visualizador";

const SECTION_COMPONENTS: Record<SectionId, () => React.JSX.Element> = {
  definicion: Definicion,
  caracteristicas: Caracteristicas,
  casos: Casos,
  insercion: Insercion,
  eliminacion: Eliminacion,
  visualizador: Visualizador,
};

export default function Home() {
  const [active, setActive] = useState<SectionId>("definicion");
  const ActiveSection = SECTION_COMPONENTS[active];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0D1117]">
      <Sidebar active={active} onSelect={setActive} />
      <main className="flex-1 overflow-y-auto p-8">
        <ActiveSection />
      </main>
    </div>
  );
}
