"use client";

import { pedidos15 } from "@/lib/datos";
import { pesos, porcentaje } from "@/lib/formato";
import { resumenPedidos } from "@/lib/resumen";
import { DIA_PAGO_DISTRIBUIDOR } from "@/lib/reglas";
import { useRutasSeleccionadas } from "./Shell";
import { Barra, Chip, EncabezadoTarjeta, Kpi, TablaDesplazable, Tarjeta } from "./ui";

const enDias = (d: number) => (d === 0 ? "hoy" : d === 1 ? "mañana" : `en ${d} días`);

export function Distribuidores() {
  const sel = useRutasSeleccionadas();
  const { pedidos, distribuidores, totales } = resumenPedidos(
    pedidos15.filter((p) => sel.some((r) => r.id === p.ruta)),
  );

  return (
    <>
      <section aria-label="Indicadores de pedidos" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Distribuidores con pedidos" valor={String(distribuidores.length)} sub="pagados directo por la ruta" />
        <Kpi label="Pedidos activos" valor={String(totales.activos)} sub={`por ${pesos(totales.valor)}`} />
        <Kpi label="Recaudado en ruta" valor={pesos(totales.recaudado)} sub={`${porcentaje(totales.recaudado / (totales.valor || 1))} del total`} />
        <Kpi
          label="Falta pagar al distribuidor"
          valor={pesos(totales.porPagar)}
          sub={totales.vencidos === 0 ? "ningún pedido vencido" : `${totales.vencidos} vencidos`}
        />
      </section>

      <p className="rounded-xl border border-gold/30 bg-gold-soft px-4 py-2.5 text-[13px] text-gold-ink">
        El distribuidor entrega hoy y cobra a 15 días. El recaudador recoge la cuota en cada visita y le paga el día{" "}
        {DIA_PAGO_DISTRIBUIDOR}: la urgencia se resuelve cambiando la fecha con quien cobra, sin crédito.
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {distribuidores.map((d) => (
          <li key={d.nombre}>
            <Tarjeta className="h-full">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-[15px] font-semibold">{d.nombre}</h2>
                  <p className="text-xs text-muted">{d.clientes.join(", ")}</p>
                </div>
                <Chip tono={d.vencidos === 0 ? "ok" : "riesgo"}>{d.vencidos === 0 ? "Al día" : `${d.vencidos} vencidos`}</Chip>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="text-muted">
                  {d.activos} {d.activos === 1 ? "pedido" : "pedidos"}
                </span>
                <span>
                  <span className="font-mono">{pesos(d.recaudado)}</span>{" "}
                  <span className="text-muted">
                    de <span className="font-mono">{pesos(d.valor)}</span>
                  </span>
                </span>
              </div>
              <Barra fraccion={d.recaudado / (d.valor || 1)} etiqueta={`${d.nombre}: recaudado frente al valor`} />
              <p className="text-xs text-muted">Próximo pago {enDias(d.proximoPago)}</p>
            </Tarjeta>
          </li>
        ))}
      </ul>

      <Tarjeta>
        <EncabezadoTarjeta titulo="Pedidos a 15 días" nota="cada pedido se divide en recogidas por visita" />
        <TablaDesplazable etiqueta="Tabla de pedidos a 15 días">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-divider text-xs text-muted">
                <th scope="col" className="py-1.5 pr-2 font-normal">Cliente · producto</th>
                <th scope="col" className="py-1.5 pr-2 font-normal">Distribuidor</th>
                <th scope="col" className="py-1.5 pr-2 text-right font-normal">Pedido</th>
                <th scope="col" className="py-1.5 pr-2 font-normal">Recogidas</th>
                <th scope="col" className="py-1.5 pr-2 text-right font-normal">Recaudado</th>
                <th scope="col" className="py-1.5 pr-2 font-normal">Pago al distribuidor</th>
                <th scope="col" className="py-1.5 font-normal">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id} className="border-b border-divider last:border-b-0">
                  <th scope="row" className="py-2 pr-2 text-left font-normal">
                    <span className="block font-semibold">{p.cliente}</span>
                    <span className="block text-xs text-muted">
                      {p.producto} · {p.ruta === "r1" ? "Ruta 1" : "Ruta 2"}
                    </span>
                  </th>
                  <td className="py-2 pr-2 text-slate">{p.distribuidor}</td>
                  <td className="py-2 pr-2 text-right font-mono">{pesos(p.monto)}</td>
                  <td className="py-2 pr-2">
                    <span className="flex items-center gap-2">
                      <span className="flex gap-1" aria-hidden>
                        {p.avance.cuotas.map((_, i) => (
                          <span key={i} className={`size-2 rounded-full ${i < p.avance.hechas ? "bg-navy" : "bg-mist"}`} />
                        ))}
                      </span>
                      <span className="font-mono text-xs">
                        {p.avance.hechas} de {p.recogidas}
                      </span>
                    </span>
                    <span className="block text-[11px] text-muted">de {pesos(p.avance.cuotaPorRecogida)} c/u</span>
                  </td>
                  <td className="py-2 pr-2 text-right font-mono">{pesos(p.avance.recaudado)}</td>
                  <td className="py-2 pr-2">
                    Día {DIA_PAGO_DISTRIBUIDOR} <span className="text-xs text-muted">· {enDias(p.avance.diasParaPago)}</span>
                  </td>
                  <td className="py-2">
                    <Chip tono={p.avance.vencido ? "riesgo" : "ok"}>{p.avance.vencido ? "Vencido" : "Al día"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TablaDesplazable>
      </Tarjeta>
    </>
  );
}
