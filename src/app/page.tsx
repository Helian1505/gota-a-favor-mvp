import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BarraDemo } from "@/components/BarraDemo";
import { Logotipo } from "@/components/Marca";
import { Revelador } from "@/components/Revelador";
import { foco, transicion } from "@/components/estilos";
// Importación estática: Next pone un hash de contenido en la URL, así un render nuevo nunca sale de caché.
import renderCliente from "../../public/renders/cliente.png";
import renderPlataforma from "../../public/renders/plataforma.png";
import renderRecaudador from "../../public/renders/recaudador.png";

const vistas = [
  {
    href: "/cliente",
    kicker: "Cliente",
    titulo: "Tu plata, a tu nombre. Por WhatsApp.",
    texto: "Marta ve su extracto semanal, baja su cuota, pide una emergencia o resuelve su primera urgencia.",
    render: renderCliente,
  },
  {
    href: "/recaudador",
    kicker: "Recaudador",
    titulo: "La ruta del barrio, con comprobante.",
    texto: "Registra cada visita, envía el comprobante y cuida el efectivo en mano hasta la tienda-punto.",
    render: renderRecaudador,
  },
  {
    href: "/plataforma",
    kicker: "Plataforma",
    titulo: "El piloto, por dentro.",
    texto: "Seguimiento, rutas, clientes, aliado y comisiones, y distribuidores, con cifras del mes 7.",
    render: renderPlataforma,
  },
] as const;

const pasos = [
  { titulo: "Referente", texto: "Un vecino de confianza te presenta y responde con su palabra." },
  { titulo: "Ruta", texto: "El recaudador pasa en tu franja y deja el comprobante por WhatsApp." },
  { titulo: "Ahorro a tu nombre", texto: "Lo recogido queda en tu cuenta en el aliado vigilado, no en Gota a favor." },
  { titulo: "Crédito que solo baja", texto: "Tu racha abre crédito regulado; la cuota puede bajar, nunca subir." },
];

const enlaceMarca = `inline-flex min-h-11 items-center gap-0.5 rounded-link text-body font-medium text-brand-navy underline-offset-4 hover:underline ${transicion} ${foco}`;

