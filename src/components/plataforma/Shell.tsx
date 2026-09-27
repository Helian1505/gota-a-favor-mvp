"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { rutas, type Ruta } from "@/lib/datos";
import { ControlSegmentado } from "../ControlSegmentado";
import { Logotipo } from "../Marca";
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
    <div className="flex min-h-dvh bg-mist">
      <aside className="sticky top-0 hidden h-dvh w-[220px] shrink-0 flex-col gap-7 border-r border-black/[0.06] bg-frost px-4 py-6 lg:flex">
        <Link href="/" aria-label="Gota a favor, inicio" className={`flex h-11 items-center rounded-link px-2 ${foco}`}>
          <Logotipo tamano="md" />
        </Link>
        <NavSecciones actual={seccion.href} className="flex-col gap-0.5 text-body-sm" item="px-3 py-2.5" />
        <div className="mt-auto flex flex-col gap-3 px-2">
          <p className="text-caption text-muted">{pieEscenario}</p>
          <OtrasVistas />
        </div>
      </aside>

      <div className="flex min-w-0 grow flex-col">
        <header className="material sticky top-0 z-20 flex flex-col gap-1 border-b border-black/[0.06] px-4 pt-1 pb-2 md:px-8 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Gota a favor, inicio" className={`flex h-11 items-center rounded-link ${foco}`}>
              <Logotipo tamano="sm" />
            </Link>
            <OtrasVistas />
          </div>
          <NavSecciones actual={seccion.href} className="flex-wrap gap-1 text-body-sm" item="px-3 py-2" />
        </header>

        <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-5 px-4 py-6 md:px-8 md:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-body text-muted">Cali · piloto</p>
              <h1 className="font-display text-[32px] leading-[1.1] font-semibold tracking-tight md:text-feature">
                {seccion.titulo}
              </h1>
            </div>
            <ControlSegmentado opciones={filtros} valor={filtro} onCambio={setFiltro} etiqueta="Filtrar por ruta" />
          </div>

          <RutasContexto.Provider value={sel}>{children}</RutasContexto.Provider>

          <p className="text-caption text-muted lg:hidden">{pieEscenario}</p>
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
                className={`flex rounded-link ${item} ${transicion} ${foco} ${
                  activa ? "bg-control/70 font-semibold text-ink" : "text-ink-soft hover:bg-control/40 hover:text-ink"
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
  const enlace = `inline-flex min-h-8 items-center rounded-link px-1.5 py-1.5 text-caption font-medium text-brand-navy underline-offset-4 hover:underline ${transicion} ${foco}`;
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
