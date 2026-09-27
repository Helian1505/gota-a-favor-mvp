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
export const TASA_PRODUCTIVO_INICIAL = 0.05;
export const TASA_PRODUCTIVO_PISO = 0.04;
export const BAJA_POR_CREDITO_A_TIEMPO = 0.005;

/** Créditos productivos: 5% mensual, bajan 0,5 puntos por crédito pagado a tiempo, hasta 4%. */
export function tasaCreditoProductivo(creditosPagadosATiempo: number): number {
  const pagados = Math.max(0, Math.floor(creditosPagadosATiempo));
  const t = TASA_PRODUCTIVO_INICIAL - pagados * BAJA_POR_CREDITO_A_TIEMPO;
  return Math.round(Math.max(TASA_PRODUCTIVO_PISO, t) * 10_000) / 10_000;
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

/**
 * El distribuidor entrega hoy y cobra a 15 días. El pedido se divide en
 * cuotas por visita (la última absorbe el redondeo) y se paga el día 15.
 */
export function pedidoProveedor(monto: number, recogidas: number) {
  if (!Number.isFinite(monto) || monto <= 0) throw new Error("El pedido debe ser mayor que cero");
  if (!Number.isInteger(recogidas) || recogidas < 1) throw new Error("Se necesita al menos una recogida");
  const base = Math.floor(monto / recogidas);
  const cuotas = Array.from({ length: recogidas }, (_, i) =>
    i === recogidas - 1 ? monto - base * (recogidas - 1) : base,
  );
  return {
    cuotaPorRecogida: base,
    cuotas,
    total: monto,
    diaPagoDistribuidor: DIA_PAGO_DISTRIBUIDOR,
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
