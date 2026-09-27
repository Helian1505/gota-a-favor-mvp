// Genera los "renders de producto" del inicio a partir de las vistas reales.
// Uso: node scripts/renders.mjs [urlBase]   (con el servidor corriendo)
// Salida: public/renders/{cliente,recaudador,plataforma}.png
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const salida = "public/renders";
await mkdir(salida, { recursive: true });

const navegador = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome" });
const listo = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600); // deja terminar las transiciones de entrada
};

// Teléfonos: 390×844 a 2x, la vista ocupa toda la pantalla.
const telefono = await navegador.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const p = await telefono.newPage();

await p.goto(`${base}/cliente`, { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Bajar cuota" }).click();
await listo(p);
await p.getByRole("log").evaluate((el) => (el.scrollTop = 150));
await p.screenshot({ path: `${salida}/cliente.png` });

await p.goto(`${base}/recaudador`, { waitUntil: "networkidle" });
const registrar = p.getByRole("button", { name: "Registrar y enviar comprobante" });
await registrar.first().click();
await registrar.first().click();
await listo(p);
await p.getByRole("list", { name: "Clientes de la ruta" }).evaluate((el) => (el.scrollTop = 0));
await p.screenshot({ path: `${salida}/recaudador.png` });
await telefono.close();

// Plataforma: escritorio de 1280×800 a 1,5x.
const escritorio = await navegador.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1.5,
  reducedMotion: "reduce",
});
const e = await escritorio.newPage();
await e.goto(`${base}/plataforma`, { waitUntil: "networkidle" });
await listo(e);
await e.screenshot({ path: `${salida}/plataforma.png` });

await navegador.close();
console.log("renders listos en", salida);
