import { GOTA_PUNTO, GOTA_TRAZO } from "./gota-trazo";

type Variante = "color" | "clara";

/**
 * La gota de Gota a favor, en vector: dos trazos navy que abrazan un punto
 * dorado. "clara" pinta los trazos en blanco para fondos oscuros.
 */
export function Gota({ tamano = 32, variante = "color", className = "" }: { tamano?: number; variante?: Variante; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={tamano}
      height={tamano}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      <path d={GOTA_TRAZO} className={variante === "clara" ? "fill-white" : "fill-brand-navy"} />
      <circle {...GOTA_PUNTO} className="fill-gold" />
    </svg>
  );
}

const tamanos = {
  sm: { gota: 22, texto: "text-[17px]", lema: "" },
  md: { gota: 28, texto: "text-[19px]", lema: "" },
  lg: { gota: 104, texto: "text-[48px] sm:text-[60px]", lema: "text-caption" },
} as const;

/**
 * Logotipo: la gota y el nombre con la tipografía del DESIGN (SF Pro / Inter).
 * "Gota a" en navy y "favor" en dorado, como en la propuesta 3; siempre con f
 * minúscula. El lema es opcional.
 */
export function Logotipo({
  tamano = "sm",
  lema = false,
  variante = "color",
  className = "",
}: {
  tamano?: keyof typeof tamanos;
  lema?: boolean;
  variante?: Variante;
  className?: string;
}) {
  const t = tamanos[tamano];
  const grande = tamano === "lg";
  const favor = variante === "clara" ? "text-gold" : "text-gold-text";
  const nombre = `font-display font-semibold whitespace-nowrap ${t.texto} ${
    variante === "clara" ? "text-white" : "text-brand-navy"
  }`;
  const textoLema = (
    <span
      className={`font-medium tracking-[0.22em] whitespace-nowrap uppercase ${t.lema} ${
        variante === "clara" ? "text-on-dark" : "text-ink-soft"
      }`}
    >
      Tu ahorro, a tu nombre
    </span>
  );

  // Versión grande apilada, como la propuesta 3: gota a la izquierda, nombre en dos líneas y lema debajo.
  if (grande) {
    return (
      <span className={`inline-flex flex-col items-center gap-5 ${className}`}>
        <span className="inline-flex items-center gap-4 sm:gap-5">
          <Gota tamano={t.gota} variante={variante} />
          <span className={`flex flex-col leading-[0.95] tracking-[-0.025em] ${nombre}`}>
            <span>Gota a</span>
            <span className={favor}>favor</span>
          </span>
        </span>
        {lema && textoLema}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Gota tamano={t.gota} variante={variante} />
      <span className="flex flex-col gap-1">
        <span className={`leading-none tracking-[-0.01em] ${nombre}`}>
          Gota a <span className={favor}>favor</span>
        </span>
        {lema && textoLema}
      </span>
    </span>
  );
}

/** La gota en un círculo, como avatar del chat. */
export function MarcaAvatar({ tamano = 40 }: { tamano?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-mist"
      style={{ width: tamano, height: tamano }}
    >
      <Gota tamano={Math.round(tamano * 0.62)} />
    </span>
  );
}
