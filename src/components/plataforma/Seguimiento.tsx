"use client";

import { alertas, metasPiloto } from "@/lib/datos";
import { pesos, porcentaje } from "@/lib/formato";
import { resumenPlataforma } from "@/lib/resumen";
import { CLIENTES_RUTA_FORMAL } from "@/lib/reglas";
import { useRutasSeleccionadas } from "./Shell";
import { Barra, Chip, EncabezadoTarjeta, Kpi, Mini, TablaDesplazable, Tarjeta } from "./ui";

export function Seguimiento() {
  const sel = useRutasSeleccionadas();
  const t = resumenPlataforma(sel);
  const alertasSel = alertas.filter((a) => sel.some((r) => r.id === a.ruta));
  const avancePedidos = t.pedidos15.valor ? t.pedidos15.recaudado / t.pedidos15.valor : 0;

  return (
    <>
      <section aria-label="Indicadores" className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <Kpi label="Clientes activos" valor={String(t.clientes)} sub={`meta piloto: ${metasPiloto.clientes} al mes 6`} />
        <Kpi label="Ahorro a nombre de clientes" valor={pesos(t.ahorro)} sub="en el aliado vigilado" />
        <Kpi label="Cartera del aliado" valor={pesos(t.cartera)} sub="riesgo del aliado" />
        <Kpi label="Pagan recogida de ahorro" valor={porcentaje(t.pagaRecogida)} sub="resto: tienda-punto o Nequi" />
        <Kpi label="Racha de 8+ semanas" valor={String(t.racha8)} sub="con botón de emergencia" />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-2">
          <Tarjeta>
            <EncabezadoTarjeta
              titulo="Rutas y referentes"
              nota={`Una ruta pasa a contrato laboral al llegar a ~${CLIENTES_RUTA_FORMAL} clientes`}
            />
            <TablaDesplazable etiqueta="Tabla de rutas y referentes">
              <table className="w-full min-w-[640px] table-fixed text-left text-body-sm">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[18%]" />
                  <col className="w-[11%]" />
                  <col className="w-[13%]" />
                  <col className="w-[12%]" />
                  <col className="w-[26%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-divider text-caption text-muted">
                    <th scope="col" className="py-1.5 pr-2 font-normal">Ruta · referente</th>
                    <th scope="col" className="py-1.5 pr-2 font-normal">Recaudador</th>
                    <th scope="col" className="py-1.5 pr-2 font-normal">Clientes</th>
                    <th scope="col" className="py-1.5 pr-2 font-normal">Pagan recogida</th>
                    <th scope="col" className="py-1.5 pr-2 font-normal">Impago cr. 1</th>
                    <th scope="col" className="py-1.5 font-normal">Hacia empleo formal</th>
                  </tr>
                </thead>
                <tbody>
                  {t.filas.map((r) => (
                    <tr key={r.id} className="border-b border-divider last:border-b-0">
                      <th scope="row" className="py-2 pr-2 text-left font-normal">
                        <span className="block font-semibold">{r.ruta}</span>
                        <span className="block text-caption text-muted">{r.referente}</span>
                      </th>
                      <td className="py-2 pr-2">{r.recaudador}</td>
                      <td className="py-2 pr-2 tabular-nums">{r.clientes}</td>
                      <td className="py-2 pr-2 tabular-nums">{porcentaje(r.pagaRecogida)}</td>
                      <td className="py-2 pr-2 tabular-nums">{porcentaje(r.impagoCredito1)}</td>
                      <td className="py-2">
                        <div className="flex flex-col gap-1">
                          <Barra fraccion={r.formal.progreso} etiqueta={`${r.ruta}: hacia empleo formal`} />
                          <span className="text-caption text-muted">
                            {r.clientes} de {CLIENTES_RUTA_FORMAL} clientes
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TablaDesplazable>
            <div className="mt-auto grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <Mini titulo="Comisiones del mes" valor={pesos(t.comisiones)} nota="aliado, distribuidor, microseguro y facturas" />
              <Mini
                titulo="Pedidos de surtido financiados"
                valor={String(t.pedidosSurtido)}
                nota="se transfieren directo al distribuidor"
              />
              <Mini
                titulo="Capital de trabajo en rutas"
                valor={pesos(t.capitalTrabajo)}
                nota="cupo prefondeado del corresponsal"
              />
            </div>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta
              titulo="Pedidos a 15 días con distribuidores"
              enlace={{ href: "/plataforma/distribuidores", label: "Ver distribuidores" }}
            />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <Mini titulo="Pedidos activos" valor={String(t.pedidos15.activos)} nota={`por ${pesos(t.pedidos15.valor)}`} />
              <Mini
                titulo="Recaudado en ruta"
                valor={pesos(t.pedidos15.recaudado)}
                nota="en el bolsillo de cada cliente en el aliado; se transfiere al distribuidor el día 15"
              />
              <Mini
                titulo="Falta pagar al distribuidor"
                valor={pesos(t.pedidos15.porPagar)}
                nota="se recoge en las próximas visitas"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Barra fraccion={avancePedidos} etiqueta="Recaudado frente al valor de los pedidos" alto="h-2" />
              <div className="flex flex-wrap items-center justify-between gap-2 text-caption text-muted">
                <span>{porcentaje(avancePedidos)} recaudado</span>
                <Chip tono={t.pedidos15.vencidos === 0 ? "ok" : "riesgo"}>
                  {t.pedidos15.vencidos === 0 ? "Ningún pedido vencido" : `${t.pedidos15.vencidos} vencidos`}
                </Chip>
              </div>
            </div>
          </Tarjeta>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Tarjeta>
            <h2 className="font-display text-nav-title font-semibold">Compuertas del piloto</h2>
            <ul className="flex flex-col gap-2.5">
              {t.compuertas.map((g) => (
                <li key={g.label} className="flex items-center justify-between gap-2 text-body-sm">
                  <span className="text-ink-soft">{g.label}</span>
                  <Chip tono={g.ok ? "ok" : "riesgo"}>
                    {g.valor}
                    <span className="sr-only">{g.ok ? ", cumple" : ", no cumple"}</span>
                  </Chip>
                </li>
              ))}
            </ul>
          </Tarjeta>
          <Tarjeta className="grow">
            <h2 className="font-display text-nav-title font-semibold">Alertas</h2>
            <ul className="flex flex-col gap-2.5">
              {alertasSel.map((a) => (
                <li key={a.texto} className="flex gap-2.5 text-body-sm leading-[1.4]">
                  <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-red" />
                  <span>{a.texto}</span>
                </li>
              ))}
            </ul>
          </Tarjeta>
        </div>
      </div>
    </>
  );
}
