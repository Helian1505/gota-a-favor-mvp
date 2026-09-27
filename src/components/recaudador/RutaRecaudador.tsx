"use client";

import Link from "next/link";
import { Check, Package } from "lucide-react";
import { useReducer } from "react";
import { clientesRuta, rutaDemo } from "@/lib/datos";
import { pesos } from "@/lib/formato";
import { calcularVisita, resumenRuta, type Registro, type VisitaCalculada } from "@/lib/resumen";
import { cuotaMinima, puedeRecibir, TOPE_EFECTIVO } from "@/lib/reglas";
import { MarcaClara } from "../Marca";
import { botonDiscreto, botonPrimario, botonSecundario } from "../estilos";

interface Estado {
  registros: Partial<Record<number, Registro>>;
  consignado: number;
}

type Accion =
  | { tipo: "registrar"; id: number; registro: Registro }
  | { tipo: "consignar"; monto: number }
  | { tipo: "reiniciar" };

const inicial: Estado = { registros: {}, consignado: 0 };

function reducer(s: Estado, a: Accion): Estado {
  switch (a.tipo) {
    case "registrar":
      return { ...s, registros: { ...s.registros, [a.id]: a.registro } };
    case "consignar":
      return { ...s, consignado: a.monto };
    case "reiniciar":
      return inicial;
  }
}

const iconoProps = { size: 14, strokeWidth: 1.75, "aria-hidden": true } as const;

