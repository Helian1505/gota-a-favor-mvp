import type { Config } from "tailwindcss";

/**
 * Tokens de Gota a favor: estilo Linear/Apple con los colores de las
 * camisetas del FC Versailles 26/27. Nunca uses hex sueltos en componentes.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1B2A4A", // primario (L'Ornement)
        "navy-deep": "#101B33", // hover
        gold: "#B8964E", // acentos, racha, efectivo alto
        "gold-soft": "#F3EAD3", // fondos de chips o avisos dorados
        "gold-ink": "#6E5520", // texto sobre gold-soft
        "gold-on": "#1F1A08", // texto sobre gold
        bordeaux: "#7A1F2B", // alertas y riesgo (Le Pictural)
        "bordeaux-soft": "#F6E7E9", // fondo de compuerta no cumplida
        ivory: "#FAF8F3", // fondo general (Le Lys)
        surface: "#F3F0E8", // tarjetas internas
        card: "#FFFFFF", // tarjetas
        line: "#E6E8EC", // bordes de 1 px
        divider: "#EEF0F3", // separadores internos
        ink: "#0E1726", // texto principal
        muted: "#5A6473", // texto secundario
        slate: "#3A4556", // texto de navegación y filas
        mist: "#E9EBEF", // pistas de barras y chips de fecha
        haze: "#EEF1F6", // chip pendiente y navegación activa
        sand: "#D8CFB8", // borde de botones secundarios
        "on-navy": "#CDD3E0", // texto secundario sobre navy
        "ok-bg": "#E3F1E8",
        "ok-ink": "#1E5B3A",
        "warn-bg": "#FFF4D6",
        "warn-line": "#E9D48A",
        "warn-ink": "#3F3515",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
};

export default config;
