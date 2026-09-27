"use client";

import { foco } from "./estilos";

/**
 * Control segmentado al estilo Apple: segmentos de igual ancho sobre una pista
 * gris y una píldora blanca que se desliza al elegido. La píldora solo anima
 * `transform` (250 ms, ease-in-out fuerte), así que no mide nada con JS y el
 * HTML del servidor ya sale en la posición correcta.
 */
export function ControlSegmentado<T extends string>({
  opciones,
  valor,
  onCambio,
  etiqueta,
}: {
  opciones: readonly { id: T; label: string }[];
  valor: T;
  onCambio: (id: T) => void;
  etiqueta: string;
}) {
  const indice = Math.max(
    0,
    opciones.findIndex((o) => o.id === valor),
  );
  return (
    <div
      role="group"
      aria-label={etiqueta}
      className="relative grid w-full rounded-full bg-control/80 p-1 sm:w-auto"
      style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-full bg-card shadow-thumb transition-transform duration-[250ms] ease-in-out motion-reduce:transition-none"
        style={{
          width: `calc((100% - 8px) / ${opciones.length})`,
          transform: `translateX(${indice * 100}%)`,
        }}
      />
      {opciones.map((o) => {
        const activo = o.id === valor;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={activo}
            onClick={() => onCambio(o.id)}
            className={`presionable relative z-10 h-9 rounded-full px-2 text-caption whitespace-nowrap sm:px-4 sm:text-body-sm ${foco} ${
              activo ? "font-semibold text-ink" : "font-medium text-ink-soft hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
