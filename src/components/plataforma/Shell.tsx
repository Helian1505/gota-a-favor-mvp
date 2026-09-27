"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { rutas, type Ruta } from "@/lib/datos";
import { MarcaCuadro } from "../Marca";
import { foco, transicion } from "../estilos";

type Filtro = "todas" | Ruta["id"];

const filtros: { id: Filtro; label: string }[] = [
  { id: "todas", label: "Todas las rutas" },
  { id: "r1", label: "Ruta 1" },
  { id: "r2", label: "Ruta 2" },
];

export const secciones = [
  { href: "/plataforma", label: "Seguimiento", titulo: "Seguimiento de la operación" },
  { href: "/plataforma/rutas", label: "Rutas", titulo: "Rutas y recaudadores" },
  { href: "/plataforma/clientes", label: "Clientes", titulo: "Clientes" },
  { href: "/plataforma/aliado", label: "Aliado y comisiones", titulo: "Aliado y comisiones" },
  { href: "/plataforma/distribuidores", label: "Distribuidores", titulo: "Distribuidores y pedidos a 15 días" },
] as const;

const pieEscenario = "Datos de ejemplo. Escenario: mes 7, fin del piloto.";

const RutasContexto = createContext<Ruta[]>(rutas);

/** Rutas elegidas en las pestañas. El filtro se mantiene al cambiar de sección. */
export function useRutasSeleccionadas() {
  return useContext(RutasContexto);
}

export function PlataformaShell({ children }: { children: ReactNode }) {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const pathname = usePathname();
  const seccion = secciones.find((s) => s.href === pathname) ?? secciones[0];
  const sel = useMemo(() => (filtro === "todas" ? rutas : rutas.filter((r) => r.id === filtro)), [filtro]);

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[220px] shrink-0 flex-col gap-[22px] border-r border-line bg-card px-4 py-[22px] lg:flex">
        <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${foco}`}>
          <MarcaCuadro tamano={30} />
          <span className="text-[15px] font-semibold tracking-tight">Gota a favor</span>
        </Link>
        <NavSecciones actual={seccion.href} className="flex-col gap-1 text-sm" item="px-2.5 py-2" />
        <div className="mt-auto flex flex-col gap-3">
          <p className="text-xs leading-[1.45] text-muted">{pieEscenario}</p>
          <OtrasVistas />
        </div>
      </aside>

      <div className="flex min-w-0 grow flex-col">
        <header className="flex flex-col gap-3 border-b border-line bg-card px-4 py-3 md:px-7 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${foco}`}>
              <MarcaCuadro tamano={30} />
              <span className="text-[15px] font-semibold tracking-tight">Gota a favor</span>
            </Link>
            <OtrasVistas />
          </div>
          <NavSecciones actual={seccion.href} className="flex-wrap gap-1 text-[13px]" item="px-2.5 py-1.5" />
        </header>

        <main className="flex flex-col gap-[18px] px-4 py-5 md:px-7 md:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted">Cali · piloto</p>
              <h1 className="text-2xl font-semibold tracking-tight">{seccion.titulo}</h1>
            </div>
            <div
              role="group"
              aria-label="Filtrar por ruta"
              className="flex gap-1.5 rounded-[10px] border border-line bg-card p-1"
            >
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                  className={`h-9 rounded-[7px] px-3 text-[13px] font-semibold ${transicion} ${foco} ${
                    filtro === f.id ? "bg-navy text-white hover:bg-navy-deep" : "text-slate hover:bg-haze"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <RutasContexto.Provider value={sel}>{children}</RutasContexto.Provider>

          <p className="text-xs text-muted lg:hidden">{pieEscenario}</p>
        </main>
      </div>
    </div>
  );
}

function NavSecciones({ actual, className, item }: { actual: string; className: string; item: string }) {
  return (
    <nav aria-label="Secciones de la plataforma">
      <ul className={`flex ${className}`}>
        {secciones.map((s) => {
          const activa = s.href === actual;
          return (
            <li key={s.href}>
              <Link
                href={s.href}
                aria-current={activa ? "page" : undefined}
                className={`flex rounded-lg ${item} ${transicion} ${foco} ${
                  activa ? "bg-haze font-semibold text-navy" : "text-slate hover:bg-haze/60 hover:text-navy"
                }`}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function OtrasVistas() {
  const enlace = `rounded-md px-1 py-0.5 text-xs text-muted underline-offset-4 hover:text-navy hover:underline ${transicion} ${foco}`;
  return (
    <nav aria-label="Otras vistas del prototipo" className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <Link href="/" className={enlace}>
        Inicio
      </Link>
      <Link href="/cliente" className={enlace}>
        Cliente
      </Link>
      <Link href="/recaudador" className={enlace}>
        Recaudador
      </Link>
    </nav>
  );
}
