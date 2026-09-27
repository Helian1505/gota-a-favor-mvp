import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { foco, transicion } from "../estilos";

/**
 * Piezas del tablero según DESIGN (1): tarjetas blancas de 28 px sin borde ni
 * sombra sobre la banda #f5f5f7, tiles internos en #f5f5f7 y enlaces azules.
 */

export function Tarjeta({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`flex min-w-0 flex-col gap-4 rounded-card bg-card p-6 sm:p-7 ${className}`}>
      {children}
    </section>
  );
}

export function EncabezadoTarjeta({
  titulo,
  nota,
  enlace,
}: {
  titulo: string;
  nota?: string;
  enlace?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="font-display text-nav-title font-semibold">{titulo}</h2>
      {nota && <p className="text-caption text-muted">{nota}</p>}
      {enlace && (
        <Link
          href={enlace.href}
          className={`inline-flex min-h-8 items-center gap-0.5 rounded-link text-body-sm text-blue underline-offset-4 hover:underline ${transicion} ${foco}`}
        >
          {enlace.label}
          <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function Kpi({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="@container flex min-w-0 flex-col gap-2 rounded-card bg-card p-5 2xl:p-6">
      <p className="text-body-sm text-muted">{label}</p>
      {/* El monto se ajusta al ancho de la tarjeta para no partirse nunca */}
      <p className="font-display text-[min(28px,12cqi)] leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums">
        {valor}
      </p>
      <p className="text-caption text-muted">{sub}</p>
    </div>
  );
}

export function Mini({ titulo, valor, nota }: { titulo: string; valor: string; nota?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-tile bg-mist px-4 py-3">
      <p className="text-caption text-muted">{titulo}</p>
      <p className="text-[17px] font-semibold tracking-tight break-words tabular-nums">{valor}</p>
      {nota && <p className="text-caption text-muted">{nota}</p>}
    </div>
  );
}

type TonoChip = "ok" | "riesgo" | "dorado" | "neutro";

const tonos: Record<TonoChip, string> = {
  ok: "bg-green-soft text-green",
  riesgo: "bg-red-soft text-red",
  dorado: "bg-orange-soft text-orange",
  neutro: "bg-control/70 text-ink-soft",
};

export function Chip({ tono, children }: { tono: TonoChip; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-caption font-semibold ${tonos[tono]}`}>
      {children}
    </span>
  );
}

/** Barra de avance: anima solo `transform` (scaleX), nunca el ancho. */
export function Barra({
  fraccion,
  etiqueta,
  alto = "h-1.5",
}: {
  fraccion: number;
  etiqueta: string;
  alto?: "h-1.5" | "h-2";
}) {
  const f = Math.min(1, Math.max(0, fraccion));
  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(f * 100)}
      className={`${alto} overflow-hidden rounded-full bg-control`}
    >
      <div
        className={`${alto} w-full origin-left rounded-full bg-blue-fill transition-transform duration-300 ease-out motion-reduce:transition-none`}
        style={{ transform: `scaleX(${f})` }}
      />
    </div>
  );
}

/** Contenedor con scroll horizontal para tablas en pantallas angostas. */
export function TablaDesplazable({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className={`-mx-1 overflow-x-auto rounded-link px-1 ${foco}`} tabIndex={0} role="region" aria-label={etiqueta}>
      {children}
    </div>
  );
}
