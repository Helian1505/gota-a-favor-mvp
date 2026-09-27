import Link from "next/link";
import { MarcaCuadro } from "./Marca";
import { foco, transicion } from "./estilos";

const vistas = [
  { href: "/cliente", label: "Cliente" },
  { href: "/recaudador", label: "Recaudador" },
  { href: "/plataforma", label: "Plataforma" },
] as const;

export type Vista = (typeof vistas)[number]["href"];

/** Barra superior de escritorio para moverse entre las vistas del prototipo. */
export function BarraDemo({ actual, className = "" }: { actual: Vista; className?: string }) {
  return (
    <header className={`items-center justify-between gap-6 border-b border-line bg-card/80 px-6 py-3 ${className}`}>
      <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${foco}`}>
        <MarcaCuadro tamano={30} />
        <span className="text-[15px] font-semibold tracking-tight">Gota a favor</span>
      </Link>
      <nav aria-label="Vistas del prototipo" className="flex items-center gap-1 rounded-[10px] border border-line bg-card p-1">
        {vistas.map((v) => {
          const activa = v.href === actual;
          return (
            <Link
              key={v.href}
              href={v.href}
              aria-current={activa ? "page" : undefined}
              className={`flex h-9 items-center rounded-[7px] px-3 text-[13px] font-semibold ${transicion} ${foco} ${
                activa ? "bg-navy text-white" : "text-slate hover:bg-haze"
              }`}
            >
              {v.label}
            </Link>
          );
        })}
      </nav>
      <p className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-ink">Datos de ejemplo</p>
    </header>
  );
}
