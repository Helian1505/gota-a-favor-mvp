import type { ClientePlataforma, ClienteRuta, Pedido15, Ruta } from "./datos";
import { COMISION_POR_CLIENTE, metasPiloto, modeloMensual, pedidos15, rutas } from "./datos";
import { decimal, porcentaje } from "./formato";
import {
  avancePedido,
  botonEmergencia,
  cuotaMinima,
  economiaMes,
  estadoEfectivo,
  pagoRecaudador,
  RACHA_EMERGENCIA,
  rutaFormal,
  tarifaRecogida,
  tasaCreditoActual,
  tasaProximoSurtido,
} from "./reglas";

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
  const pedidos = resumenPedidos(pedidos15.filter((p) => sel.some((r) => r.id === p.ruta)));
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
    pedidos15: pedidos.totales,
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

// Pedidos a 15 días -----------------------------------------------------------------

export function resumenPedidos(lista: Pedido15[]) {
  const pedidos = lista.map((p) => ({
    ...p,
    avance: avancePedido(p.monto, p.recogidas, p.recogidasHechas, p.diasDesdeEntrega),
  }));
  const suma = (items: typeof pedidos) => {
    const valor = items.reduce((a, p) => a + p.monto, 0);
    const recaudado = items.reduce((a, p) => a + p.avance.recaudado, 0);
    return {
      activos: items.length,
      valor,
      recaudado,
      porPagar: valor - recaudado,
      vencidos: items.filter((p) => p.avance.vencido).length,
    };
  };
  const nombres = [...new Set(pedidos.map((p) => p.distribuidor))];
  const distribuidores = nombres
    .map((nombre) => {
      const propios = pedidos.filter((p) => p.distribuidor === nombre);
      return {
        nombre,
        ...suma(propios),
        clientes: propios.map((p) => p.cliente),
        proximoPago: Math.min(...propios.map((p) => p.avance.diasParaPago)),
      };
    })
    .sort((a, b) => b.valor - a.valor);
  return { pedidos, distribuidores, totales: suma(pedidos) };
}

// Economía del mes ------------------------------------------------------------------

/** Economía del mes de las rutas elegidas, con el modelo del documento. */
export function economiaPlataforma(sel: Ruta[]) {
  return economiaMes(sel, rutas, modeloMensual);
}

// Clientes --------------------------------------------------------------------------

export type FiltroClientes = "todos" | "credito" | "ahorro-primero" | "racha" | "minimo";

export function detalleCliente(c: ClientePlataforma) {
  const emergencia = botonEmergencia(c.rachaSemanas);
  return {
    ...c,
    emergencia,
    tasa: c.credito ? tasaCreditoActual(c.credito.tipo, c.creditosSurtidoPagados) : null,
    cuotaMinima: c.credito ? cuotaMinima(c.credito.cuota) : null,
    tasaProximo: tasaProximoSurtido(c.creditosSurtidoPagados, c.credito?.tipo === "surtido"),
    ahorroPrimero: c.reportado && !c.credito,
    semanasParaEvaluacion: Math.max(0, RACHA_EMERGENCIA - c.rachaSemanas),
  };
}

export function filtrarClientes(lista: ClientePlataforma[], filtro: FiltroClientes, busqueda = "") {
  const q = busqueda
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
  const sinTildes = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return lista.filter((c) => {
    if (q && !sinTildes(`${c.nombre} ${c.negocio}`).includes(q)) return false;
    if (filtro === "credito") return c.credito !== null;
    if (filtro === "ahorro-primero") return c.reportado && !c.credito;
    if (filtro === "racha") return c.rachaSemanas >= RACHA_EMERGENCIA;
    if (filtro === "minimo") return c.pidioMinimo;
    return true;
  });
}
