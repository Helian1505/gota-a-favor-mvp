/**
 * Reglas de negocio de Gota a favor. Funciones puras, sin estado: la UI solo
 * las llama. Todo es de ejemplo: no se mueve plata real.
 */

// Recogida a domicilio -------------------------------------------------------

export const TARIFA_RECOGIDA = 1_500;
export const AHORRO_MINIMO_CON_TARIFA = 20_000;

/** $1.500 si el ahorro recogido es ≥ $20.000; si no, $0. La cuota nunca paga tarifa. */
export function tarifaRecogida(ahorro: number): number {
  return ahorro >= AHORRO_MINIMO_CON_TARIFA ? TARIFA_RECOGIDA : 0;
}

// Tasas ----------------------------------------------------------------------

export const TASA_CREDITO_DIA1 = 0.04;
export const TASA_SURTIDO_INICIAL = 0.05;
export const TASA_SURTIDO_PISO = 0.04;
export const BAJA_POR_CREDITO_A_TIEMPO = 0.005;

/**
 * Escalera de tasas del crédito de surtido: max(4%, 5% − 0,5 puntos × n), mensual,
 * donde n son los créditos de surtido pagados a tiempo. El crédito del día 1 no
 * cuenta. Devuelve la tasa como fracción (0,05 = 5% mensual), igual que las demás.
 */
export function tasaSurtido(creditosSurtidoPagadosATiempo: number): number {
  const pagados = Math.max(0, Math.floor(creditosSurtidoPagadosATiempo));
  const t = TASA_SURTIDO_INICIAL - pagados * BAJA_POR_CREDITO_A_TIEMPO;
  return Math.round(Math.max(TASA_SURTIDO_PISO, t) * 10_000) / 10_000;
}

/** Tasa semanal equivalente a una tasa mensual (12 meses = 52 semanas). */
export function tasaSemanalEquivalente(tasaMensual: number): number {
  return Math.pow(1 + tasaMensual, 12 / 52) - 1;
}

// Cuota que solo baja --------------------------------------------------------

/** 50% de la cuota, redondeado hacia abajo: la cuota nunca sube. */
export function cuotaMinima(cuota: number): number {
  return Math.floor(cuota / 2);
}

export interface BajarCuota {
  cuotaNueva: number;
  diferencia: number;
  /** Lo que se paga al final del plazo: la diferencia más su interés. */
  alFinal: number;
}

/**
 * Bajar la cuota al mínimo esta semana. La diferencia se corre al final del
 * plazo y causa interés a la tasa semanal equivalente a la mensual.
 */
export function bajarCuota(
  cuota: number,
  semanasHastaElFinal: number,
  tasaMensual: number = TASA_CREDITO_DIA1,
): BajarCuota {
  const cuotaNueva = cuotaMinima(cuota);
  const diferencia = cuota - cuotaNueva;
  const semanal = tasaSemanalEquivalente(tasaMensual);
  const alFinal = Math.round(diferencia * Math.pow(1 + semanal, Math.max(0, semanasHastaElFinal)));
  return { cuotaNueva, diferencia, alFinal };
}

/** Ahorro proyectado si la misma cuota sigue llegando, redondeado a miles. */
export function proyeccionAhorro(cuotaSemanal: number, semanas: number): number {
  return Math.round((cuotaSemanal * semanas) / 1_000) * 1_000;
}

// Recaudador -----------------------------------------------------------------

export const PAGO_POR_VISITA_CON_TARIFA = 900;
export const COMISION_RECAUDO = 0.015;
export const PARTE_RECAUDADOR = 0.3;

/** $900 por visita con tarifa, más 0,3 × 1,5% de la cuota recogida. */
export function pagoRecaudador(visita: { tarifa: number; cuotaRecogida: number }): number {
  const fijo = visita.tarifa > 0 ? PAGO_POR_VISITA_CON_TARIFA : 0;
  return fijo + visita.cuotaRecogida * COMISION_RECAUDO * PARTE_RECAUDADOR;
}

// Efectivo en mano -----------------------------------------------------------

export const TOPE_EFECTIVO = 500_000;
export const ALERTA_EFECTIVO = 300_000;
export const UMBRAL_BARRA_DORADA = 0.6;

export interface EstadoEfectivo {
  /** Fracción del tope, entre 0 y 1. */
  fraccion: number;
  /** La barra se vuelve dorada al pasar el 60% del tope. */
  dorada: boolean;
  /** Desde $300.000: consignar en la tienda-punto antes de seguir. */
  alerta: boolean;
  disponible: number;
}

export function estadoEfectivo(enMano: number): EstadoEfectivo {
  const fraccion = Math.min(1, Math.max(0, enMano / TOPE_EFECTIVO));
  return {
    fraccion,
    dorada: fraccion > UMBRAL_BARRA_DORADA,
    alerta: enMano >= ALERTA_EFECTIVO,
    disponible: Math.max(0, TOPE_EFECTIVO - enMano),
  };
}

