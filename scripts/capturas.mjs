// Capturas de todas las rutas en 390×844 y 1440×900 para revisión visual.
// Uso: node scripts/capturas.mjs [urlBase] [carpetaSalida]
// Usa el Chrome o Edge instalado (sin descargar navegadores).
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const salida = process.argv[3] ?? "capturas";
const rutas = [
  "/",
  "/cliente",
  "/recaudador",
  "/plataforma",
  "/plataforma/rutas",
  "/plataforma/clientes",
  "/plataforma/aliado",
  "/plataforma/distribuidores",
];
const tamanos = [
  { nombre: "movil", width: 390, height: 844 },
  { nombre: "escritorio", width: 1440, height: 900 },
];

await mkdir(salida, { recursive: true });
const navegador = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome" });
const errores = [];

for (const t of tamanos) {
  const ctx = await navegador.newContext({
    viewport: { width: t.width, height: t.height },
    deviceScaleFactor: 1,
    isMobile: t.width < 768,
    hasTouch: t.width < 768,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errores.push(`${t.nombre} ${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => errores.push(`${t.nombre} ${page.url()}: ${e.message}`));
  for (const r of rutas) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    // recorre la página para disparar las apariciones al hacer scroll antes de la captura completa
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    const nombre = r === "/" ? "inicio" : r.slice(1).replace("/", "-");
    await page.screenshot({ path: `${salida}/${nombre}-${t.nombre}.png`, fullPage: true });
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    if (ancho > t.width) errores.push(`${t.nombre} ${r}: scroll horizontal (${ancho}px)`);
  }
  await ctx.close();
}

await navegador.close();
console.log(errores.length ? errores.join("\n") : "Sin errores de consola ni scroll horizontal");
