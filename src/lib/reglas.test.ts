import { describe, expect, it } from "vitest";
import {
  avancePedido,
  bajarCuota,
  botonEmergencia,
  cuotaMinima,
  estadoEfectivo,
  montoEmergenciaValido,
  pagoRecaudador,
  pedidoProveedor,
  proyeccionAhorro,
  puedeRecibir,
  rutaFormal,
  rutaPrimeraUrgencia,
  abonosArriendo,
  tarifaRecogida,
  tasaProximoSurtido,
  tasaSemanalEquivalente,
  tasaSurtido,
  visitasConTarifaMes,
} from "./reglas";
import { pesos, tasa } from "./formato";

describe("tarifaRecogida", () => {
  it("cobra $1.500 si el ahorro es de $20.000 o más", () => {
    expect(tarifaRecogida(20_000)).toBe(1_500);
    expect(tarifaRecogida(36_000)).toBe(1_500);
  });

  it("no cobra si el ahorro es menor a $20.000 o no hay ahorro (la cuota nunca paga tarifa)", () => {
    expect(tarifaRecogida(19_999)).toBe(0);
    expect(tarifaRecogida(0)).toBe(0);
  });
});

describe("cuotaMinima y bajarCuota", () => {
  it("el mínimo es el 50% de la cuota y nunca redondea hacia arriba", () => {
    expect(cuotaMinima(23_245)).toBe(11_622);
    expect(cuotaMinima(41_579)).toBe(20_789);
    expect(cuotaMinima(66_526)).toBe(33_263);
  });

  it("la diferencia se corre al final con interés a la tasa semanal equivalente", () => {
    const r = bajarCuota(23_245, 4, 0.04);
    expect(r.cuotaNueva).toBe(11_622);
    expect(r.diferencia).toBe(11_623);
    const semanal = Math.pow(1.04, 12 / 52) - 1;
    expect(r.alFinal).toBe(Math.round(11_623 * Math.pow(1 + semanal, 4)));
    expect(r.alFinal).toBeGreaterThan(r.diferencia);
  });

  it("la cuota nueva nunca es mayor que la original", () => {
    for (const c of [1, 999, 23_245, 250_000]) expect(cuotaMinima(c)).toBeLessThanOrEqual(c);
  });
});

describe("tasas", () => {
  it("la tasa semanal equivalente capitaliza a la mensual en 52/12 semanas", () => {
    const s = tasaSemanalEquivalente(0.04);
    expect(Math.pow(1 + s, 52 / 12) - 1).toBeCloseTo(0.04, 10);
  });

  it("tasaSurtido: max(4, 5 − 0,5 × n) % mensual", () => {
    expect(tasaSurtido(0)).toBe(0.05);
    expect(tasaSurtido(1)).toBe(0.045);
    expect(tasaSurtido(2)).toBe(0.04);
    expect(tasaSurtido(10)).toBe(0.04);
    expect([0, 1, 2].map((n) => tasa(tasaSurtido(n)))).toEqual(["5%", "4,5%", "4%"]);
  });

  it("el crédito del día 1 no cuenta en la escalera de surtido", () => {
    expect(tasaProximoSurtido(0, false)).toBe(0.05);
    expect(tasaProximoSurtido(1, true)).toBe(0.04);
  });
});

describe("pagoRecaudador", () => {
  it("paga $900 por visita con tarifa más 0,3 × 1,5% de la cuota", () => {
    expect(pagoRecaudador({ tarifa: 1_500, cuotaRecogida: 23_245 })).toBeCloseTo(900 + 23_245 * 0.0045, 6);
  });

  it("sin tarifa solo paga la comisión de la cuota", () => {
    expect(pagoRecaudador({ tarifa: 0, cuotaRecogida: 41_579 })).toBeCloseTo(41_579 * 0.0045, 6);
    expect(pagoRecaudador({ tarifa: 0, cuotaRecogida: 0 })).toBe(0);
  });
});

describe("efectivo en mano", () => {
  it("alerta desde $300.000 y la barra es dorada al pasar el 60% del tope de $500.000", () => {
    expect(estadoEfectivo(299_999).alerta).toBe(false);
    expect(estadoEfectivo(300_000).alerta).toBe(true);
    expect(estadoEfectivo(300_000).dorada).toBe(false);
    expect(estadoEfectivo(300_001).dorada).toBe(true);
    expect(estadoEfectivo(600_000).fraccion).toBe(1);
  });

  it("no deja recibir por encima del tope", () => {
    expect(puedeRecibir(313_174, 186_826)).toBe(true);
    expect(puedeRecibir(313_174, 250_000)).toBe(false);
  });
});

