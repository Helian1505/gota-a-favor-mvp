"use client";

import { Check, X } from "lucide-react";
import { pesos, porcentaje, tasa } from "@/lib/formato";
import { economiaPlataforma, resumenPlataforma } from "@/lib/resumen";
import {
  PAGO_POR_VISITA_CON_TARIFA,
  TARIFA_RECOGIDA,
  TASA_CREDITO_DIA1,
  tasaSemanalEquivalente,
  tasaSurtido,
} from "@/lib/reglas";
import { clienteDemo, MES_FLUJO_POSITIVO } from "@/lib/datos";
import { useRutasSeleccionadas } from "./Shell";
import { Chip, EncabezadoTarjeta, Kpi, Tarjeta } from "./ui";

const colorFuente = ["bg-navy", "bg-gold", "bg-slate"] as const;

const roles = [
  {
    titulo: "El aliado (entidad vigilada)",
    tono: "si" as const,
    items: [
      "Abre la cuenta de ahorro a nombre de cada cliente",
      "Guarda el ahorro y lo remunera",
      "Presta, fija las tasas y asume el riesgo",
    ],
  },
  {
    titulo: "Gota a favor (corresponsal móvil)",
    tono: "si" as const,
    items: [
      "Opera la ruta y recoge cuotas y ahorro",
      "Envía el comprobante por WhatsApp",
      "Acuerda pagos con distribuidores y arrendadores",
    ],
  },
  {
    titulo: "Lo que Gota a favor no hace",
    tono: "no" as const,
    items: ["No presta plata propia", "No guarda el ahorro de nadie", "Nunca cobra con presión"],
  },
];

