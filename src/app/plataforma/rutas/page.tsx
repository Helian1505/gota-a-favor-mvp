import type { Metadata } from "next";
import { Rutas } from "@/components/plataforma/Rutas";

export const metadata: Metadata = {
  title: "Rutas · Plataforma",
  description: "Rutas y recaudadores del piloto: indicadores, camino al empleo formal y la ruta de hoy.",
};

export default function PaginaRutas() {
  return <Rutas />;
}
