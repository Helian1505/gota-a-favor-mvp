import type { Metadata } from "next";
import { Distribuidores } from "@/components/plataforma/Distribuidores";

export const metadata: Metadata = {
  title: "Distribuidores · Plataforma",
  description: "Pedidos a 15 días con distribuidores: recogidas por visita y pago el día 15.",
};

export default function PaginaDistribuidores() {
  return <Distribuidores />;
}
