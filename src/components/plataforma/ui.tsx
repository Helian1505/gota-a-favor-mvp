import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { foco, transicion } from "../estilos";

/** Piezas del tablero, con los mismos radios, bordes y tamaños de la referencia. */

export function Tarjeta({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`flex min-w-0 flex-col gap-2.5 rounded-xl border border-line bg-card px-[18px] py-4 ${className}`}>
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
      <h2 className="text-[15px] font-semibold">{titulo}</h2>
      {nota && <p className="text-xs text-muted">{nota}</p>}
      {enlace && (
        <Link
          href={enlace.href}
          className={`inline-flex items-center gap-1 rounded-md text-xs font-semibold text-navy underline-offset-4 hover:underline ${transicion} ${foco}`}
        >
          {enlace.label}
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function Kpi({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-line bg-card px-4 py-3.5">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-mono text-lg font-medium tracking-tight break-words sm:text-[22px]">{valor}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}

export function Mini({ titulo, valor, nota }: { titulo: string; valor: string; nota?: string }) {
  return (
    <div className="min-w-0 rounded-[10px] bg-ivory px-3 py-2.5">
      <p className="text-xs text-muted">{titulo}</p>
      <p className="font-mono text-base break-words">{valor}</p>
      {nota && <p className="text-[11px] text-muted">{nota}</p>}
    </div>
  );
}

type TonoChip = "ok" | "riesgo" | "dorado" | "neutro";

const tonos: Record<TonoChip, string> = {
  ok: "bg-ok-bg text-ok-ink",
  riesgo: "bg-bordeaux-soft text-bordeaux",
  dorado: "bg-gold-soft text-gold-ink",
  neutro: "bg-haze text-slate",
};

export function Chip({ tono, children }: { tono: TonoChip; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full px-[9px] py-[3px] text-xs font-semibold ${tonos[tono]}`}>
      {children}
    </span>
  );
}

export function Barra({
  fraccion,
  etiqueta,
  alto = "h-1.5",
}: {
  fraccion: number;
  etiqueta: string;
  alto?: "h-1.5" | "h-2";
}) {
  const pct = Math.round(Math.min(1, Math.max(0, fraccion)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={`${alto} overflow-hidden rounded-full bg-divider`}
    >
      <div className={`${alto} bg-navy`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Contenedor con scroll horizontal para tablas en pantallas angostas. */
export function TablaDesplazable({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className={`-mx-1 overflow-x-auto rounded-md px-1 ${foco}`} tabIndex={0} role="region" aria-label={etiqueta}>
      {children}
    </div>
  );
}
