import type { Metadata } from "next";
import { Aliado } from "@/components/plataforma/Aliado";

export const metadata: Metadata = {
  title: "Aliado y comisiones · Plataforma",
  description: "Qué hace el aliado, comisiones del mes, economía de la operación y tasas.",
};

export default function PaginaAliado() {
  return <Aliado />;
}
