"use client";

import { useEffect } from "react";

/**
 * Aparición al hacer scroll para la página de presentación (nunca en la UI de
 * uso diario). Se dispara una sola vez por elemento. Sin JS o con movimiento
 * reducido todo queda visible: solo se ocultan los elementos que aún no se ven
 * y justo antes de observarlos, así no hay parpadeo arriba del pliegue.
 */
export function Revelador() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elementos = Array.from(document.querySelectorAll<HTMLElement>(".revela"));
    const alto = window.innerHeight;
    for (const el of elementos) {
      if (el.getBoundingClientRect().top < alto) el.dataset.visible = "";
    }
    document.documentElement.classList.add("revela-activo");

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.visible = "";
          observador.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of elementos) if (!("visible" in el.dataset)) observador.observe(el);
    return () => {
      observador.disconnect();
      document.documentElement.classList.remove("revela-activo");
    };
  }, []);
  return null;
}
