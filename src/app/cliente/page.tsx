import type { Metadata } from "next";
import { ChatCliente } from "@/components/cliente/ChatCliente";
import { MarcoTelefono } from "@/components/MarcoTelefono";

export const metadata: Metadata = {
  title: "Cliente",
  description: "El extracto semanal de Marta por WhatsApp: bajar cuota, emergencia y primera urgencia.",
};

export default function PaginaCliente() {
  return (
    <MarcoTelefono
      actual="/cliente"
      titulo="Vista del cliente"
      descripcion="Marta recibe su extracto semanal por WhatsApp. Su plata está a su nombre en el aliado; Gota a favor solo opera la ruta."
      pistas={[
        "Bajar cuota: pasa a $11.622 esta semana y la racha se mantiene.",
        "Emergencia: elige un monto pre-aprobado por la racha de 8 semanas.",
        "Al terminar: la misma cuota sigue, ahora para su ahorro.",
        "Primera urgencia: primero se mueve la fecha con quien cobra; solo el efectivo va a crédito.",
      ]}
    >
      <ChatCliente />
    </MarcoTelefono>
  );
}
