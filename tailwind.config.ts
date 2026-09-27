import type { Config } from "tailwindcss";

/**
 * Tokens de Gota a favor, según DESIGN (1): galería blanca estilo Apple.
 * Lienzo blanco, bandas #f5f5f7 y texto #1d1d1f. El color de acción es el
 * navy de la marca (no el azul genérico del DESIGN) y el dorado queda para
 * acentos de marca. Nunca hex sueltos en los componentes.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Superficies
        card: "#ffffff", // Gallery White: lienzo y tarjetas
        mist: "#f5f5f7", // Studio Mist: bandas, fondos de app y tiles internos
        frost: "#fafafc", // Paper Frost: navegación abierta
        control: "#e6e6e8", // Control Gray: pistas de barras, controles apagados
        line: "#d6d6d6", // Hairline Silver: bordes de 1 px
        divider: "#e8e8ed", // separadores dentro de tarjetas
        // Texto
        ink: "#1d1d1f", // titulares y cuerpo
        "ink-soft": "#424245", // navegación y filas (≈ negro al 80%)
        muted: "#707070", // Slate: texto secundario
        steel: "#86868b", // contornos de píldoras y entradas
        "on-dark": "#a1a1a6", // texto secundario sobre fondo oscuro
        // Estados
        orange: "#b64400", // Launch Orange: etiquetas de estado
        "orange-soft": "#fff3eb",
        "orange-line": "#f2c7a5",
        green: "#1d7a35",
        "green-soft": "#e8f5eb",
        red: "#c4001a",
        "red-soft": "#fdecee",
        // Marca (logo). El navy es el color de acción: botones, enlaces,
        // burbujas del usuario, barras de avance y foco.
        "brand-navy": "#13294b",
        "brand-navy-deep": "#0b1a33", // hover y presión de los botones navy
        gold: "#c29a5b", // punto de la gota y barra de efectivo alta
        "gold-text": "#8a6530", // "favor" del logotipo en texto (contraste AA)
      },
      fontFamily: {
        // SF Pro en equipos Apple; Inter (sustituto del DESIGN) en los demás
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "var(--font-inter)",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "var(--font-inter)",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // Escala del DESIGN: tamaño, interlineado y tracking van juntos
        caption: ["12px", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "body-sm": ["14px", { lineHeight: "1.43", letterSpacing: "-0.016em" }],
        body: ["17px", { lineHeight: "1.47", letterSpacing: "-0.022em" }],
        "nav-title": ["19px", { lineHeight: "1.21", letterSpacing: "0.012em" }],
        kicker: ["21px", { lineHeight: "1.19", letterSpacing: "0.011em" }],
        "feature-sm": ["28px", { lineHeight: "1.14", letterSpacing: "0.007em" }],
        feature: ["40px", { lineHeight: "1.1", letterSpacing: "0" }],
        "hero-sm": ["48px", { lineHeight: "1.08", letterSpacing: "-0.003em" }],
        hero: ["80px", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        tight: "-0.015em",
      },
      borderRadius: {
        card: "28px", // tarjetas e imágenes
        tile: "18px", // tiles dentro de tarjetas
        nav: "20px",
        link: "10px",
      },
      boxShadow: {
        // El DESIGN no usa sombras: solo contornos de 1 px en controles elegidos
        subtle: "0 0 0 1px #e6e6e8",
        "subtle-2": "0 0 0 1px #86868b",
        thumb: "0 0 0 0.5px rgba(0, 0, 0, 0.04), 0 3px 8px rgba(0, 0, 0, 0.12)",
      },
      transitionTimingFunction: {
        // Curvas de Emil Kowalski: fuertes, nunca ease-in en UI
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
};

export default config;
