import type { Metadata } from "next";
import { Tablero } from "@/components/plataforma/Tablero";

export const metadata: Metadata = {
  title: "Plataforma",
  description: "Tablero interno del piloto: rutas, referentes, compuertas, comisiones y alertas.",
};

export default function PaginaPlataforma() {
  return <Tablero />;
}
