import type { ReactNode } from "react";
import { BarraDemo, type Vista } from "./BarraDemo";

interface Props {
  actual: Vista;
  titulo: string;
  descripcion: string;
  pistas: string[];
  children: ReactNode;
}

/**
 * En celular la vista ocupa toda la pantalla. En escritorio va dentro de un
 * marco de teléfono de 390×844, centrado, con una guía corta al lado.
 */
export function MarcoTelefono({ actual, titulo, descripcion, pistas, children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <BarraDemo actual={actual} className="hidden md:flex" />
      <main className="flex flex-1 items-center justify-center md:gap-14 md:px-6 md:py-6">
        <aside className="hidden w-72 flex-col gap-5 lg:flex">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold tracking-tight">{titulo}</p>
            <p className="text-sm leading-relaxed text-muted">{descripcion}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Qué probar</p>
            <ol className="flex flex-col gap-3">
              {pistas.map((p, i) => (
                <li key={p} className="flex gap-3 text-[13px] leading-snug">
                  <span className="font-mono text-xs text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
        <div className="w-full md:w-auto md:rounded-[46px] md:border md:border-line md:bg-card md:p-2.5 md:shadow-marco">
          <div className="flex h-dvh w-full flex-col overflow-hidden bg-ivory md:h-[min(844px,calc(100dvh-9rem))] md:min-h-[640px] md:w-[390px] md:rounded-[36px] md:border md:border-line">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
