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
 * teléfono de 390×844 con bisel oscuro, como un render de producto sobre la
 * galería blanca, con una guía corta al lado.
 */
export function MarcoTelefono({ actual, titulo, descripcion, pistas, children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col bg-card">
      <BarraDemo actual={actual} className="hidden md:block" />
      <main className="flex flex-1 items-center justify-center md:gap-16 md:px-6 md:py-8">
        <aside className="hidden w-80 flex-col gap-7 lg:flex">
          <div className="flex flex-col gap-3">
            <p className="font-display text-kicker font-semibold text-ink">{titulo}</p>
            <p className="text-body text-muted">{descripcion}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-card bg-mist p-7">
            <p className="text-caption font-semibold text-orange">Qué probar</p>
            <ol className="flex flex-col gap-3.5">
              {pistas.map((p, i) => (
                <li key={p} className="flex gap-3 text-body-sm text-ink">
                  <span className="w-4 shrink-0 font-semibold text-muted tabular-nums">{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
        <div className="w-full md:w-auto md:rounded-[60px] md:bg-ink md:p-3">
          <div className="flex h-dvh w-full flex-col overflow-hidden bg-card md:h-[min(844px,calc(100dvh-8.5rem))] md:min-h-[620px] md:w-[390px] md:rounded-[48px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
