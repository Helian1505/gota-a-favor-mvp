/**
 * Clases compartidas, según DESIGN (1): botones en píldora, azul solo para
 * acciones y enlaces, foco visible en azul. "presionable" (globals.css) da la
 * respuesta al presionar: escala 0,97 al bajar el dedo.
 */

export const foco =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card";

export const transicion = "transition-colors duration-150 ease-out";

/** Píldora azul de acción (Pricing Blue). */
export const botonPrimario = `presionable inline-flex h-11 items-center justify-center rounded-full bg-blue-fill px-5 text-[15px] font-medium text-white hover:bg-blue-deep disabled:bg-control disabled:text-muted ${foco}`;

/** Píldora con contorno (Outlined Explore Pill): sin relleno de color. */
export const botonSecundario = `presionable inline-flex h-11 items-center justify-center rounded-full border border-steel bg-card px-4 text-[15px] font-medium text-ink hover:border-ink hover:bg-mist disabled:border-line disabled:text-muted disabled:hover:bg-card ${foco}`;

/** Opción elegible dentro de una respuesta: se rellena en azul al elegirla. */
export const botonOpcion = (activo: boolean) =>
  `presionable inline-flex h-11 items-center justify-center rounded-full border px-4 text-[15px] font-medium ${foco} ${
    activo
      ? "border-blue-fill bg-blue-fill text-white hover:bg-blue-deep"
      : "border-steel bg-card text-ink hover:border-ink hover:bg-mist"
  }`;

/** Enlace de texto azul (Apple Blue), con área táctil de 44 px. */
export const botonDiscreto = `inline-flex h-11 items-center rounded-link px-1 text-body-sm text-blue underline-offset-4 hover:underline ${transicion} ${foco}`;

/** Variantes compactas (14 px) para filas con dos botones en el ancho de un celular. */
export const botonPrimarioCompacto = `presionable inline-flex h-11 items-center justify-center rounded-full bg-blue-fill px-4 text-body-sm font-medium whitespace-nowrap text-white hover:bg-blue-deep disabled:bg-control disabled:text-muted ${foco}`;

export const botonSecundarioCompacto = `presionable inline-flex h-11 items-center justify-center rounded-full border border-steel bg-card px-3.5 text-body-sm font-medium whitespace-nowrap text-ink hover:border-ink hover:bg-mist disabled:border-line disabled:text-muted disabled:hover:bg-card ${foco}`;
