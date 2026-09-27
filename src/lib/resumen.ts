import type { ClienteRuta, Ruta } from "./datos";
import { COMISION_POR_CLIENTE, metasPiloto } from "./datos";
import { decimal, porcentaje } from "./formato";
import { cuotaMinima, estadoEfectivo, pagoRecaudador, rutaFormal, tarifaRecogida } from "./reglas";

// Ruta del recaudador ------------------------------------------------------------

export type Registro = "ok" | "min";

export interface VisitaCalculada {
  cliente: ClienteRuta;
  registro?: Registro;
  cuotaCobrada: number;
  tarifa: number;
  /** Lo que entra al efectivo en mano: cuota + ahorro + tarifa. */
  totalVisita: number;
  pago: number;
}

export function calcularVisita(cliente: ClienteRuta, registro?: Registro): VisitaCalculada {
  const cuotaCobrada = registro === "min" ? cuotaMinima(cliente.cuota) : cliente.cuota;
  const tarifa = tarifaRecogida(cliente.ahorro);
  return {
    cliente,
    registro,
    cuotaCobrada,
    tarifa,
    totalVisita: cuotaCobrada + cliente.ahorro + tarifa,
    pago: pagoRecaudador({ tarifa, cuotaRecogida: cuotaCobrada }),
  };
}

export function resumenRuta(
  clientes: ClienteRuta[],
  registros: Partial<Record<number, Registro>>,
  consignado: number,
) {
  const visitas = clientes.map((c) => calcularVisita(c, registros[c.id]));
  const hechas = visitas.filter((v) => v.registro);
  const recogido = hechas.reduce((a, v) => a + v.totalVisita, 0);
  const pagoHoy = hechas.reduce((a, v) => a + v.pago, 0);
  const enMano = Math.max(0, recogido - consignado);
  return {
    visitas,
    hechas: hechas.length,
    total: clientes.length,
    recogido,
    pagoHoy,
    enMano,
    efectivo: estadoEfectivo(enMano),
  };
}

// Tablero de la plataforma ---------------------------------------------------------

const ponderado = (sel: Ruta[], valor: (r: Ruta) => number, peso: (r: Ruta) => number) => {
  const total = sel.reduce((a, r) => a + peso(r), 0);
  return total ? sel.reduce((a, r) => a + valor(r) * peso(r), 0) / total : 0;
};

export function resumenPlataforma(sel: Ruta[]) {
  const sum = (f: (r: Ruta) => number) => sel.reduce((a, r) => a + f(r), 0);
  const clientes = sum((r) => r.clientes);
  const pagaRecogida = ponderado(sel, (r) => r.pagaRecogida, (r) => r.clientes);
  const impago = ponderado(sel, (r) => r.impagoCredito1, (r) => r.creditos1);
  const minutos = ponderado(sel, (r) => r.minutosVisita, (r) => r.clientes);
  const pedidos15 = {
    activos: sum((r) => r.pedidos15.activos),
    valor: sum((r) => r.pedidos15.valor),
    recaudado: sum((r) => r.pedidos15.recaudado),
    vencidos: sum((r) => r.pedidos15.vencidos),
  };
  return {
    clientes,
    ahorro: sum((r) => r.ahorro),
    cartera: sum((r) => r.cartera),
    pagaRecogida,
    racha8: sum((r) => r.racha8),
    impago,
    minutos,
    comisiones: clientes * COMISION_POR_CLIENTE,
    pedidosSurtido: sum((r) => r.pedidosSurtido),
    capitalTrabajo: sum((r) => r.capitalTrabajo),
    pedidos15: { ...pedidos15, porPagar: pedidos15.valor - pedidos15.recaudado },
    filas: sel.map((r) => ({ ...r, formal: rutaFormal(r.clientes) })),
    compuertas: [
      { label: `Clientes activos ≥ ${metasPiloto.clientes}`, ok: clientes >= metasPiloto.clientes, valor: String(clientes) },
      { label: "Pagan la recogida ≥ 50%", ok: pagaRecogida >= metasPiloto.pagaRecogida, valor: porcentaje(pagaRecogida) },
      { label: "Impago del crédito 1 ≤ 10%", ok: impago <= metasPiloto.impagoMax, valor: porcentaje(impago) },
      { label: "Minutos por visita ≤ 7", ok: minutos <= metasPiloto.minutosMax, valor: decimal(minutos) },
      { label: "Contrato con el aliado", ok: metasPiloto.contratoAliado, valor: "firmado" },
    ],
  };
}
