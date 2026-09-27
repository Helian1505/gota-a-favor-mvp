/** Clases compartidas para mantener foco visible, alturas y transiciones iguales. */

export const foco =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

export const transicion = "transition-colors duration-150 ease-out";

export const botonPrimario = `inline-flex h-11 items-center justify-center rounded-xl bg-navy px-3 text-sm font-semibold text-white hover:bg-navy-deep disabled:bg-mist disabled:text-muted ${transicion} ${foco}`;

export const botonSecundario = `inline-flex h-11 items-center justify-center rounded-xl border border-sand bg-card px-3.5 text-sm font-semibold text-navy hover:border-navy hover:bg-haze disabled:border-line disabled:text-muted disabled:hover:bg-card ${transicion} ${foco}`;

export const botonOpcion = (activo: boolean) =>
  `inline-flex h-11 items-center justify-center rounded-xl border px-3 text-[13px] font-semibold ${transicion} ${foco} ${
    activo
      ? "border-navy bg-navy text-white hover:bg-navy-deep"
      : "border-sand bg-card text-navy hover:border-navy hover:bg-haze"
  }`;

export const botonDiscreto = `inline-flex h-11 items-center rounded-lg px-1 text-xs text-muted underline-offset-4 hover:text-navy hover:underline ${transicion} ${foco}`;
