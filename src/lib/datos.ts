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
  creditosPagadosATiempo: 1,
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
  pedidos15: { activos: number; valor: number; recaudado: number; vencidos: number };
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
    pedidos15: { activos: 7, valor: 5_600_000, recaudado: 3_150_000, vencidos: 0 },
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
    pedidos15: { activos: 2, valor: 1_400_000, recaudado: 700_000, vencidos: 0 },
  },
];

/** Comisión promedio del mes por cliente activo (aliado, distribuidor, microseguro). */
export const COMISION_POR_CLIENTE = 11_212;

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
