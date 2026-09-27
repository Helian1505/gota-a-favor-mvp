import type { ModeloMensual } from "./reglas";

/**
 * Datos de ejemplo del prototipo. Escenario: mes 7, fin del piloto en Cali.
 * Nombres, cuotas y ahorros copiados de la referencia de diseño.
 */

// Cliente (chat) ---------------------------------------------------------------

export const clienteDemo = {
  nombre: "Marta",
  rachaSemanas: 8,
  reportado: false,
  ahorroLibre: 156_649,
  ahorroTasaEA: 0.03,
  bolsilloArriendo: 48_000,
  metaArriendo: 96_000,
  diaMetaArriendo: 30,
  saldoCredito: 34_867,
  cuota: 23_245,
  semanasHastaElFinal: 2,
  /** Créditos de surtido pagados a tiempo (el del día 1 no cuenta). */
  creditosSurtidoPagados: 0,
  arriendoEjemplo: { monto: 400_000, diaVence: 30, abonos: 4 },
  semanasProyeccion: 12,
  proximaRecogida: "jueves, 10:00–12:00",
  pedidoEjemplo: { monto: 1_000_000, recogidas: 4 },
};

// Recaudador ---------------------------------------------------------------------

export interface ClienteRuta {
  id: number;
  nombre: string;
  negocio: string;
  cuota: number;
  ahorro: number;
  /** Visita de pedido a 15 días con el distribuidor. */
  pedido?: { cuotaNumero: number; totalCuotas: number; distribuidor: string };
}

export const rutaDemo = {
  franja: "10:00–12:00",
  nombre: "Barrio piloto · Ruta 1",
};

export const clientesRuta: ClienteRuta[] = [
  { id: 1, nombre: "Marta", negocio: "Peluquería · no reportada", cuota: 23_245, ahorro: 24_000 },
  { id: 2, nombre: "Don Jairo", negocio: "Taller de motos", cuota: 41_579, ahorro: 30_000 },
  { id: 3, nombre: "Luz Dary", negocio: "Modistería · ahorro primero", cuota: 0, ahorro: 21_000 },
  { id: 4, nombre: "Fruver La 12", negocio: "Fruver · crédito de surtido", cuota: 66_526, ahorro: 36_000 },
  { id: 5, nombre: "Yesenia", negocio: "Uñas · solo cuota", cuota: 23_245, ahorro: 0 },
  { id: 6, nombre: "Perfumes Ana", negocio: "Perfumería · deposita por Nequi", cuota: 41_579, ahorro: 0 },
  {
    id: 7,
    nombre: "Tienda Doña Rubiela",
    negocio: "Tienda de barrio · surtido de abarrotes",
    cuota: 250_000,
    ahorro: 0,
    pedido: { cuotaNumero: 2, totalCuotas: 4, distribuidor: "Distribuidora del Valle" },
  },
];

// Plataforma ---------------------------------------------------------------------

export interface Ruta {
  id: "r1" | "r2";
  ruta: string;
  referente: string;
  recaudador: string;
  clientes: number;
  pagaRecogida: number;
  creditos1: number;
  impagoCredito1: number;
  minutosVisita: number;
  ahorro: number;
  cartera: number;
  racha8: number;
  pedidosSurtido: number;
  capitalTrabajo: number;
  franja: string;
  /** Clientes que entraron este mes (bono de referido y kit). */
  clientesNuevosMes: number;
}

export const rutas: Ruta[] = [
  {
    id: "r1",
    ruta: "Ruta 1 · barrio piloto",
    referente: "Referente: tendera de la cuadra",
    recaudador: "Vecina, medio tiempo",
    clientes: 117,
    pagaRecogida: 0.58,
    creditos1: 62,
    impagoCredito1: 0.08,
    minutosVisita: 6.2,
    ahorro: 17_500_000,
    cartera: 10_500_000,
    racha8: 41,
    pedidosSurtido: 9,
    capitalTrabajo: 1_200_000,
    franja: "lunes a sábado · 10:00–12:00",
    clientesNuevosMes: 22,
  },
  {
    id: "r2",
    ruta: "Ruta 2 · barrio vecino",
    referente: "Referente: líder de la JAC",
    recaudador: "Vecino, medio tiempo",
    clientes: 28,
    pagaRecogida: 0.61,
    creditos1: 4,
    impagoCredito1: 0,
    minutosVisita: 7.2,
    ahorro: 1_900_000,
    cartera: 1_600_000,
    racha8: 0,
    pedidosSurtido: 2,
    capitalTrabajo: 1_200_000,
    franja: "martes, jueves y sábado · 15:00–17:00",
    clientesNuevosMes: 8,
  },
];