export function RutaRecaudador() {
  const [s, dispatch] = useReducer(reducer, inicial);
  const r = resumenRuta(clientesRuta, s.registros, s.consignado);
  const pct = Math.round(r.efectivo.fraccion * 100);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <header className="flex flex-col gap-3.5 bg-navy px-[18px] pt-5 pb-[18px] text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <MarcaClara tamano={34} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-xs text-on-navy">Ruta de hoy · franja {rutaDemo.franja}</p>
              <h1 className="text-xl font-semibold tracking-tight">{rutaDemo.nombre}</h1>
            </div>
          </div>
          <p className="shrink-0 rounded-full bg-gold px-[9px] py-1 text-[11px] font-semibold text-gold-on">
            Corresponsal
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          <Indicador etiqueta="Visitas" valor={`${r.hechas}/${r.total}`} />
          <Indicador etiqueta="Recogido" valor={pesos(r.recogido)} />
          <Indicador etiqueta="Tu pago hoy" valor={pesos(r.pagoHoy)} />
        </dl>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-on-navy">
            <span id="efectivo-label">
              Efectivo en mano <span className="font-mono text-white">{pesos(r.enMano)}</span>
            </span>
            <span>tope {pesos(TOPE_EFECTIVO)}</span>
          </div>
          <div
            role="progressbar"
            aria-labelledby="efectivo-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="h-2 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className={`h-2 rounded-full transition-[width,background-color] duration-150 ${
                r.efectivo.dorada ? "bg-gold" : "bg-white"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      <ul className="flex min-h-0 grow flex-col gap-2.5 overflow-y-auto px-3.5 py-3" aria-label="Clientes de la ruta">
        {r.visitas.map((v) => (
          <TarjetaCliente
            key={v.cliente.id}
            visita={v}
            enMano={r.enMano}
            onRegistrar={(registro) => dispatch({ tipo: "registrar", id: v.cliente.id, registro })}
          />
        ))}
        <li className="flex items-center justify-between">
          <button type="button" className={botonDiscreto} onClick={() => dispatch({ tipo: "reiniciar" })}>
            Reiniciar demo
          </button>
          <Link href="/" className={`${botonDiscreto} md:hidden`}>
            Volver al inicio
          </Link>
        </li>
      </ul>

      {r.efectivo.alerta && (
        <div
          role="alert"
          className="mx-3.5 mb-3.5 flex flex-col gap-2 rounded-xl border border-warn-line bg-warn-bg px-3 py-2.5 text-[13px] text-warn-ink"
        >
          <p>
            Llevas <span className="font-mono font-semibold">{pesos(r.enMano)}</span> en efectivo. Consigna en la
            tienda-punto antes de seguir.
          </p>
          <button
            type="button"
            className={`${botonSecundario} self-start`}
            onClick={() => dispatch({ tipo: "consignar", monto: r.recogido })}
          >
            Registrar consignación
          </button>
        </div>
      )}
    </div>
  );
}

function Indicador({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-2.5 py-2">
      <dt className="text-[11px] text-on-navy">{etiqueta}</dt>
      <dd className="font-mono text-base">{valor}</dd>
    </div>
  );
}

function TarjetaCliente({
  visita,
  enMano,
  onRegistrar,
}: {
  visita: VisitaCalculada;
  enMano: number;
  onRegistrar: (r: Registro) => void;
}) {
  const { cliente: c, registro } = visita;
  const hecho = Boolean(registro);
  const completa = calcularVisita(c, "ok").totalVisita;
  const minima = calcularVisita(c, "min").totalVisita;
  const cabe = puedeRecibir(enMano, completa);
  const cabeMinimo = puedeRecibir(enMano, minima);
  const permiteMinimo = c.cuota > 0 && !c.pedido;
  const cuotaTxt = c.cuota ? pesos(registro === "min" ? cuotaMinima(c.cuota) : c.cuota) : "—";

  let nota = "Comprobante enviado por WhatsApp · sin costo para el cliente";
  if (c.pedido) {
    nota = `Comprobante enviado por WhatsApp · cuota ${c.pedido.cuotaNumero} de ${c.pedido.totalCuotas} del pedido, queda en su bolsillo en el aliado y el día 15 se transfiere al distribuidor · sin costo`;
  } else if (visita.tarifa > 0) {
    nota = `Comprobante enviado por WhatsApp · recogida de ahorro ${pesos(visita.tarifa)} (cuota sin costo)`;
  }

  return (
    <li className="flex flex-col gap-2 rounded-[14px] border border-line bg-card px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px] font-semibold">{c.nombre}</h2>
          <p className="text-xs text-muted">{c.negocio}</p>
        </div>
        <p
          className={`shrink-0 rounded-full px-[9px] py-1 text-[11px] font-semibold ${
            hecho ? "bg-ok-bg text-ok-ink" : "bg-haze text-slate"
          }`}
        >
          {hecho ? (registro === "min" ? "Mínimo 50%" : "Recogido") : "Pendiente"}
        </p>
      </div>

      {c.pedido && (
        <p className="flex items-center gap-1.5 self-start rounded-lg bg-gold-soft px-2 py-1 text-xs font-medium text-gold-ink">
          <Package {...iconoProps} />
          Pedido a 15 días: cuota {c.pedido.cuotaNumero} de {c.pedido.totalCuotas} para el distribuidor
        </p>
      )}

      <div className="flex gap-3.5 text-[13px]">
        <p>
          <span className="text-muted">{c.pedido ? "Cuota pedido " : "Cuota "}</span>
          <span className="font-mono">{cuotaTxt}</span>
        </p>
        <p>
          <span className="text-muted">Ahorro </span>
          <span className="font-mono">{c.ahorro ? pesos(c.ahorro) : "—"}</span>
        </p>
      </div>

      {!hecho && (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              className={`${botonPrimario} grow`}
              disabled={!cabe}
              onClick={() => onRegistrar("ok")}
            >
              Registrar y enviar comprobante
            </button>
            {permiteMinimo && (
              <button
                type="button"
                className={botonSecundario}
                disabled={!cabeMinimo}
                aria-label={`Registrar el mínimo de ${c.nombre}: ${pesos(cuotaMinima(c.cuota))}`}
                onClick={() => onRegistrar("min")}
              >
                Mínimo
              </button>
            )}
          </div>
          {!cabe && (
            <p className="text-xs text-bordeaux">
              Consigna primero: con esta visita pasarías el tope de {pesos(TOPE_EFECTIVO)} en efectivo.
            </p>
          )}
        </div>
      )}

      {hecho && (
        <p role="status" className="flex items-start gap-1.5 text-xs text-ok-ink">
          <Check {...iconoProps} className="mt-px shrink-0" />
          {nota}
        </p>
      )}
    </li>
  );
}
