const pesosFmt = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
  useGrouping: "always",
});

const decimalFmt = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 1,
  useGrouping: "always",
});

/** Moneda colombiana sin decimales: 23245 → "$23.245". */
export function pesos(valor: number): string {
  const n = Math.round(valor);
  return (n < 0 ? "-$" : "$") + pesosFmt.format(Math.abs(n));
}

/** Porcentaje entero: 0.586 → "59%". */
export function porcentaje(fraccion: number): string {
  return `${Math.round(fraccion * 100)}%`;
}

/** Tasa con un decimal: 0.045 → "4,5%". */
export function tasa(fraccion: number): string {
  return `${decimalFmt.format(Math.round(fraccion * 1000) / 10)}%`;
}

/** Número con coma decimal: 6.4 → "6,4". */
export function decimal(valor: number): string {
  return decimalFmt.format(valor);
}
