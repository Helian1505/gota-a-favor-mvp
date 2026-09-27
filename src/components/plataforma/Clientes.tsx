"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { clientesPlataforma, rutas, type ClientePlataforma } from "@/lib/datos";
import { pesos, tasa } from "@/lib/formato";
import { detalleCliente, filtrarClientes, type FiltroClientes } from "@/lib/resumen";
import { EMERGENCIA_MAX, EMERGENCIA_MIN, RACHA_EMERGENCIA } from "@/lib/reglas";
import { foco } from "../estilos";
import { useRutasSeleccionadas } from "./Shell";
import { Chip, Kpi, Mini, TablaDesplazable, Tarjeta } from "./ui";

const filtros: { id: FiltroClientes; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "credito", label: "Con crédito" },
  { id: "racha", label: "Racha 8+" },
  { id: "ahorro-primero", label: "Ahorro primero" },
  { id: "minimo", label: "Pidieron mínimo" },
];

const nombreRuta = (id: ClientePlataforma["ruta"]) => (id === "r1" ? "Ruta 1" : "Ruta 2");

function estado(c: ClientePlataforma): { texto: string; tono: "ok" | "riesgo" | "dorado" | "neutro" } {
  if (c.pidioMinimo) return { texto: "Pidió mínimo", tono: "riesgo" };
  if (c.reportado && !c.credito) return { texto: "Ahorro primero", tono: "neutro" };
  if (c.rachaSemanas >= RACHA_EMERGENCIA) return { texto: "Al día · racha", tono: "dorado" };
  return { texto: "Al día", tono: "ok" };
}

