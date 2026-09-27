"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, type ReactNode } from "react";
import { clienteDemo as c } from "@/lib/datos";
import { pesos, tasa } from "@/lib/formato";
import {
  bajarCuota,
  botonEmergencia,
  EMERGENCIA_MAX,
  EMERGENCIA_MIN,
  pedidoProveedor,
  proyeccionAhorro,
  TASA_CREDITO_DIA1,
  tasaCreditoProductivo,
  type Urgencia,
} from "@/lib/reglas";
import { MarcaCuadro } from "../Marca";
import { botonDiscreto, botonOpcion, botonSecundario } from "../estilos";

type Entrada = "bajar" | "emergencia" | "misma" | "urgencia";

interface Estado {
  entradas: Entrada[];
  monto: number | null;
  urgencia: Urgencia | null;
  reportado: boolean | null;
}

type Accion =
  | { tipo: "agregar"; entrada: Entrada }
  | { tipo: "monto"; monto: number }
  | { tipo: "urgencia"; urgencia: Urgencia }
  | { tipo: "reportado"; reportado: boolean }
  | { tipo: "reiniciar" };

const inicial: Estado = { entradas: [], monto: null, urgencia: null, reportado: null };

function reducer(s: Estado, a: Accion): Estado {
  switch (a.tipo) {
    case "agregar":
      return s.entradas.includes(a.entrada) ? s : { ...s, entradas: [...s.entradas, a.entrada] };
    case "monto":
      return { ...s, monto: a.monto };
    case "urgencia":
      return { ...s, urgencia: a.urgencia, reportado: null };
    case "reportado":
      return { ...s, reportado: a.reportado };
    case "reiniciar":
      return inicial;
  }
}

const bajada = bajarCuota(c.cuota, c.semanasHastaElFinal);
const emergencia = botonEmergencia(c.rachaSemanas);
const pedido = pedidoProveedor(c.pedidoEjemplo.monto, c.pedidoEjemplo.recogidas);

const respuestasRapidas: { entrada: Entrada; label: string }[] = [
  { entrada: "bajar", label: "Bajar cuota" },
  { entrada: "emergencia", label: "Emergencia" },
  { entrada: "misma", label: "Al terminar" },
  { entrada: "urgencia", label: "Primera urgencia" },
];

const mensajeUsuario: Record<Entrada, string> = {
  bajar: "BAJAR",
  emergencia: "EMERGENCIA",
  misma: "¿Qué pasa cuando termine de pagar?",
  urgencia: "Tengo una urgencia de pago",
};

const urgencias: { id: Urgencia; label: string }[] = [
  { id: "pedido", label: "Un pedido" },
  { id: "arriendo", label: "Arriendo o servicios" },
  { id: "efectivo", label: "Efectivo" },
];