export default function Inicio() {
  return (
    <div className="flex min-h-dvh flex-col bg-card">
      <BarraDemo />
      <Revelador />

      <main>
        {/* Hero: escenario blanco, titular grande y los teléfonos como render de producto */}
        <section className="overflow-hidden px-4 pt-14 text-center sm:px-6 md:pt-20">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-5">
            <p className="text-caption font-semibold text-orange">Prototipo con datos de ejemplo</p>
            <Logotipo tamano="md" />
            <h1 className="font-display text-hero-sm font-semibold text-balance text-ink md:text-hero">
              El gota a gota al revés.
            </h1>
            <div className="flex max-w-[720px] flex-col gap-3 text-body text-muted md:text-kicker md:leading-[1.38]">
              <p>
                Un recaudador del barrio pasa por tu negocio como el prestamista informal, pero lo que recoge llena{" "}
                <span className="text-ink">tu propio ahorro</span> en una entidad vigilada.
              </p>
              <p>
                Gota a favor no presta ni guarda plata: opera la ruta como corresponsal móvil del aliado, y tu ahorro
                abre crédito con una <span className="text-ink">cuota que solo puede bajar</span>.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href="/cliente"
                className={`presionable inline-flex h-11 items-center rounded-full bg-brand-navy px-6 text-body font-medium text-white hover:bg-brand-navy-deep ${foco}`}
              >
                Ver la demo
              </Link>
              <Link href="#mecanismo" className={enlaceMarca}>
                Cómo funciona
                <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
            <p className="text-caption text-muted">Builder Case Makers Fellowship · Helian Fierro</p>
          </div>

          <div className="mx-auto mt-14 flex max-w-[760px] items-end justify-center gap-4 sm:gap-8 md:mt-16">
            <Telefono src={renderRecaudador} alt="" className="hidden translate-y-10 sm:block" />
            <Telefono
              src={renderCliente}
              alt="El chat del cliente: extracto semanal con ahorro, bolsillo arriendo y cuota de la semana"
              prioridad
            />
          </div>
        </section>

        {/* Destacados: banda gris con tarjetas blancas grandes */}
        <section aria-labelledby="vistas-titulo" className="bg-mist px-4 py-20 sm:px-6 md:py-24">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
            <div className="revela flex flex-wrap items-end justify-between gap-4">
              <h2 id="vistas-titulo" className="font-display text-[32px] leading-tight font-semibold md:text-feature">
                Recorre el prototipo.
              </h2>
              <Link href="/cliente" className={enlaceMarca}>
                Empezar por el cliente
                <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-5 lg:grid-cols-3">
              {vistas.map((v) => (
                <li key={v.href} className="revela">
                  <Link
                    href={v.href}
                    className={`group flex h-full flex-col overflow-hidden rounded-card bg-card ${foco}`}
                  >
                    <div className="flex flex-col gap-2 p-7 pb-6">
                      <p className="text-body-sm font-semibold text-ink">{v.kicker}</p>
                      <h3 className="font-display text-feature-sm font-semibold text-ink">{v.titulo}</h3>
                      <p className="text-body text-muted">{v.texto}</p>
                      <span className="mt-1 inline-flex items-center gap-0.5 text-body font-medium text-brand-navy group-hover:underline">
                        Abrir
                        <ChevronRight size={18} strokeWidth={1.75} aria-hidden />
                      </span>
                    </div>
                    <div className="relative mt-auto h-64 overflow-hidden">
                      <Image
                        src={v.render}
                        alt=""
                        sizes="(min-width: 1024px) 380px, 90vw"
                        className={
                          v.href === "/plataforma"
                            ? "absolute top-2 left-7 w-[640px] max-w-none rounded-tl-[14px] shadow-subtle transition-transform duration-500 ease-out group-hover:-translate-y-1"
                            : "absolute top-0 left-1/2 w-[240px] -translate-x-1/2 rounded-t-[32px] border-[6px] border-b-0 border-ink transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        }
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Editorial: el mecanismo */}
        <section id="mecanismo" aria-labelledby="mecanismo-titulo" className="scroll-mt-16 px-4 py-20 sm:px-6 md:py-28">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-12">
            <div className="revela flex max-w-[760px] flex-col gap-4">
              <p className="font-display text-kicker font-semibold text-orange">El mecanismo</p>
              <h2 id="mecanismo-titulo" className="font-display text-[32px] leading-tight font-semibold md:text-hero-sm">
                Cuatro pasos. Tu plata nunca se queda con nosotros.
              </h2>
              <p className="text-body text-muted">
                La primera urgencia se resuelve cambiando la fecha de pago con quien cobra, el proveedor o el
                arrendador. Solo el efectivo puro va a un crédito pequeño.
              </p>
            </div>
            <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {pasos.map((p, i) => (
                <li key={p.titulo} className="revela flex flex-col gap-2 border-t border-line pt-5">
                  <span className="text-body-sm font-semibold text-muted tabular-nums">0{i + 1}</span>
                  <h3 className="font-display text-kicker font-semibold text-ink">{p.titulo}</h3>
                  <p className="text-body text-muted">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Cierre: la marca */}
        <section aria-label="Gota a favor" className="bg-mist px-4 py-20 sm:px-6 md:py-24">
          <div className="revela mx-auto flex max-w-[980px] flex-col items-center gap-8 text-center">
            <Logotipo tamano="lg" lema />
            <Link
              href="/plataforma"
              className={`presionable inline-flex h-11 items-center rounded-full border border-steel px-6 text-body text-ink hover:border-ink hover:bg-card ${foco}`}
            >
              Ver la plataforma del piloto
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-mist px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-1.5 text-caption text-muted sm:flex-row sm:justify-between">
          <p>Prototipo con datos de ejemplo · Builder Case Makers Fellowship · Helian Fierro</p>
          <p>Gota a favor no mueve plata real: sin conexión con WhatsApp ni con un aliado, y sin guardar datos.</p>
        </div>
      </footer>
    </div>
  );
}

/** Teléfono como render de producto: bisel oscuro y la captura de la vista. */
function Telefono({
  src,
  alt,
  className = "",
  prioridad = false,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  prioridad?: boolean;
}) {
  return (
    <div className={`w-[236px] shrink-0 rounded-[44px] bg-ink p-2 sm:w-[270px] sm:rounded-[50px] sm:p-2.5 ${className}`}>
      <Image
        src={src}
        alt={alt}
        priority={prioridad}
        sizes="270px"
        className="h-auto w-full rounded-[36px] sm:rounded-[41px]"
      />
    </div>
  );
}
