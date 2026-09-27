import Link from "next/link";
import { Logotipo } from "./Marca";
import { foco, transicion } from "./estilos";

const vistas = [
  { href: "/cliente", label: "Cliente" },
  { href: "/recaudador", label: "Recaudador" },
  { href: "/plataforma", label: "Plataforma" },
] as const;

export type Vista = (typeof vistas)[number]["href"];

/**
 * Navegación global, como la de DESIGN (1): 44 px de alto, material
 * translúcido que deja ver el contenido al hacer scroll y enlaces de 12 px.
 */
export function BarraDemo({ actual, className = "" }: { actual?: Vista; className?: string }) {
  return (
    <header className={`material sticky top-0 z-30 border-b border-black/[0.06] ${className}`}>
      <div className="mx-auto flex h-11 max-w-[1024px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Gota a favor, inicio" className={`flex h-11 items-center rounded-link ${foco}`}>
          <Logotipo tamano="sm" />
        </Link>
        <nav aria-label="Vistas del prototipo" className="flex items-center">
          {vistas.map((v) => {
            const activa = v.href === actual;
            return (
              <Link
                key={v.href}
                href={v.href}
                aria-current={activa ? "page" : undefined}
                className={`flex h-11 items-center rounded-link px-2 text-caption sm:px-3 ${transicion} ${foco} ${
                  activa ? "font-medium text-ink" : "text-ink/80 hover:text-ink"
                }`}
              >
                {v.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
