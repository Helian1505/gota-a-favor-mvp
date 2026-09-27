import type { Metadata } from "next";
import { Seguimiento } from "@/components/plataforma/Seguimiento";

export const metadata: Metadata = {
  title: "Plataforma",
  description: "Tablero interno del piloto: rutas, referentes, compuertas, comisiones y alertas.",
};

export default function PaginaSeguimiento() {
  return <Seguimiento />;
}
