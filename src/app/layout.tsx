import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Sustituto de SF Pro según DESIGN (1); en equipos Apple se usa SF Pro del sistema.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", axes: ["opsz"], display: "swap" });

const urlSitio = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(urlSitio),
  title: {
    default: "Gota a favor · MVP",
    template: "%s · Gota a favor",
  },
  description:
    "El gota a gota al revés: un recaudador del barrio llena el ahorro del propio cliente en una entidad vigilada y abre crédito con una cuota que solo puede bajar. Prototipo con datos de ejemplo.",
  applicationName: "Gota a favor",
  authors: [{ name: "Helian Fierro" }],
  openGraph: {
    title: "Gota a favor · MVP",
    description:
      "El gota a gota al revés. Prototipo navegable para el Builder Case de Makers Fellowship.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} bg-card`}>
      <body className="min-h-dvh bg-card text-ink">{children}</body>
    </html>
  );
}
