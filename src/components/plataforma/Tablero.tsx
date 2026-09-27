"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { alertas, metasPiloto, rutas, type Ruta } from "@/lib/datos";
import { pesos, porcentaje } from "@/lib/formato";
import { resumenPlataforma } from "@/lib/resumen";
import { CLIENTES_RUTA_FORMAL } from "@/lib/reglas";
import { MarcaCuadro } from "../Marca";
import { foco, transicion } from "../estilos";

type Filtro = "todas" | Ruta["id"];

const filtros: { id: Filtro; label: string }[] = [
  { id: "todas", label: "Todas las rutas" },
  { id: "r1", label: "Ruta 1" },
  { id: "r2", label: "Ruta 2" },
];

const secciones = ["Seguimiento", "Rutas", "Clientes", "Aliado y comisiones", "Distribuidores"];

const pieEscenario = "Datos de ejemplo. Escenario: mes 7, fin del piloto.";

export function Tablero() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const sel = filtro === "todas" ? rutas : rutas.filter((r) => r.id === filtro);
  const t = resumenPlataforma(sel);
  const alertasSel = alertas.filter((a) => sel.some((r) => r.id === a.ruta));
  const avancePedidos = t.pedidos15.valor ? t.pedidos15.recaudado / t.pedidos15.valor : 0;

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[220px] shrink-0 flex-col gap-[22px] border-r border-line bg-card px-4 py-[22px] lg:flex">
        <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${foco}`}>
          <MarcaCuadro tamano={30} />
          <span className="text-[15px] font-semibold tracking-tight">Gota a favor</span>
        </Link>
        <nav aria-label="Secciones de la plataforma">
          <ul className="flex flex-col gap-1 text-sm">
            {secciones.map((sec, i) => (
              <li
                key={sec}
                aria-current={i === 0 ? "page" : undefined}
                className={`rounded-lg px-2.5 py-2 ${i === 0 ? "bg-haze font-semibold text-navy" : "text-slate"}`}
              >
                {sec}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <p className="text-xs leading-[1.45] text-muted">{pieEscenario}</p>
          <OtrasVistas />
        </div>
      </aside>

      <div className="flex min-w-0 grow flex-col">
        <header className="flex flex-col gap-3 border-b border-line bg-card px-4 py-3 md:px-7 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${foco}`}>
              <MarcaCuadro tamano={30} />
              <span className="text-[15px] font-semibold tracking-tight">Gota a favor</span>
            </Link>
            <OtrasVistas />
          </div>
          <nav aria-label="Secciones de la plataforma">
            <ul className="flex flex-wrap gap-1 text-[13px]">
              {secciones.map((sec, i) => (
                <li
                  key={sec}
                  aria-current={i === 0 ? "page" : undefined}
                  className={`rounded-lg px-2.5 py-1.5 ${i === 0 ? "bg-haze font-semibold text-navy" : "text-slate"}`}
                >
                  {sec}
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="flex flex-col gap-[18px] px-4 py-5 md:px-7 md:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted">Cali · piloto</p>
              <h1 className="text-2xl font-semibold tracking-tight">Seguimiento de la operación</h1>
            </div>
            <div
              role="group"
              aria-label="Filtrar por ruta"
              className="flex gap-1.5 rounded-[10px] border border-line bg-card p-1"
            >
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                  className={`h-9 rounded-[7px] px-3 text-[13px] font-semibold ${transicion} ${foco} ${
                    filtro === f.id ? "bg-navy text-white hover:bg-navy-deep" : "text-slate hover:bg-haze"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <Kpi label="Clientes activos" valor={String(t.clientes)} sub={`meta piloto: ${metasPiloto.clientes} al mes 6`} />
            <Kpi label="Ahorro a nombre de clientes" valor={pesos(t.ahorro)} sub="en el aliado vigilado" />
            <Kpi label="Cartera del aliado" valor={pesos(t.cartera)} sub="riesgo del aliado" />
            <Kpi label="Pagan recogida de ahorro" valor={porcentaje(t.pagaRecogida)} sub="resto: tienda-punto o Nequi" />
            <Kpi label="Racha de 8+ semanas" valor={String(t.racha8)} sub="con botón de emergencia" />
          </section>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            <div className="flex min-w-0 flex-col gap-3 xl:col-span-2">
              <Tarjeta>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-[15px] font-semibold">Rutas y referentes</h2>
                  <p className="text-xs text-muted">
                    Una ruta pasa a contrato laboral al llegar a ~{CLIENTES_RUTA_FORMAL} clientes
                  </p>
                </div>
                <div
                  className={`-mx-1 overflow-x-auto rounded-md px-1 ${foco}`}
                  tabIndex={0}
                  role="region"
                  aria-label="Tabla de rutas y referentes"
                >
                  <table className="w-full min-w-[640px] table-fixed text-left text-[13px]">
                    <colgroup>
                      <col className="w-[20%]" />
                      <col className="w-[18%]" />
                      <col className="w-[11%]" />
                      <col className="w-[13%]" />
                      <col className="w-[12%]" />
                      <col className="w-[26%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-divider text-xs text-muted">
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
                            <span className="block text-xs text-muted">{r.referente}</span>
                          </th>
                          <td className="py-2 pr-2">{r.recaudador}</td>
                          <td className="py-2 pr-2 font-mono">{r.clientes}</td>
                          <td className="py-2 pr-2 font-mono">{porcentaje(r.pagaRecogida)}</td>
                          <td className="py-2 pr-2 font-mono">{porcentaje(r.impagoCredito1)}</td>
                          <td className="py-2">
                            <div className="flex flex-col gap-1">
                              <div
                                role="progressbar"
                                aria-label={`${r.ruta}: hacia empleo formal`}
                                aria-valuemin={0}
                                aria-valuemax={CLIENTES_RUTA_FORMAL}
                                aria-valuenow={r.clientes}
                                className="h-1.5 overflow-hidden rounded-full bg-divider"
                              >
                                <div className="h-1.5 bg-navy" style={{ width: `${r.formal.progreso * 100}%` }} />
                              </div>
                              <span className="text-[11px] text-muted">
                                {r.clientes} de {CLIENTES_RUTA_FORMAL} clientes
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-auto grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <Mini titulo="Comisiones del mes" valor={pesos(t.comisiones)} nota="aliado, distribuidor, microseguro" />
                  <Mini
                    titulo="Pedidos de surtido financiados"
                    valor={String(t.pedidosSurtido)}
                    nota="pagados directo al distribuidor"
                  />
                  <Mini
                    titulo="Capital de trabajo en rutas"
                    valor={pesos(t.capitalTrabajo)}
                    nota="cupo prefondeado del corresponsal"
                  />
                </div>
              </Tarjeta>

              <Tarjeta>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-[15px] font-semibold">Pedidos a 15 días con distribuidores</h2>
                  <p className="text-xs text-muted">El recaudador recoge por visita y paga el día 15</p>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <Mini titulo="Pedidos activos" valor={String(t.pedidos15.activos)} nota={`por ${pesos(t.pedidos15.valor)}`} />
                  <Mini titulo="Recaudado en ruta" valor={pesos(t.pedidos15.recaudado)} nota="listo para el día 15" />
                  <Mini
                    titulo="Falta pagar al distribuidor"
                    valor={pesos(t.pedidos15.porPagar)}
                    nota="se recoge en las próximas visitas"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div
                    role="progressbar"
                    aria-label="Recaudado frente al valor de los pedidos"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(avancePedidos * 100)}
                    className="h-2 overflow-hidden rounded-full bg-divider"
                  >
                    <div className="h-2 bg-navy" style={{ width: `${avancePedidos * 100}%` }} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span>{porcentaje(avancePedidos)} recaudado</span>
                    <span
                      className={`rounded-full px-[9px] py-[3px] font-semibold ${
                        t.pedidos15.vencidos === 0 ? "bg-ok-bg text-ok-ink" : "bg-bordeaux-soft text-bordeaux"
                      }`}
                    >
                      {t.pedidos15.vencidos === 0 ? "Ningún pedido vencido" : `${t.pedidos15.vencidos} vencidos`}
                    </span>
                  </div>
                </div>
              </Tarjeta>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <Tarjeta>
                <h2 className="text-[15px] font-semibold">Compuertas del piloto</h2>
                <ul className="flex flex-col gap-2.5">
                  {t.compuertas.map((g) => (
                    <li key={g.label} className="flex items-center justify-between gap-2 text-[13px]">
                      <span className="text-slate">{g.label}</span>
                      <span
                        className={`shrink-0 rounded-full px-[9px] py-[3px] text-xs font-semibold ${
                          g.ok ? "bg-ok-bg text-ok-ink" : "bg-bordeaux-soft text-bordeaux"
                        }`}
                      >
                        {g.valor}
                        <span className="sr-only">{g.ok ? ", cumple" : ", no cumple"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Tarjeta>
              <Tarjeta className="grow">
                <h2 className="text-[15px] font-semibold">Alertas</h2>
                <ul className="flex flex-col gap-2.5">
                  {alertasSel.map((a) => (
                    <li key={a.texto} className="flex gap-2.5 text-[13px] leading-[1.4]">
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-bordeaux" />
                      <span>{a.texto}</span>
                    </li>
                  ))}
                </ul>
              </Tarjeta>
            </div>
          </div>

          <p className="text-xs text-muted lg:hidden">{pieEscenario}</p>
        </main>
      </div>
    </div>
  );
}

function OtrasVistas() {
  const enlace = `rounded-md px-1 py-0.5 text-xs text-muted underline-offset-4 hover:text-navy hover:underline ${transicion} ${foco}`;
  return (
    <nav aria-label="Otras vistas del prototipo" className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <Link href="/" className={enlace}>
        Inicio
      </Link>
      <Link href="/cliente" className={enlace}>
        Cliente
      </Link>
      <Link href="/recaudador" className={enlace}>
        Recaudador
      </Link>
    </nav>
  );
}

function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-2.5 rounded-xl border border-line bg-card px-[18px] py-4 ${className}`}>
      {children}
    </section>
  );
}

function Kpi({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-line bg-card px-4 py-3.5">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-mono text-lg font-medium tracking-tight break-words sm:text-[22px]">{valor}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}

function Mini({ titulo, valor, nota }: { titulo: string; valor: string; nota: string }) {
  return (
    <div className="rounded-[10px] bg-ivory px-3 py-2.5">
      <p className="text-xs text-muted">{titulo}</p>
      <p className="font-mono text-base">{valor}</p>
      <p className="text-[11px] text-muted">{nota}</p>
    </div>
  );
}
