import { describe, expect, it } from "vitest";
import { clientesPlataforma, clientesRuta, pedidos15, rutas } from "./datos";
import { porcentaje } from "./formato";
import {
  detalleCliente,
  economiaPlataforma,
  filtrarClientes,
  resumenPedidos,
  resumenPlataforma,
  resumenRuta,
} from "./resumen";

describe("resumenRuta", () => {
  it("empieza en cero", () => {
    const r = resumenRuta(clientesRuta, {}, 0);
    expect(r.hechas).toBe(0);
    expect(r.recogido).toBe(0);
    expect(r.efectivo.alerta).toBe(false);
  });

  it("registrar a Marta suma cuota, ahorro y tarifa, y paga $900 + comisión", () => {
    const r = resumenRuta(clientesRuta, { 1: "ok" }, 0);
    expect(r.recogido).toBe(23_245 + 24_000 + 1_500);
    expect(r.pagoHoy).toBeCloseTo(900 + 23_245 * 0.0045, 6);
  });

  it("el mínimo cobra la mitad de la cuota", () => {
    const r = resumenRuta(clientesRuta, { 5: "min" }, 0);
    expect(r.recogido).toBe(11_622);
    expect(r.pagoHoy).toBeCloseTo(11_622 * 0.0045, 6);
  });

  it("las seis visitas de la referencia disparan la alerta de efectivo", () => {
    const r = resumenRuta(clientesRuta, { 1: "ok", 2: "ok", 3: "ok", 4: "ok", 5: "ok", 6: "ok" }, 0);
    expect(r.recogido).toBe(313_174);
    expect(r.efectivo.alerta).toBe(true);
    expect(r.efectivo.dorada).toBe(true);
  });

  it("consignar descuenta el efectivo en mano pero no lo recogido", () => {
    const r = resumenRuta(clientesRuta, { 1: "ok", 2: "ok" }, 50_000);
    expect(r.enMano).toBe(r.recogido - 50_000);
  });
});

describe("resumenPlataforma", () => {
  it("todas las rutas cuadran con la referencia", () => {
    const t = resumenPlataforma(rutas);
    expect(t.clientes).toBe(145);
    expect(t.ahorro).toBe(19_400_000);
    expect(t.cartera).toBe(12_100_000);
    expect(Math.round(t.pagaRecogida * 100)).toBe(59);
    expect(t.racha8).toBe(41);
    expect(t.compuertas.every((g) => g.ok)).toBe(true);
    expect(t.compuertas.map((g) => g.valor)).toEqual(["145", "59%", "8%", "6,4", "firmado"]);
  });

  it("filtrar por Ruta 2 recalcula todo y marca las compuertas que no cumple", () => {
    const t = resumenPlataforma(rutas.filter((r) => r.id === "r2"));
    expect(t.clientes).toBe(28);
    expect(t.compuertas[0].ok).toBe(false);
    expect(t.compuertas[3].ok).toBe(false);
    expect(t.pedidos15.porPagar).toBe(700_000);
  });
});

describe("secciones de la plataforma", () => {
  it("los pedidos a 15 días cuadran por ruta y ninguno está vencido", () => {
    const todos = resumenPedidos(pedidos15);
    expect(todos.totales).toMatchObject({ activos: 9, valor: 7_000_000, recaudado: 3_850_000, vencidos: 0 });
    const r1 = resumenPlataforma(rutas.filter((r) => r.id === "r1"));
    expect(r1.pedidos15).toMatchObject({ activos: 7, valor: 5_600_000, recaudado: 3_150_000, porPagar: 2_450_000 });
    const valle = todos.distribuidores.find((d) => d.nombre === "Distribuidora del Valle");
    expect(valle?.activos).toBe(3);
  });

  it("la economía del mes coincide con el documento (mes 7, 145 clientes)", () => {
    const e = economiaPlataforma(rutas);
    const r = Math.round;
    expect(e.totalComisiones).toBe(598_995);
    expect(e.comisiones.map((c) => c.total)).toEqual([392_370, 97_875, 108_750]);
    expect(e.comisiones.map((c) => porcentaje(c.total / e.totalComisiones))).toEqual(["66%", "16%", "18%"]);
    expect(e.visitasConTarifa).toBe(739);
    expect(e.tarifas).toBe(1_108_500);
    expect(e.devolucionImpago).toBe(14_065);
    expect(r(e.pagoRecaudadores)).toBe(717_563);
    expect(e.plataforma).toBe(139_345);
    expect(r(e.contribucion)).toBe(836_522);
    expect(e.costosFijos).toBe(8_666_394);
    expect(e.bonosNuevos).toBe(772_500);
    expect(r(e.flujo / 100_000) * 100_000).toBe(-8_600_000);
  });

  it("por ruta: visitas, cuotas recogidas y pago del recaudador", () => {
    const [r1, r2] = economiaPlataforma(rutas).porRuta;
    expect([r1.visitasConTarifa, r1.cuotasRecogidas, Math.round(r1.pagoRecaudador)]).toEqual([590, 9_407_141, 573_332]);
    expect([r2.visitasConTarifa, r2.cuotasRecogidas, Math.round(r2.pagoRecaudador)]).toEqual([149, 2_251_282, 144_231]);
  });

  it("las pestañas recalculan la economía de cada ruta", () => {
    const soloR2 = economiaPlataforma(rutas.filter((x) => x.id === "r2"));
    expect(soloR2.totalComisiones).toBe(28 * 4_131);
    expect(Math.round(soloR2.pagoRecaudadores)).toBe(144_231);
    expect(soloR2.costosFijos).toBeCloseTo((8_666_394 * 28) / 145, 6);
  });

  it("comisiones del mes en el tablero: $598.995", () => {
    expect(resumenPlataforma(rutas).comisiones).toBe(598_995);
  });

  it("el detalle del cliente aplica tasas, mínimo y emergencia", () => {
    const marta = detalleCliente(clientesPlataforma[0]);
    expect(marta.tasa).toBe(0.04);
    expect(marta.cuotaMinima).toBe(11_622);
    expect(marta.tasaProximo).toBe(0.05);
    const fruver = detalleCliente(clientesPlataforma[3]);
    expect(fruver.tasa).toBe(0.04);
    expect(marta.emergencia.habilitado).toBe(true);
    const luz = detalleCliente(clientesPlataforma[2]);
    expect(luz.ahorroPrimero).toBe(true);
    expect(luz.semanasParaEvaluacion).toBe(3);
  });

  it("filtra clientes por tipo y por nombre sin importar tildes", () => {
    expect(filtrarClientes(clientesPlataforma, "minimo").map((c) => c.nombre)).toEqual(["Yesenia", "Arepas Doña Nelly"]);
    expect(filtrarClientes(clientesPlataforma, "todos", "oscar")).toHaveLength(1);
    expect(filtrarClientes(clientesPlataforma, "racha").every((c) => c.rachaSemanas >= 8)).toBe(true);
  });
});
