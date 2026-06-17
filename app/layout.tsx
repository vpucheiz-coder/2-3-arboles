import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TreeProvider } from "@/context/TreeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Árbol 2-3 — Herramienta interactiva",
  description: "Herramienta de estudio del Árbol 2-3 para Estructuras de Datos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0D1117] text-[#E6EDF3]">
        <TreeProvider>{children}</TreeProvider>
      </body>
    </html>
  );
}