export function Aliado() {
  const sel = useRutasSeleccionadas();
  const t = resumenPlataforma(sel);
  const e = economiaPlataforma(sel);
  const flujoRedondeado = Math.round(e.flujo / 100_000) * 100_000;

  const tasas = [
    { producto: "Ahorro libre", condicion: "a nombre del cliente", valor: `${tasa(clienteDemo.ahorroTasaEA)} EA` },
    { producto: "Crédito del día 1", condicion: "$150.000 a $300.000", valor: `${tasa(TASA_CREDITO_DIA1)} mensual` },
    { producto: "Primer crédito de surtido", condicion: "el del día 1 no cuenta", valor: `${tasa(tasaSurtido(0))} mensual` },
    { producto: "Surtido, tras 1 a tiempo", condicion: "baja 0,5 puntos", valor: `${tasa(tasaSurtido(1))} mensual` },
    { producto: "Surtido, tras 2 o más", condicion: "piso de la tasa", valor: `${tasa(tasaSurtido(2))} mensual` },
    {
      producto: "Bajar cuota",
      condicion: "diferencia al final con interés",
      valor: `${tasa(tasaSemanalEquivalente(TASA_CREDITO_DIA1))} semanal`,
    },
  ];

  return (
    <>
      <section aria-label="Indicadores del aliado" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Ahorro a nombre de clientes" valor={pesos(t.ahorro)} sub="en el aliado vigilado" />
        <Kpi label="Cartera del aliado" valor={pesos(t.cartera)} sub="riesgo del aliado" />
        <Kpi label="Impago del crédito 1" valor={porcentaje(t.impago)} sub="compuerta: 10% o menos" />
        <Kpi label="Cuentas abiertas" valor={String(t.clientes)} sub="una por cliente activo" />
      </section>

      <Tarjeta>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold">Quién hace qué</h2>
          <Chip tono="ok">Contrato con el aliado firmado</Chip>
        </div>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.titulo} className="flex flex-col gap-2 rounded-[10px] bg-ivory px-3 py-3">
              <h3 className="text-[13px] font-semibold">{r.titulo}</h3>
              <ul className="flex flex-col gap-1.5">
                {r.items.map((i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-slate">
                    {r.tono === "si" ? (
                      <Check size={15} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-ok-ink" />
                    ) : (
                      <X size={15} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-bordeaux" />
                    )}
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Tarjeta>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <Tarjeta>
          <EncabezadoTarjeta titulo="Comisiones del mes" nota={`${t.clientes} clientes activos`} />
          <p className="font-mono text-[22px] font-medium tracking-tight">{pesos(e.totalComisiones)}</p>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-divider" aria-hidden>
            {e.comisiones.map((c, i) => (
              <div
                key={c.fuente}
                className={colorFuente[i]}
                style={{ width: `${(c.total / (e.totalComisiones || 1)) * 100}%` }}
              />
            ))}
          </div>
          <ul className="flex flex-col divide-y divide-divider">
            {e.comisiones.map((c, i) => (
              <li key={c.fuente} className="flex items-center justify-between gap-3 py-2 text-[13px]">
                <span className="flex items-start gap-2.5">
                  <span aria-hidden className={`mt-1 size-2.5 shrink-0 rounded-sm ${colorFuente[i]}`} />
                  <span className="flex flex-col">
                    <span className="font-semibold">{c.fuente}</span>
                    <span className="text-xs text-muted">
                      {c.detalle} · {pesos(c.valor)} por cliente
                    </span>
                  </span>
                </span>
                <span className="flex flex-col items-end">
                  <span className="font-mono">{pesos(c.total)}</span>
                  <span className="text-xs text-muted">{porcentaje(c.total / (e.totalComisiones || 1))}</span>
                </span>
              </li>
            ))}
          </ul>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta titulo="Economía de la operación" nota="estimado del mes" />
          <dl className="flex flex-col gap-2 text-[13px]">
            <FilaMonto etiqueta="Comisiones" valor={e.totalComisiones} />
            <FilaMonto
              etiqueta={`Tarifas de recogida (${e.visitasConTarifa} visitas × ${pesos(TARIFA_RECOGIDA)})`}
              valor={e.tarifas}
            />
            <FilaMonto etiqueta="Impago: devolución de la originación" valor={-e.devolucionImpago} />
            <FilaMonto etiqueta="Pago a recaudadores" valor={-e.pagoRecaudadores} />
            <FilaMonto etiqueta="Tienda-punto, WhatsApp y nube" valor={-e.plataforma} />
            <FilaTotal etiqueta="Contribución de la operación" valor={pesos(e.contribucion)} />
            <FilaMonto
              etiqueta={sel.length > 1 ? "Costos fijos del mes" : "Costos fijos del mes (asignados por clientes)"}
              valor={-e.costosFijos}
            />
            <FilaMonto etiqueta="Bonos de referido y kits (clientes nuevos)" valor={-e.bonosNuevos} />
            <FilaTotal etiqueta="Flujo del mes" valor={`≈ ${pesos(flujoRedondeado)}`} negativo={e.flujo < 0} />
          </dl>
          <p className="rounded-[10px] bg-bordeaux-soft px-3 py-2.5 text-xs text-bordeaux">
            El piloto todavía no cubre sus costos fijos; según el modelo, el flujo mensual se vuelve positivo en el mes{" "}
            {MES_FLUJO_POSITIVO}.
          </p>
          <ul className="flex flex-col gap-2">
            {e.porRuta.map((r) => (
              <li key={r.id} className="rounded-[10px] bg-ivory px-3 py-2.5 text-xs text-muted">
                <span className="font-semibold text-ink">{r.ruta}</span> · {r.recaudador}: {r.visitasConTarifa} visitas
                con tarifa y <span className="font-mono text-ink">{pesos(r.cuotasRecogidas)}</span> en cuotas
                recogidas. Pago de <span className="font-mono text-ink">{pesos(r.pagoRecaudador)}</span> (
                {pesos(PAGO_POR_VISITA_CON_TARIFA)} por visita + 30% del 1,5% de las cuotas).
              </li>
            ))}
          </ul>
        </Tarjeta>
      </div>

      <Tarjeta>
        <EncabezadoTarjeta titulo="Tasas y condiciones del aliado" nota="la cuota solo puede bajar" />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {tasas.map((x) => (
            <div key={x.producto} className="flex items-center justify-between gap-3 rounded-[10px] bg-ivory px-3 py-2.5">
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold">{x.producto}</span>
                <span className="text-xs text-muted">{x.condicion}</span>
              </div>
              <span className="font-mono text-sm">{x.valor}</span>
            </div>
          ))}
        </div>
      </Tarjeta>
    </>
  );
}

function FilaTotal({ etiqueta, valor, negativo = false }: { etiqueta: string; valor: string; negativo?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-divider pt-2">
      <dt className="font-semibold">{etiqueta}</dt>
      <dd className={`shrink-0 font-mono text-base font-semibold ${negativo ? "text-bordeaux" : ""}`}>{valor}</dd>
    </div>
  );
}

function FilaMonto({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{etiqueta}</dt>
      <dd className={`shrink-0 font-mono ${valor < 0 ? "text-bordeaux" : ""}`}>{pesos(valor)}</dd>
    </div>
  );
}
