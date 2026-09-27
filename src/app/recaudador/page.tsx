import type { Metadata } from "next";
import { MarcoTelefono } from "@/components/MarcoTelefono";
import { RutaRecaudador } from "@/components/recaudador/RutaRecaudador";

export const metadata: Metadata = {
  title: "Recaudador",
  description: "La ruta de hoy del recaudador corresponsal: visitas, comprobantes y efectivo en mano.",
};

export default function PaginaRecaudador() {
  return (
    <MarcoTelefono
      actual="/recaudador"
      titulo="Vista del recaudador"
      descripcion="Un vecino de medio tiempo recorre la ruta como corresponsal móvil del aliado: recoge cuotas y ahorro, y envía el comprobante por WhatsApp."
      pistas={[
        "Registra visitas: cada una envía comprobante y muestra si tuvo costo.",
        "La tarifa de $1.500 solo aplica si el ahorro es de $20.000 o más; la cuota nunca paga.",
        "Tu pago: $900 por visita con tarifa, más el 30% del 1,5% de la cuota.",
        "Desde $300.000 en mano aparece el aviso de consignar; el tope es $500.000.",
        "Doña Rubiela: visita de pedido a 15 días, cuota 2 de 4 para el distribuidor.",
      ]}
    >
      <RutaRecaudador />
    </MarcoTelefono>
  );
}