/**
 * Modelo económico del documento entregado (mes 7, 145 clientes): valores por
 * cliente activo al mes y costos del piloto.
 */
export const modeloMensual: ModeloMensual = {
  comisionesPorCliente: [
    { fuente: "Aliado", detalle: "originación 2% + recaudo 1,5%", valor: 2_706 },
    { fuente: "Distribuidor", detalle: "1,5% de los pedidos", valor: 675 },
    { fuente: "Microseguro y facturas", detalle: "microseguro y pago de facturas", valor: 750 },
  ],
  /** Cuotas recogidas por cliente al mes ($80.403 redondeado). */
  cuotasPorCliente: 80_402.917,
  /** Impago: devolución de la originación al aliado. */
  devolucionImpagoPorCliente: 97,
  /** Tienda-punto, WhatsApp y nube. */
  plataformaPorCliente: 961,
  costosFijosPiloto: 8_666_394,
  /** Bono de referido y kit por cliente nuevo. */
  costoPorClienteNuevo: 25_750,
};

/** Mes del modelo en que el flujo mensual se vuelve positivo. */
export const MES_FLUJO_POSITIVO = 27;

/** Comisión del mes por cliente activo (aliado, distribuidor, microseguro y facturas). */
export const COMISION_POR_CLIENTE = modeloMensual.comisionesPorCliente.reduce((a, c) => a + c.valor, 0);

export const metasPiloto = {
  clientes: 70,
  pagaRecogida: 0.5,
  impagoMax: 0.1,
  minutosMax: 7,
  contratoAliado: true,
};

export const alertas: { ruta: Ruta["id"]; texto: string }[] = [
  {
    ruta: "r1",
    texto:
      "Ruta 1: 3 clientes pidieron el mínimo dos semanas seguidas. Llamada del coordinador; nunca cobro presencial con presión.",
  },
  {
    ruta: "r1",
    texto:
      "Ruta 1 va en 117 de 400 clientes: cuando llegue, el recaudador pasa a contrato laboral de tiempo completo.",
  },
  {
    ruta: "r1",
    texto:
      "6 clientes reportados cumplen 8 semanas de ahorro: enviar su historial al aliado para evaluar crédito.",
  },
  {
    ruta: "r2",
    texto:
      "Ruta 2 va en 7,2 minutos por visita: revisar el orden del recorrido con el referente de la JAC.",
  },
];

// Clientes (muestra) -------------------------------------------------------------

export interface CreditoCliente {
  tipo: "dia1" | "surtido";
  saldo: number;
  cuota: number;
}

export interface ClientePlataforma {
  id: number;
  nombre: string;
  negocio: string;
  ruta: Ruta["id"];
  rachaSemanas: number;
  ahorro: number;
  reportado: boolean;
  /** Créditos de surtido pagados a tiempo (el del día 1 no cuenta). */
  creditosSurtidoPagados: number;
  credito: CreditoCliente | null;
  pidioMinimo: boolean;
  canal: "Recogida a domicilio" | "Tienda-punto" | "Nequi";
}

const dia1 = (saldo: number): CreditoCliente => ({ tipo: "dia1", saldo, cuota: 23_245 });
const surtido = (saldo: number, cuota: number): CreditoCliente => ({ tipo: "surtido", saldo, cuota });

