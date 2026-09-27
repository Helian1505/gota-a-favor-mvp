import Image from "next/image";
import logoMark from "../../public/marca/logo-mark.png";
import logoMarkLight from "../../public/marca/logo-mark-light.png";

/** Logo de gota en un cuadro navy, como en los encabezados de la referencia. */
export function MarcaCuadro({ tamano = 40, className = "" }: { tamano?: number; className?: string }) {
  const radio = Math.round(tamano * 0.3);
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-navy ${className}`}
      style={{ width: tamano, height: tamano, borderRadius: radio }}
    >
      <Image src={logoMarkLight} alt="" width={Math.round(tamano * 0.7)} height={Math.round(tamano * 0.7)} priority />
    </span>
  );
}

/** Solo la gota, en marfil y dorado, para fondos navy. */
export function MarcaClara({ tamano = 32 }: { tamano?: number }) {
  return <Image src={logoMarkLight} alt="" width={tamano} height={tamano} priority />;
}

/** Solo la gota, en navy y dorado, para fondos claros. */
export function MarcaOscura({ tamano = 32 }: { tamano?: number }) {
  return <Image src={logoMark} alt="" width={tamano} height={tamano} priority />;
}