export function ChatCliente() {
  const [s, dispatch] = useReducer(reducer, inicial);
  const finRef = useRef<HTMLDivElement>(null);
  const cuota = s.entradas.includes("bajar") ? bajada.cuotaNueva : c.cuota;

  useEffect(() => {
    if (s.entradas.length === 0) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    finRef.current?.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "end" });
  }, [s.entradas.length, s.monto, s.urgencia, s.reportado]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-line bg-card px-[18px] pt-[18px] pb-3.5">
        <MarcaCuadro tamano={40} />
        <div className="flex min-w-0 grow flex-col gap-0.5">
          <h1 className="text-base font-semibold tracking-tight">Gota a favor</h1>
          <p className="text-xs text-muted">Tu plata está a tu nombre en el aliado</p>
        </div>
        <p className="shrink-0 rounded-full bg-gold-soft px-[9px] py-1 text-[11px] font-semibold text-gold-ink">
          Racha {c.rachaSemanas} sem.
        </p>
      </header>

      <div
        role="log"
        aria-live="polite"
        aria-label="Conversación con Gota a favor"
        className="flex min-h-0 grow flex-col gap-3 overflow-y-auto px-3.5 py-4"
      >
        <p className="self-center rounded-full bg-mist px-2.5 py-[3px] text-[11px] text-muted">
          Lunes · extracto semanal
        </p>

        <Burbuja>
          <p className="text-sm">Hola, {c.nombre}. Así va tu plata esta semana:</p>
          <div className="grid grid-cols-2 gap-2.5">
            <Casilla titulo="Ahorro libre" valor={pesos(c.ahorroLibre)} nota={`gana ${tasa(c.ahorroTasaEA)} EA`} />
            <Casilla
              titulo="Bolsillo arriendo"
              valor={pesos(c.bolsilloArriendo)}
              nota={`meta ${pesos(c.metaArriendo)} · día ${c.diaMetaArriendo}`}
            />
          </div>
          <div
            role="progressbar"
            aria-label="Avance del bolsillo arriendo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((c.bolsilloArriendo / c.metaArriendo) * 100)}
            className="h-1.5 overflow-hidden rounded-full bg-mist"
          >
            <div className="h-1.5 bg-navy" style={{ width: `${(c.bolsilloArriendo / c.metaArriendo) * 100}%` }} />
          </div>
          <dl className="flex flex-col gap-1.5 text-[13px]">
            <Fila etiqueta="Crédito del día 1" valor={<span className="font-mono">{pesos(c.saldoCredito)}</span>} />
            <Fila etiqueta="Tasa" valor={`${tasa(TASA_CREDITO_DIA1)} mensual`} />
            <Fila
              etiqueta="Cuota de esta semana"
              valor={<span className="font-mono font-semibold">{pesos(cuota)}</span>}
            />
            <Fila etiqueta="Próxima recogida" valor={c.proximaRecogida} />
          </dl>
          <p className="border-t border-divider pt-2.5 text-xs text-muted">
            Recoger tu cuota no tiene costo. Recoger ahorro a domicilio: $1.500 si depositas $20.000 o más; en la
            tienda-punto o por Nequi es gratis.
          </p>
        </Burbuja>

        {s.entradas.map((e) => (
          <div key={e} className="flex flex-col gap-3">
            <MensajeUsuario>{mensajeUsuario[e]}</MensajeUsuario>
            {e === "bajar" && <RespuestaBajar />}
            {e === "emergencia" && (
              <RespuestaEmergencia monto={s.monto} onMonto={(monto) => dispatch({ tipo: "monto", monto })} />
            )}
            {e === "misma" && <RespuestaMisma />}
            {e === "urgencia" && (
              <RespuestaUrgencia
                urgencia={s.urgencia}
                reportado={s.reportado}
                onUrgencia={(urgencia) => dispatch({ tipo: "urgencia", urgencia })}
                onReportado={(reportado) => dispatch({ tipo: "reportado", reportado })}
              />
            )}
          </div>
        ))}
        <div ref={finRef} />
      </div>

      <div className="flex flex-col gap-2 border-t border-line bg-card px-3.5 pt-3 pb-[18px]">
        <p id="respuestas-rapidas" className="text-[11px] text-muted">
          Respuestas rápidas
        </p>
        <div role="group" aria-labelledby="respuestas-rapidas" className="flex flex-wrap gap-2">
          {respuestasRapidas.map((r) => (
            <button
              key={r.entrada}
              type="button"
              className={botonSecundario}
              onClick={() => dispatch({ tipo: "agregar", entrada: r.entrada })}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button type="button" className={botonDiscreto} onClick={() => dispatch({ tipo: "reiniciar" })}>
            Reiniciar demo
          </button>
          <Link href="/" className={`${botonDiscreto} md:hidden`}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function Burbuja({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex max-w-[320px] flex-col gap-3.5 rounded-2xl border border-line bg-card p-4 ${className}`}>
      {children}
    </div>
  );
}

function RespuestaBot({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-[320px] flex-col gap-2 rounded-2xl border border-line bg-card px-4 py-3.5 text-sm">
      {children}
    </div>
  );
}

function MensajeUsuario({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[280px] self-end rounded-[16px_16px_4px_16px] bg-navy px-3.5 py-2.5 text-sm text-white">
      {children}
    </p>
  );
}

function Casilla({ titulo, valor, nota }: { titulo: string; valor: string; nota: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-surface px-3 py-2.5">
      <p className="text-[11px] text-muted">{titulo}</p>
      <p className="font-mono text-[17px] font-medium">{valor}</p>
      <p className="text-[11px] text-muted">{nota}</p>
    </div>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{etiqueta}</dt>
      <dd className="text-right">{valor}</dd>
    </div>
  );
}

function AvisoDorado({ children }: { children: ReactNode }) {
  return <div className="rounded-xl bg-gold-soft px-3 py-2.5 text-[13px] text-warn-ink">{children}</div>;
}

function RespuestaBajar() {
  return (
    <RespuestaBot>
      <p className="font-semibold">Listo, esta semana pagas el mínimo.</p>
      <p>
        Tu cuota baja de {pesos(c.cuota)} a{" "}
        <span className="font-mono font-semibold">{pesos(bajada.cuotaNueva)}</span>. La diferencia se corre al
        final del plazo, con su interés. Tu cuota nunca sube.
      </p>
      <p className="text-xs text-muted">Tu racha se mantiene: bajar la cuota es un derecho, no un atraso.</p>
    </RespuestaBot>
  );
}

function RespuestaEmergencia({ monto, onMonto }: { monto: number | null; onMonto: (m: number) => void }) {
  if (!emergencia.habilitado) {
    return (
      <RespuestaBot>
        <p className="font-semibold">El botón de emergencia se habilita con 8 semanas de racha.</p>
        <p>Te faltan {emergencia.faltan} semanas. Sigue ahorrando en tu ruta.</p>
      </RespuestaBot>
    );
  }
  return (
    <div className="flex max-w-[320px] flex-col gap-2.5 rounded-2xl border border-line bg-card px-4 py-3.5 text-sm">
      <p className="font-semibold">Tienes un cupo pre-aprobado por tu racha.</p>
      <p id="emergencia-monto">¿Cuánto necesitas hoy?</p>
      <div role="group" aria-labelledby="emergencia-monto" className="flex gap-2">
        {emergencia.montos.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={monto === m}
            className={botonOpcion(monto === m)}
            onClick={() => onMonto(m)}
          >
            {pesos(m)}
          </button>
        ))}
      </div>
      {monto !== null && (
        <AvisoDorado>
          Aprobado: <span className="font-mono">{pesos(monto)}</span>. Te lo entrega hoy tu recaudador o llega a tu
          Nequi. Tasa {tasa(emergencia.tasaMensual)} mensual, cuotas en tu ruta.
        </AvisoDorado>
      )}
    </div>
  );
}

function RespuestaMisma() {
  return (
    <RespuestaBot>
      <p className="font-semibold">Misma cuota, ahora para ti.</p>
      <p>
        La ruta sigue pasando y tus {pesos(c.cuota)} semanales van a tu ahorro. En {c.semanasProyeccion} semanas
        serían unos{" "}
        <span className="font-mono font-semibold">{pesos(proyeccionAhorro(c.cuota, c.semanasProyeccion))}</span> a
        tu nombre, y tu próximo crédito para surtido baja a {tasa(tasaCreditoProductivo(c.creditosPagadosATiempo))}{" "}
        mensual.
      </p>
    </RespuestaBot>
  );
}

function RespuestaUrgencia({
  urgencia,
  reportado,
  onUrgencia,
  onReportado,
}: {
  urgencia: Urgencia | null;
  reportado: boolean | null;
  onUrgencia: (u: Urgencia) => void;
  onReportado: (r: boolean) => void;
}) {
  return (
    <div className="flex max-w-[320px] flex-col gap-2.5 rounded-2xl border border-line bg-card px-4 py-3.5 text-sm">
      <p className="font-semibold">Primero movemos la fecha con quien te cobra.</p>
      <p id="urgencia-que">¿Qué necesitas pagar?</p>
      <div role="group" aria-labelledby="urgencia-que" className="flex flex-wrap gap-2">
        {urgencias.map((u) => (
          <button
            key={u.id}
            type="button"
            aria-pressed={urgencia === u.id}
            className={botonOpcion(urgencia === u.id)}
            onClick={() => onUrgencia(u.id)}
          >
            {u.label}
          </button>
        ))}
      </div>

      {urgencia === "pedido" && (
        <div className="flex flex-col gap-2.5">
          <AvisoDorado>
            Tu distribuidor te entrega hoy y te cobra a 15 días; tu recaudador recoge la cuota en cada visita y le
            paga el día {pedido.diaPagoDistribuidor}.
          </AvisoDorado>
          <div className="flex flex-col gap-2 rounded-xl bg-surface px-3 py-2.5">
            <p className="text-[11px] text-muted">
              Ejemplo: pedido de <span className="font-mono">{pesos(pedido.total)}</span>
            </p>
            <ol className="grid grid-cols-4 gap-1.5">
              {pedido.cuotas.map((q, i) => (
                <li key={i} className="flex flex-col gap-0.5 rounded-lg bg-card px-1.5 py-1.5 text-center">
                  <span className="text-[10px] text-muted">Recogida {i + 1}</span>
                  <span className="font-mono text-xs font-medium">{pesos(q)}</span>
                </li>
              ))}
            </ol>
            <p className="text-[11px] text-muted">
              {pedido.cuotas.length} recogidas de {pesos(pedido.cuotaPorRecogida)} · pago al distribuidor el día{" "}
              {pedido.diaPagoDistribuidor}
            </p>
          </div>
        </div>
      )}

      {urgencia === "arriendo" && (
        <AvisoDorado>
          Acordamos con quien te cobra que reciba por partes lo que recoge tu ruta, pagado directo.
        </AvisoDorado>
      )}

      {urgencia === "efectivo" && (
        <div className="flex flex-col gap-2.5">
          <p id="urgencia-reporte">¿Tienes reportes en centrales de riesgo?</p>
          <div role="group" aria-labelledby="urgencia-reporte" className="flex gap-2">
            <button
              type="button"
              aria-pressed={reportado === false}
              className={botonOpcion(reportado === false)}
              onClick={() => onReportado(false)}
            >
              No
            </button>
            <button
              type="button"
              aria-pressed={reportado === true}
              className={botonOpcion(reportado === true)}
              onClick={() => onReportado(true)}
            >
              Sí, tengo reportes
            </button>
          </div>
          {reportado === false && (
            <AvisoDorado>
              Crédito del día 1 de <span className="font-mono">{pesos(EMERGENCIA_MIN)}</span> a{" "}
              <span className="font-mono">{pesos(EMERGENCIA_MAX)}</span>, al {tasa(TASA_CREDITO_DIA1)} mensual, con
              cuotas en tu ruta.
            </AvisoDorado>
          )}
          {reportado === true && (
            <AvisoDorado>Empiezas ahorrando; con 8 semanas de historial el aliado te evalúa.</AvisoDorado>
          )}
        </div>
      )}
    </div>
  );
}