export const clientesPlataforma: ClientePlataforma[] = [
  { id: 1, nombre: "Marta", negocio: "Peluquería", ruta: "r1", rachaSemanas: 8, ahorro: 204_649, reportado: false, creditosSurtidoPagados: 0, credito: dia1(34_867), pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 2, nombre: "Don Jairo", negocio: "Taller de motos", ruta: "r1", rachaSemanas: 11, ahorro: 312_000, reportado: false, creditosSurtidoPagados: 1, credito: surtido(498_000, 41_579), pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 3, nombre: "Luz Dary", negocio: "Modistería", ruta: "r1", rachaSemanas: 5, ahorro: 96_000, reportado: true, creditosSurtidoPagados: 0, credito: null, pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 4, nombre: "Fruver La 12", negocio: "Fruver", ruta: "r1", rachaSemanas: 14, ahorro: 420_000, reportado: false, creditosSurtidoPagados: 2, credito: surtido(780_000, 66_526), pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 5, nombre: "Yesenia", negocio: "Uñas", ruta: "r1", rachaSemanas: 6, ahorro: 0, reportado: false, creditosSurtidoPagados: 0, credito: dia1(58_000), pidioMinimo: true, canal: "Tienda-punto" },
  { id: 6, nombre: "Perfumes Ana", negocio: "Perfumería", ruta: "r1", rachaSemanas: 9, ahorro: 188_000, reportado: false, creditosSurtidoPagados: 1, credito: surtido(410_000, 41_579), pidioMinimo: false, canal: "Nequi" },
  { id: 7, nombre: "Tienda Doña Rubiela", negocio: "Tienda de barrio", ruta: "r1", rachaSemanas: 12, ahorro: 265_000, reportado: false, creditosSurtidoPagados: 0, credito: null, pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 8, nombre: "Panadería El Trigal", negocio: "Panadería", ruta: "r1", rachaSemanas: 10, ahorro: 230_000, reportado: false, creditosSurtidoPagados: 1, credito: surtido(350_000, 33_000), pidioMinimo: false, canal: "Tienda-punto" },
  { id: 9, nombre: "Minimercado Los Paisas", negocio: "Minimercado", ruta: "r1", rachaSemanas: 8, ahorro: 175_000, reportado: true, creditosSurtidoPagados: 0, credito: null, pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 10, nombre: "Cacharrería La Esquina", negocio: "Cacharrería", ruta: "r2", rachaSemanas: 6, ahorro: 64_000, reportado: false, creditosSurtidoPagados: 0, credito: dia1(120_000), pidioMinimo: false, canal: "Recogida a domicilio" },
  { id: 11, nombre: "Tienda Don Óscar", negocio: "Tienda de barrio", ruta: "r2", rachaSemanas: 4, ahorro: 38_000, reportado: true, creditosSurtidoPagados: 0, credito: null, pidioMinimo: false, canal: "Nequi" },
  { id: 12, nombre: "Arepas Doña Nelly", negocio: "Venta de arepas", ruta: "r2", rachaSemanas: 7, ahorro: 71_000, reportado: false, creditosSurtidoPagados: 0, credito: dia1(150_000), pidioMinimo: true, canal: "Recogida a domicilio" },
];

// Pedidos a 15 días con distribuidores ---------------------------------------------

export interface Pedido15 {
  id: number;
  cliente: string;
  distribuidor: string;
  ruta: Ruta["id"];
  producto: string;
  monto: number;
  recogidas: number;
  recogidasHechas: number;
  diasDesdeEntrega: number;
}

export const pedidos15: Pedido15[] = [
  { id: 1, cliente: "Tienda Doña Rubiela", distribuidor: "Distribuidora del Valle", ruta: "r1", producto: "Abarrotes", monto: 1_000_000, recogidas: 4, recogidasHechas: 1, diasDesdeEntrega: 4 },
  { id: 2, cliente: "Fruver La 12", distribuidor: "Frutas del Pacífico", ruta: "r1", producto: "Fruta y verdura", monto: 800_000, recogidas: 4, recogidasHechas: 3, diasDesdeEntrega: 12 },
  { id: 3, cliente: "Don Jairo", distribuidor: "Repuestos Motocali", ruta: "r1", producto: "Repuestos de moto", monto: 1_200_000, recogidas: 4, recogidasHechas: 2, diasDesdeEntrega: 8 },
  { id: 4, cliente: "Perfumes Ana", distribuidor: "Fragancias Andinas", ruta: "r1", producto: "Perfumes y lociones", monto: 600_000, recogidas: 4, recogidasHechas: 2, diasDesdeEntrega: 8 },
  { id: 5, cliente: "Panadería El Trigal", distribuidor: "Harinas del Sur", ruta: "r1", producto: "Harina y levadura", monto: 1_000_000, recogidas: 4, recogidasHechas: 3, diasDesdeEntrega: 12 },
  { id: 6, cliente: "Minimercado Los Paisas", distribuidor: "Distribuidora del Valle", ruta: "r1", producto: "Abarrotes", monto: 600_000, recogidas: 4, recogidasHechas: 3, diasDesdeEntrega: 12 },
  { id: 7, cliente: "Yesenia", distribuidor: "Belleza Total", ruta: "r1", producto: "Esmaltes e insumos", monto: 400_000, recogidas: 4, recogidasHechas: 2, diasDesdeEntrega: 8 },
  { id: 8, cliente: "Cacharrería La Esquina", distribuidor: "Distribuidora del Valle", ruta: "r2", producto: "Cacharro y plásticos", monto: 800_000, recogidas: 4, recogidasHechas: 2, diasDesdeEntrega: 8 },
  { id: 9, cliente: "Tienda Don Óscar", distribuidor: "Harinas del Sur", ruta: "r2", producto: "Harina y granos", monto: 600_000, recogidas: 4, recogidasHechas: 2, diasDesdeEntrega: 8 },
];
