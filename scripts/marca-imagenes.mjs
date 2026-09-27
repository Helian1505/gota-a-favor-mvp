// Genera íconos e imagen para compartir desde la gota vectorial (src/components/gota-trazo.ts).
// Uso: node scripts/marca-imagenes.mjs   → src/app/{icon.png,apple-icon.png,opengraph-image.png}
// y public/marca/favicon-{16,32,48}.png (se combinan en favicon.ico con Python/PIL).
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const fuente = readFileSync("src/components/gota-trazo.ts", "utf8");
const d = fuente.match(/GOTA_TRAZO =\s*"([^"]+)"/)[1];
const [, cx, cy, r] = fuente.match(/cx: ([\d.]+), cy: ([\d.]+), r: ([\d.]+)/);
const NAVY = "#13294b";
const GOLD = "#c29a5b";
const GOLD_TEXTO = "#8a6530";
const gota = (t) =>
  `<svg viewBox="0 0 100 100" width="${t}" height="${t}"><path fill="${NAVY}" d="${d}"/><circle fill="${GOLD}" cx="${cx}" cy="${cy}" r="${r}"/></svg>`;

const navegador = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "chrome" });
const pagina = await navegador.newPage();

async function captura(html, ancho, alto, ruta, transparente = false) {
  await pagina.setViewportSize({ width: ancho, height: alto });
  await pagina.setContent(
    `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,500;14..32,600&display=swap"></head>
     <body style="margin:0;width:${ancho}px;height:${alto}px;display:flex;align-items:center;justify-content:center;background:${transparente ? "transparent" : "#fff"};font-family:Inter,sans-serif">${html}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: ruta, omitBackground: transparente });
}

// Ícono: la gota sobre un cuadrado blanco redondeado (se lee en pestañas claras y oscuras).
const icono = (t, radio) =>
  `<div style="width:${t}px;height:${t}px;border-radius:${radio}px;background:#fff;display:flex;align-items:center;justify-content:center">${gota(Math.round(t * 0.78))}</div>`;
await captura(icono(512, 112), 512, 512, "src/app/icon.png", true);
await captura(icono(180, 0), 180, 180, "src/app/apple-icon.png");
mkdirSync("public/marca", { recursive: true });
for (const t of [16, 32, 48]) await captura(icono(t, Math.round(t * 0.22)), t, t, `public/marca/favicon-${t}.png`, true);

// Imagen para compartir: logotipo apilado como la propuesta 3, con el lema.
await captura(
  `<div style="display:flex;flex-direction:column;align-items:center;gap:36px">
     <div style="display:flex;align-items:center;gap:32px">
       ${gota(190)}
       <div style="display:flex;flex-direction:column;font-weight:600;font-size:108px;line-height:0.95;letter-spacing:-0.025em;color:${NAVY}">
         <span>Gota a</span><span style="color:${GOLD_TEXTO}">favor</span>
       </div>
     </div>
     <div style="font-weight:500;font-size:24px;letter-spacing:0.22em;color:#424245">TU AHORRO, A TU NOMBRE</div>
   </div>`,
  1200,
  630,
  "src/app/opengraph-image.png",
);

await navegador.close();
console.log("imágenes de marca listas");