/** ¿Puede recibir este monto sin pasar el tope de efectivo? */
export function puedeRecibir(enMano: number, monto: number): boolean {
  return enMano + monto <= TOPE_EFECTIVO;
}

// Botón de emergencia --------------------------------------------------------

export const RACHA_EMERGENCIA = 8;
export const EMERGENCIA_MIN = 150_000;
export const EMERGENCIA_MAX = 300_000;
export const MONTOS_EMERGENCIA = [150_000, 200_000, 300_000] as const;

/** Se habilita con 8 semanas o más de racha; montos entre $150.000 y $300.000. */
export function botonEmergencia(rachaSemanas: number) {
  const habilitado = rachaSemanas >= RACHA_EMERGENCIA;
  return {
    habilitado,
    faltan: Math.max(0, RACHA_EMERGENCIA - rachaSemanas),
    montos: habilitado ? [...MONTOS_EMERGENCIA] : [],
    tasaMensual: TASA_CREDITO_DIA1,
  };
}

export function montoEmergenciaValido(rachaSemanas: number, monto: number): boolean {
  return botonEmergencia(rachaSemanas).habilitado && monto >= EMERGENCIA_MIN && monto <= EMERGENCIA_MAX;
}

// Ruta hacia empleo formal ---------------------------------------------------

export const CLIENTES_RUTA_FORMAL = 400;

/** Una ruta pasa a contrato laboral al llegar a 400 clientes. */
export function rutaFormal(clientes: number) {
  return {
    formal: clientes >= CLIENTES_RUTA_FORMAL,
    progreso: Math.min(1, Math.max(0, clientes / CLIENTES_RUTA_FORMAL)),
    faltan: Math.max(0, CLIENTES_RUTA_FORMAL - clientes),
  };
}

// Pedido a 15 días con el distribuidor ----------------------------------------

export const DIA_PAGO_DISTRIBUIDOR = 15;

/** Divide un monto en abonos iguales; el último absorbe el redondeo. */
export function dividirEnAbonos(monto: number, abonos: number): number[] {
  if (!Number.isFinite(monto) || monto <= 0) throw new Error("El monto debe ser mayor que cero");
  if (!Number.isInteger(abonos) || abonos < 1) throw new Error("Se necesita al menos un abono");
  const base = Math.floor(monto / abonos);
  return Array.from({ length: abonos }, (_, i) => (i === abonos - 1 ? monto - base * (abonos - 1) : base));
}

/**
 * El distribuidor entrega hoy y cobra a 15 días. El pedido se divide en
 * cuotas por visita que quedan en el bolsillo del cliente en el aliado, y el
 * día 15 se le transfieren al distribuidor desde la cuenta del cliente.
 */
export function pedidoProveedor(monto: number, recogidas: number) {
  const cuotas = dividirEnAbonos(monto, recogidas);
  return {
    cuotaPorRecogida: cuotas[0],
    cuotas,
    total: monto,
    diaPagoDistribuidor: DIA_PAGO_DISTRIBUIDOR,
  };
}

/**
 * Arriendo o servicios: se acuerda con quien cobra recibir el pago por partes.
 * La ruta recoge los abonos, entran al bolsillo arriendo del cliente en el
 * aliado y se transfieren directo. Sin crédito y sin interés.
 */
export function abonosArriendo(monto: number, abonos: number) {
  const partes = dividirEnAbonos(monto, abonos);
  return { abono: partes[0], abonos: partes, total: monto, credito: false, interes: 0 } as const;
}

/** Estado de un pedido a 15 días: lo recaudado en las recogidas hechas y lo que falta. */
export function avancePedido(monto: number, recogidas: number, recogidasHechas: number, diasDesdeEntrega: number) {
  const p = pedidoProveedor(monto, recogidas);
  const hechas = Math.min(recogidas, Math.max(0, Math.floor(recogidasHechas)));
  const recaudado = p.cuotas.slice(0, hechas).reduce((a, b) => a + b, 0);
  return {
    ...p,
    hechas,
    recaudado,
    falta: monto - recaudado,
    diasParaPago: Math.max(0, DIA_PAGO_DISTRIBUIDOR - diasDesdeEntrega),
    vencido: diasDesdeEntrega > DIA_PAGO_DISTRIBUIDOR && recaudado < monto,
  };
}

/**
 * Tasa del crédito activo. El del día 1 va al 4%; uno de surtido sale a la tasa
 * que le toca por los créditos de surtido que el cliente ya pagó a tiempo.
 */
export function tasaCreditoActual(tipo: "dia1" | "surtido", creditosSurtidoPagados: number): number {
  return tipo === "dia1" ? TASA_CREDITO_DIA1 : tasaSurtido(creditosSurtidoPagados);
}

