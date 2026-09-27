import { describe, expect, it } from "vitest";
import { clientesRuta, rutas } from "./datos";
import { resumenPlataforma, resumenRuta } from "./resumen";

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
