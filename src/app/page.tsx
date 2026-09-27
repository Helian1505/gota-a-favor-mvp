import Link from "next/link";
import { ArrowRight, LayoutDashboard, MessageCircle, Route, type LucideIcon } from "lucide-react";
import { MarcaCuadro, MarcaOscura } from "@/components/Marca";
import { foco, transicion } from "@/components/estilos";

const vistas: { href: string; titulo: string; tipo: string; texto: string; Icono: LucideIcon }[] = [
  {
    href: "/cliente",
    titulo: "Cliente",
    tipo: "Chat de celular",
    texto: "Marta ve su extracto semanal, baja su cuota, pide una emergencia o resuelve su primera urgencia.",
    Icono: MessageCircle,
  },
  {
    href: "/recaudador",
    titulo: "Recaudador",
    tipo: "App de celular",
    texto: "La ruta de hoy: registra visitas, envía comprobantes y cuida el efectivo en mano.",
    Icono: Route,
  },
  {
    href: "/plataforma",
    titulo: "Plataforma",
    tipo: "Tablero de escritorio",
    texto: "El piloto por dentro: seguimiento, rutas, clientes, aliado y comisiones, y distribuidores.",
    Icono: LayoutDashboard,
  },
];

const pasos = [
  { titulo: "Referente", texto: "Un vecino de confianza te presenta y responde con su palabra." },
  { titulo: "Ruta", texto: "El recaudador pasa en tu franja y deja comprobante por WhatsApp." },
  { titulo: "Ahorro a tu nombre", texto: "Lo recogido queda en tu cuenta en el aliado vigilado." },
  { titulo: "Crédito que solo baja", texto: "Tu racha abre crédito regulado; la cuota puede bajar, nunca subir." },
];

export default function Inicio() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-12 px-4 py-6 sm:px-6 md:gap-16 md:py-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <MarcaCuadro tamano={32} />
          <span className="text-[15px] font-semibold tracking-tight">Gota a favor</span>
        </div>
        <p className="hidden rounded-full bg-haze px-3 py-1 text-xs font-semibold text-slate sm:block">MVP navegable</p>
      </header>

      <p role="note" className="-mt-6 rounded-xl border border-gold/30 bg-gold-soft px-4 py-2.5 text-sm text-gold-ink md:-mt-10">
        Prototipo con datos de ejemplo · Builder Case Makers Fellowship · Helian Fierro
      </p>

      <main className="flex flex-col gap-12 md:gap-16">
        <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-gold-ink">Builder Case · Makers Fellowship</p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              El gota a gota al revés.
            </h1>
            <div className="flex max-w-xl flex-col gap-2 text-base leading-relaxed text-muted">
              <p>
                Un recaudador del barrio pasa por tu negocio como el prestamista informal, pero lo que recoge llena{" "}
                <strong className="font-semibold text-ink">tu propio ahorro</strong> en una entidad vigilada.
              </p>
              <p>Gota a favor no presta ni guarda plata: opera la ruta como corresponsal móvil del aliado.</p>
              <p>
                Tu ahorro y la palabra de un referente abren crédito regulado con una{" "}
                <strong className="font-semibold text-ink">cuota que solo puede bajar</strong>.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-card px-6 py-10 text-center shadow-suave sm:flex-row sm:px-8 sm:text-left">
            <MarcaOscura tamano={96} />
            <div className="flex flex-col gap-1.5">
              <p className="text-4xl font-semibold tracking-tight text-navy">Gota a favor</p>
              <p className="text-sm font-medium tracking-wide text-gold-ink">Tu ahorro, a tu nombre</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="vistas-titulo" className="flex flex-col gap-4">
          <h2 id="vistas-titulo" className="text-lg font-semibold tracking-tight">
            Recorre el prototipo
          </h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {vistas.map(({ href, titulo, tipo, texto, Icono }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex h-full flex-col gap-4 rounded-2xl border border-line bg-card p-5 hover:border-navy/40 ${transicion} ${foco}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-haze text-navy">
                      <Icono size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <ArrowRight
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden
                      className="text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-navy"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted">{tipo}</p>
                    <h3 className="text-lg font-semibold tracking-tight">{titulo}</h3>
                    <p className="text-sm leading-relaxed text-muted">{texto}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="mecanismo-titulo" className="flex flex-col gap-4">
          <h2 id="mecanismo-titulo" className="text-lg font-semibold tracking-tight">
            El mecanismo en 4 pasos
          </h2>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="flex flex-col gap-2 bg-card p-5">
                <span className="font-mono text-xs text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold tracking-tight">{p.titulo}</h3>
                <p className="text-sm leading-relaxed text-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">
            La primera urgencia se resuelve cambiando la fecha de pago con quien cobra, el proveedor o el arrendador.
            Solo el efectivo puro va a un crédito pequeño.
          </p>
        </section>
      </main>

      <footer className="mt-auto border-t border-line pt-5">
        <p className="text-sm text-muted">
          Gota a favor no mueve plata real: sin conexión con WhatsApp ni con un aliado, y sin guardar datos.
        </p>
      </footer>
    </div>
  );
}