// Economía del mes ---------------------------------------------------------------

/** Recogidas que hace una ruta a cada cliente en un mes. */
export const RECOGIDAS_POR_MES = 8.7;

/** Pago del mes al recaudador: $900 por visita con tarifa + 0,3 × 1,5% de las cuotas recogidas. */
export function pagoRecaudadorMes(visitasConTarifa: number, cuotasRecogidas: number): number {
  return (
    Math.round(visitasConTarifa) * PAGO_POR_VISITA_CON_TARIFA + cuotasRecogidas * COMISION_RECAUDO * PARTE_RECAUDADOR
  );
}

/** Visitas con tarifa en el mes: clientes × % que paga la recogida × 8,7 recogidas. */
export function visitasConTarifaMes(clientes: number, pagaRecogida: number): number {
  return Math.round(clientes * pagaRecogida * RECOGIDAS_POR_MES);
}

/** Valores por cliente activo al mes y costos del piloto (ver lib/datos.ts). */
export interface ModeloMensual {
  comisionesPorCliente: readonly { fuente: string; detalle: string; valor: number }[];
  cuotasPorCliente: number;
  devolucionImpagoPorCliente: number;
  plataformaPorCliente: number;
  costosFijosPiloto: number;
  costoPorClienteNuevo: number;
}

export interface RutaEconomia {
  id: string;
  ruta: string;
  recaudador: string;
  clientes: number;
  pagaRecogida: number;
  clientesNuevosMes: number;
}

/**
 * Economía del mes para las rutas elegidas, calculada desde los valores por
 * cliente. Los costos fijos se asignan por número de clientes, así que con
 * todas las rutas se ve el costo fijo completo del piloto.
 */
export function economiaMes(sel: RutaEconomia[], todas: RutaEconomia[], m: ModeloMensual) {
  const clientes = sel.reduce((a, r) => a + r.clientes, 0);
  const clientesPiloto = todas.reduce((a, r) => a + r.clientes, 0);
  const comisiones = m.comisionesPorCliente.map((c) => ({ ...c, total: c.valor * clientes }));
  const totalComisiones = comisiones.reduce((a, c) => a + c.total, 0);
  const porRuta = sel.map((r) => {
    const visitasConTarifa = visitasConTarifaMes(r.clientes, r.pagaRecogida);
    const cuotasRecogidas = Math.round(r.clientes * m.cuotasPorCliente);
    return {
      id: r.id,
      ruta: r.ruta,
      recaudador: r.recaudador,
      visitasConTarifa,
      cuotasRecogidas,
      tarifas: visitasConTarifa * TARIFA_RECOGIDA,
      pagoRecaudador: pagoRecaudadorMes(visitasConTarifa, cuotasRecogidas),
    };
  });
  const visitasConTarifa = porRuta.reduce((a, r) => a + r.visitasConTarifa, 0);
  const tarifas = porRuta.reduce((a, r) => a + r.tarifas, 0);
  const pagoRecaudadores = porRuta.reduce((a, r) => a + r.pagoRecaudador, 0);
  const devolucionImpago = clientes * m.devolucionImpagoPorCliente;
  const plataforma = clientes * m.plataformaPorCliente;
  const contribucion = totalComisiones + tarifas - devolucionImpago - pagoRecaudadores - plataforma;
  const costosFijos = clientesPiloto ? (m.costosFijosPiloto * clientes) / clientesPiloto : 0;
  const bonosNuevos = sel.reduce((a, r) => a + r.clientesNuevosMes, 0) * m.costoPorClienteNuevo;
  return {
    clientes,
    comisiones,
    totalComisiones,
    visitasConTarifa,
    tarifas,
    devolucionImpago,
    pagoRecaudadores,
    plataforma,
    contribucion,
    costosFijos,
    bonosNuevos,
    flujo: contribucion - costosFijos - bonosNuevos,
    porRuta,
  };
}

// Primera urgencia -------------------------------------------------------------

export type Urgencia = "pedido" | "arriendo" | "efectivo";

/**
 * La primera urgencia se resuelve cambiando la fecha con quien cobra. Solo el
 * efectivo puro va a crédito, y solo si no está reportado.
 */
export function rutaPrimeraUrgencia(tipo: Urgencia, reportado = false) {
  if (tipo === "pedido") return { via: "pedido-a-15-dias", credito: false } as const;
  if (tipo === "arriendo") return { via: "pago-por-partes", credito: false } as const;
  if (reportado) return { via: "ahorro-primero", credito: false, semanasHistorial: RACHA_EMERGENCIA } as const;
  return { via: "credito-dia-1", credito: true, min: EMERGENCIA_MIN, max: EMERGENCIA_MAX, tasaMensual: TASA_CREDITO_DIA1 } as const;
}
