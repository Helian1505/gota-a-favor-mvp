import type { Metadata } from "next";
import { Clientes } from "@/components/plataforma/Clientes";

export const metadata: Metadata = {
  title: "Clientes · Plataforma",
  description: "Muestra de clientes del piloto con su ahorro, racha, crédito y botón de emergencia.",
};

export default function PaginaClientes() {
  return <Clientes />;
}