export function Clientes() {
  const sel = useRutasSeleccionadas();
  const [filtro, setFiltro] = useState<FiltroClientes>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [elegido, setElegido] = useState<number | null>(null);

  const deRutas = clientesPlataforma.filter((c) => sel.some((r) => r.id === c.ruta));
  const lista = filtrarClientes(deRutas, filtro, busqueda);
  const actual = lista.find((c) => c.id === elegido) ?? lista[0] ?? null;
  const totalClientes = sel.reduce((a, r) => a + r.clientes, 0);

  // En pantallas angostas la ficha queda debajo de la tabla: la llevamos a la vista.
  const elegir = (id: number) => {
    setElegido(id);
    if (window.matchMedia("(max-width: 1279px)").matches) {
      const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        document.getElementById("ficha-cliente")?.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" }),
      );
    }
  };

  return (
    <>
      <section aria-label="Indicadores de clientes" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label="Clientes en la muestra" valor={String(deRutas.length)} sub={`de ${totalClientes} clientes activos`} />
        <Kpi
          label="Ahorro de la muestra"
          valor={pesos(deRutas.reduce((a, c) => a + c.ahorro, 0))}
          sub="a nombre de cada cliente"
        />
        <Kpi
          label="Con emergencia habilitada"
          valor={String(deRutas.filter((c) => c.rachaSemanas >= RACHA_EMERGENCIA).length)}
          sub={`racha de ${RACHA_EMERGENCIA}+ semanas`}
        />
        <Kpi
          label="Ahorran primero"
          valor={String(deRutas.filter((c) => c.reportado && !c.credito).length)}
          sub="reportados, sin crédito aún"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Tarjeta className="xl:col-span-2">
          <div className="flex flex-col gap-3">
            <label className="relative flex items-center">
              <span className="sr-only">Buscar cliente por nombre o negocio</span>
              <Search size={16} strokeWidth={1.75} aria-hidden className="pointer-events-none absolute left-4 text-muted" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cliente o negocio"
                className={`h-11 w-full rounded-full border border-steel bg-card pr-4 pl-10 text-body-sm placeholder:text-muted md:w-72 ${foco}`}
              />
            </label>
            <div role="group" aria-label="Filtrar clientes" className="flex flex-wrap gap-1.5">
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                  className={`presionable h-9 rounded-full border px-3.5 text-body-sm font-medium ${foco} ${
                    filtro === f.id
                      ? "border-brand-navy bg-brand-navy text-white hover:bg-brand-navy-deep"
                      : "border-steel bg-card text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {lista.length === 0 ? (
            <p className="rounded-tile bg-mist px-4 py-6 text-center text-body-sm text-muted">
              Ningún cliente coincide con la búsqueda o el filtro.
            </p>
          ) : (
            <TablaDesplazable etiqueta="Tabla de clientes">
              <table className="w-full min-w-[640px] text-left text-body-sm">
                <thead>
                  <tr className="border-b border-divider text-caption text-muted">
                    <th scope="col" className="py-1.5 pr-2 font-normal">Cliente · negocio</th>
                    <th scope="col" className="py-1.5 pr-2 font-normal">Ruta</th>
                    <th scope="col" className="py-1.5 pr-2 font-normal">Racha</th>
                    <th scope="col" className="py-1.5 pr-2 text-right font-normal">Ahorro</th>
                    <th scope="col" className="py-1.5 pr-2 text-right font-normal">Crédito</th>
                    <th scope="col" className="py-1.5 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((c) => {
                    const activo = actual?.id === c.id;
                    const e = estado(c);
                    return (
                      <tr key={c.id} className={`border-b border-divider last:border-b-0 ${activo ? "bg-mist" : ""}`}>
                        <th scope="row" className="py-1 pr-2 text-left font-normal">
                          <button
                            type="button"
                            aria-pressed={activo}
                            onClick={() => elegir(c.id)}
                            className={`flex min-h-11 w-full flex-col justify-center rounded-link px-1 text-left font-medium hover:text-brand-navy ${foco}`}
                          >
                            <span className="font-semibold">{c.nombre}</span>
                            <span className="text-caption text-muted">{c.negocio}</span>
                          </button>
                        </th>
                        <td className="py-2 pr-2 text-ink-soft">{nombreRuta(c.ruta)}</td>
                        <td className="py-2 pr-2 tabular-nums">{c.rachaSemanas} sem.</td>
                        <td className="py-2 pr-2 text-right tabular-nums">{c.ahorro ? pesos(c.ahorro) : "—"}</td>
                        <td className="py-2 pr-2 text-right tabular-nums">{c.credito ? pesos(c.credito.saldo) : "—"}</td>
                        <td className="py-2">
                          <Chip tono={e.tono}>{e.texto}</Chip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TablaDesplazable>
          )}
          <p className="text-caption text-muted">
            Muestra de {deRutas.length} de {totalClientes} clientes activos. Toca un nombre para ver su ficha.
          </p>
        </Tarjeta>

        {actual ? <FichaCliente key={actual.id} cliente={actual} /> : null}
      </div>
    </>
  );
}

function FichaCliente({ cliente }: { cliente: ClientePlataforma }) {
  const d = detalleCliente(cliente);
  const ruta = rutas.find((r) => r.id === d.ruta);
  const e = estado(d);

  return (
    <Tarjeta className="scroll-mt-4 xl:sticky xl:top-6 xl:self-start" id="ficha-cliente">
      <div aria-live="polite" className="cruza flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display text-nav-title font-semibold">{d.nombre}</h2>
            <p className="text-caption text-muted">
              {d.negocio} · {ruta?.ruta}
            </p>
            <p className="text-caption text-muted">{ruta?.referente}</p>
          </div>
          <Chip tono={e.tono}>{e.texto}</Chip>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Mini titulo="Ahorro a su nombre" valor={d.ahorro ? pesos(d.ahorro) : "$0"} nota={d.canal} />
          <Mini titulo="Racha" valor={`${d.rachaSemanas} sem.`} nota={d.reportado ? "reportado en centrales" : "sin reportes"} />
        </div>

        {d.credito ? (
          <dl className="flex flex-col gap-1.5 text-body-sm">
            <Fila etiqueta={d.credito.tipo === "dia1" ? "Crédito del día 1" : "Crédito de surtido"} valor={pesos(d.credito.saldo)} mono />
            <Fila etiqueta="Tasa" valor={`${tasa(d.tasa ?? 0)} mensual`} />
            <Fila etiqueta="Cuota semanal" valor={pesos(d.credito.cuota)} mono />
            <Fila etiqueta="Puede bajarla a" valor={pesos(d.cuotaMinima ?? 0)} mono />
            <Fila etiqueta="Próximo crédito de surtido" valor={`${tasa(d.tasaProximo)} mensual`} />
          </dl>
        ) : (
          <p className="rounded-tile bg-mist px-4 py-3 text-body-sm text-ink-soft">
            {d.ahorroPrimero
              ? d.semanasParaEvaluacion > 0
                ? `Ahorra primero: le faltan ${d.semanasParaEvaluacion} semanas de historial para que el aliado lo evalúe.`
                : "Ya cumple 8 semanas de historial: enviar al aliado para evaluar crédito."
              : `Sin crédito activo. Su próximo crédito de surtido sería al ${tasa(d.tasaProximo)} mensual.`}
          </p>
        )}

        <div
          className={`rounded-tile px-4 py-3 text-body-sm ${
            d.emergencia.habilitado ? "bg-orange-soft text-ink" : "bg-mist text-ink-soft"
          }`}
        >
          {d.emergencia.habilitado
            ? `Botón de emergencia habilitado: de ${pesos(EMERGENCIA_MIN)} a ${pesos(EMERGENCIA_MAX)} al ${tasa(d.emergencia.tasaMensual)} mensual.`
            : `Botón de emergencia: se habilita en ${d.emergencia.faltan} semanas más de racha.`}
        </div>

        {d.pidioMinimo && (
          <p className="flex gap-2.5 text-body-sm leading-[1.4]">
            <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-red" />
            Pidió el mínimo esta semana: llamada del coordinador; nunca cobro presencial con presión.
          </p>
        )}
      </div>
    </Tarjeta>
  );
}

function Fila({ etiqueta, valor, mono = false }: { etiqueta: string; valor: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{etiqueta}</dt>
      <dd className={`text-right ${mono ? "tabular-nums" : ""}`}>{valor}</dd>
    </div>
  );
}