describe("botonEmergencia", () => {
  it("se habilita con 8 semanas de racha", () => {
    expect(botonEmergencia(7).habilitado).toBe(false);
    expect(botonEmergencia(7).faltan).toBe(1);
    expect(botonEmergencia(8).habilitado).toBe(true);
    expect(botonEmergencia(8).montos).toEqual([150_000, 200_000, 300_000]);
  });

  it("solo acepta montos entre $150.000 y $300.000", () => {
    expect(montoEmergenciaValido(8, 149_999)).toBe(false);
    expect(montoEmergenciaValido(8, 200_000)).toBe(true);
    expect(montoEmergenciaValido(8, 300_001)).toBe(false);
    expect(montoEmergenciaValido(5, 200_000)).toBe(false);
  });
});

describe("rutaFormal", () => {
  it("una ruta pasa a contrato laboral al llegar a 400 clientes", () => {
    expect(rutaFormal(117)).toEqual({ formal: false, progreso: 117 / 400, faltan: 283 });
    expect(rutaFormal(400).formal).toBe(true);
    expect(rutaFormal(520).progreso).toBe(1);
  });
});

describe("pedidoProveedor", () => {
  it("un pedido de $1.000.000 queda en 4 recogidas de $250.000 y se paga el día 15", () => {
    const p = pedidoProveedor(1_000_000, 4);
    expect(p.cuotas).toEqual([250_000, 250_000, 250_000, 250_000]);
    expect(p.diaPagoDistribuidor).toBe(15);
  });

  it("la última cuota absorbe el redondeo y la suma es exacta", () => {
    const p = pedidoProveedor(1_000_000, 3);
    expect(p.cuotas.reduce((a, b) => a + b, 0)).toBe(1_000_000);
    expect(p.cuotas.at(-1)).toBe(333_334);
  });

  it("rechaza montos o recogidas inválidas", () => {
    expect(() => pedidoProveedor(0, 4)).toThrow();
    expect(() => pedidoProveedor(100_000, 0)).toThrow();
  });
});

describe("primera urgencia y proyección", () => {
  it("solo el efectivo puro sin reporte va a crédito", () => {
    expect(rutaPrimeraUrgencia("pedido").credito).toBe(false);
    expect(rutaPrimeraUrgencia("arriendo").credito).toBe(false);
    expect(rutaPrimeraUrgencia("efectivo", true).via).toBe("ahorro-primero");
    expect(rutaPrimeraUrgencia("efectivo", false)).toMatchObject({ credito: true, min: 150_000, max: 300_000 });
  });

  it("misma cuota por 12 semanas ≈ $279.000", () => {
    expect(pesos(proyeccionAhorro(23_245, 12))).toBe("$279.000");
  });
});

describe("formato", () => {
  it("usa el formato colombiano sin decimales", () => {
    expect(pesos(23_245)).toBe("$23.245");
    expect(pesos(1_500)).toBe("$1.500");
    expect(pesos(900)).toBe("$900");
    expect(pesos(11_622.5)).toBe("$11.623");
  });
});

describe("avancePedido", () => {
  it("suma lo recaudado en las recogidas hechas y cuenta los días para pagar", () => {
    const a = avancePedido(1_000_000, 4, 1, 4);
    expect(a.recaudado).toBe(250_000);
    expect(a.falta).toBe(750_000);
    expect(a.diasParaPago).toBe(11);
    expect(a.vencido).toBe(false);
  });

  it("queda vencido si pasa el día 15 sin completar", () => {
    expect(avancePedido(800_000, 4, 3, 16).vencido).toBe(true);
    expect(avancePedido(800_000, 4, 4, 16).vencido).toBe(false);
  });
});

describe("arriendo por abonos", () => {
  it("un arriendo de $400.000 queda en 4 abonos de $100.000, sin crédito ni interés", () => {
    const a = abonosArriendo(400_000, 4);
    expect(a.abonos).toEqual([100_000, 100_000, 100_000, 100_000]);
    expect(a.credito).toBe(false);
    expect(a.interes).toBe(0);
  });
});

describe("visitas con tarifa", () => {
  it("clientes × % que paga la recogida × 8,7 recogidas al mes", () => {
    expect(visitasConTarifaMes(117, 0.58)).toBe(590);
    expect(visitasConTarifaMes(28, 0.61)).toBe(149);
  });
});
