"use client";

import Link from "next/link";
import { Check, Package } from "lucide-react";
import { useReducer } from "react";
import { clientesRuta, rutaDemo } from "@/lib/datos";
import { pesos } from "@/lib/formato";
import { calcularVisita, resumenRuta, type Registro, type VisitaCalculada } from "@/lib/resumen";
import { cuotaMinima, puedeRecibir, TOPE_EFECTIVO } from "@/lib/reglas";
import { Gota } from "../Marca";
import { botonDiscreto, botonPrimarioCompacto, botonSecundario, botonSecundarioCompacto } from "../estilos";

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
      <header className="flex flex-col gap-4 bg-ink px-5 pt-5 pb-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Gota tamano={34} variante="clara" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-caption text-on-dark">Ruta de hoy · franja {rutaDemo.franja}</p>
              <h1 className="font-display text-[21px] leading-tight font-semibold">{rutaDemo.nombre}</h1>
            </div>
          </div>
          <p className="shrink-0 text-caption font-semibold text-gold">Corresponsal</p>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          <Indicador etiqueta="Visitas" valor={`${r.hechas}/${r.total}`} />
          <Indicador etiqueta="Recogido" valor={pesos(r.recogido)} />
          <Indicador etiqueta="Tu pago hoy" valor={pesos(r.pagoHoy)} />
        </dl>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-caption text-on-dark">
            <span id="efectivo-label">
              Efectivo en mano <span className="tabular-nums text-white">{pesos(r.enMano)}</span>
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
              className={`h-2 w-full origin-left rounded-full transition-[transform,background-color] duration-300 ease-out ${
                r.efectivo.dorada ? "bg-gold" : "bg-white"
              }`}
              style={{ transform: `scaleX(${r.efectivo.fraccion})` }}
            />
          </div>
        </div>
      </header>

      <ul
        className={`flex min-h-0 grow flex-col gap-2.5 overflow-y-auto bg-mist px-3 pt-3 ${r.efectivo.alerta ? "pb-40" : "pb-3"}`}
        aria-label="Clientes de la ruta"
      >
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
          className="sube absolute inset-x-3 bottom-3 z-10 flex flex-col gap-2.5 rounded-[22px] border border-orange-line bg-orange-soft px-4 py-3 text-body-sm text-ink"
        >
          <p>
            Llevas <span className="tabular-nums font-semibold">{pesos(r.enMano)}</span> en efectivo. Consigna en la
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
    <div className="rounded-tile bg-white/10 px-3 py-2">
      <dt className="text-caption text-on-dark">{etiqueta}</dt>
      <dd className="text-[17px] font-semibold tabular-nums">{valor}</dd>
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
    <li className="flex flex-col gap-2.5 rounded-[22px] bg-card px-4 py-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[17px] leading-tight font-semibold">{c.nombre}</h2>
          <p className="text-caption text-muted">{c.negocio}</p>
        </div>
        <p
          className={`shrink-0 rounded-full px-[9px] py-1 text-caption font-semibold ${
            hecho ? "bg-green-soft text-green" : "bg-mist text-ink-soft"
          }`}
        >
          {hecho ? (registro === "min" ? "Mínimo 50%" : "Recogido") : "Pendiente"}
        </p>
      </div>

      {c.pedido && (
        <p className="flex items-center gap-1.5 self-start rounded-full bg-orange-soft px-2.5 py-1 text-caption font-medium text-orange">
          <Package {...iconoProps} />
          Pedido a 15 días: cuota {c.pedido.cuotaNumero} de {c.pedido.totalCuotas} para el distribuidor
        </p>
      )}

      <div className="flex gap-4 text-body-sm">
        <p>
          <span className="text-muted">{c.pedido ? "Cuota pedido " : "Cuota "}</span>
          <span className="tabular-nums">{cuotaTxt}</span>
        </p>
        <p>
          <span className="text-muted">Ahorro </span>
          <span className="tabular-nums">{c.ahorro ? pesos(c.ahorro) : "—"}</span>
        </p>
      </div>

      {!hecho && (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              className={`${botonPrimarioCompacto} min-w-0 grow`}
              disabled={!cabe}
              onClick={() => onRegistrar("ok")}
            >
              Registrar y enviar comprobante
            </button>
            {permiteMinimo && (
              <button
                type="button"
                className={botonSecundarioCompacto}
                disabled={!cabeMinimo}
                aria-label={`Registrar el mínimo de ${c.nombre}: ${pesos(cuotaMinima(c.cuota))}`}
                onClick={() => onRegistrar("min")}
              >
                Mínimo
              </button>
            )}
          </div>
          {!cabe && (
            <p className="text-caption text-red">
              Consigna primero: con esta visita pasarías el tope de {pesos(TOPE_EFECTIVO)} en efectivo.
            </p>
          )}
        </div>
      )}

      {hecho && (
        <p role="status" className="entra flex items-start gap-1.5 text-caption text-green">
          <Check {...iconoProps} className="mt-px shrink-0" />
          {nota}
        </p>
      )}
    </li>
  );
}
