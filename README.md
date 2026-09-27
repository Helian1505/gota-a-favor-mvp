# Gota a favor · MVP

Prototipo navegable para el **Builder Case de Makers Fellowship** · Helian Fierro.

## Qué es

Gota a favor es **el gota a gota al revés**. Un recaudador del barrio pasa por el micronegocio como pasa el prestamista informal, pero lo que recoge llena el **ahorro del propio cliente** en una entidad vigilada (el "aliado"). Gota a favor **no presta ni guarda plata**: opera la ruta como **corresponsal móvil** del aliado.

El ahorro y la palabra de un referente del barrio abren crédito regulado con una **cuota que solo puede bajar**. La primera urgencia se resuelve **cambiando la fecha de pago con quien cobra** (el proveedor o el arrendador), y solo el efectivo puro va a un crédito pequeño.

Todo el MVP usa **datos de ejemplo**.

## Rutas

| Ruta | Qué muestra |
|---|---|
| `/` | El proyecto en 3 líneas, las tres vistas y el mecanismo en 4 pasos: Referente → Ruta → Ahorro a tu nombre → Crédito que solo baja. |
| `/cliente` | Chat tipo WhatsApp de Marta: extracto semanal, bajar cuota, emergencia, "al terminar" y primera urgencia (pedido, arriendo o efectivo). |
| `/recaudador` | La ruta de hoy: 6 clientes de la referencia más una visita de pedido a 15 días, comprobantes, pago del recaudador y efectivo en mano con tope. |
| `/plataforma` | Seguimiento del piloto: indicadores, rutas y referentes, comisiones, pedidos a 15 días, compuertas y alertas. |
| `/plataforma/rutas` | Cada ruta con sus indicadores, el camino a 400 clientes (contrato laboral), el pago estimado del recaudador y la ruta de hoy. |
| `/plataforma/clientes` | Muestra de 12 clientes con búsqueda, filtros y una ficha con tasa, cuota mínima, botón de emergencia y próximo crédito. |
| `/plataforma/aliado` | Quién hace qué, comisiones del mes por fuente, economía de la operación y tasas del aliado. |
| `/plataforma/distribuidores` | Distribuidores y pedidos a 15 días: recogidas por visita, lo recaudado y el pago del día 15. |

Las pestañas Todas las rutas / Ruta 1 / Ruta 2 recalculan cada sección, y el filtro se mantiene al pasar de una sección a otra.

## Cómo correrlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # reglas de negocio con Vitest
npm run lint
npm run build
```

Capturas de las cuatro rutas en 390×844 y 1440×900 (usa el Chrome instalado):

```bash
node scripts/capturas.mjs http://localhost:3000 capturas
```

## Qué hace hoy

- Recorre las tres vistas con navegación completa en celular y escritorio (en escritorio, las vistas de celular van dentro de un marco de 390×844).
- Aplica las reglas de negocio de `src/lib/reglas.ts`, cubiertas por pruebas:
  - tarifa de recogida de $1.500 solo si el ahorro es de $20.000 o más (la cuota nunca paga tarifa);
  - cuota mínima del 50%, con la diferencia corrida al final del plazo y su interés a la tasa semanal equivalente;
  - crédito del día 1 al 4% mensual; créditos productivos del 5% que bajan 0,5 puntos por crédito pagado a tiempo, hasta 4%;
  - pago del recaudador: $900 por visita con tarifa, más 0,3 × 1,5% de la cuota recogida;
  - efectivo en mano con tope de $500.000, barra dorada al pasar el 60% y aviso desde $300.000;
  - botón de emergencia con racha de 8 semanas o más, entre $150.000 y $300.000;
  - una ruta pasa a contrato laboral al llegar a 400 clientes;
  - pedido al proveedor dividido en recogidas y pagado al distribuidor el día 15.
- Recalcula la plataforma completa al cambiar de ruta, incluidas las compuertas del piloto.
- Navega las cinco secciones de la plataforma, cada una con su propia URL.
- Accesibilidad: Lighthouse 100 en las cuatro rutas, en celular y escritorio.

## Qué todavía no hace

- **No conecta con WhatsApp** ni envía comprobantes reales.
- **No conecta con un aliado**: no hay cuentas, cartera ni evaluación de crédito reales.
- **No mueve dinero**: los montos, aprobaciones y consignaciones son simulados.
- **No guarda datos**: todo vive en el estado de React y se reinicia al recargar la página.
- No tiene inicio de sesión ni roles, y la plataforma no edita datos: solo los muestra.

## Estructura

```
src/
  app/                 rutas (/, /cliente, /recaudador, /plataforma), íconos y metadatos
  components/          marca (logo), marco de teléfono, chat, ruta y plataforma (una vista por sección)
  lib/
    reglas.ts          reglas de negocio (con reglas.test.ts)
    resumen.ts         cálculos de la ruta, del tablero y de las secciones (con resumen.test.ts)
    datos.ts           datos de ejemplo
    formato.ts         moneda colombiana: $23.245
referencia-diseno/     HTML de diseño aprobados, tablero de marca y script que extrae el logo
public/marca/          logo en PNG transparente (navy y marfil)
```

## Diseño

- Estilo Linear/Apple con los colores de las camisetas del FC Versailles 26/27. Los tokens están en `tailwind.config.ts` (`navy`, `gold`, `bordeaux`, `ivory`…) y ningún componente usa hex sueltos.
- Geist y Geist Mono (paquete `geist`); los números siempre van en Geist Mono. Íconos de `lucide-react` con trazo 1,75.
- El logo sale del tablero de marca (`referencia-diseno/logo-tablero-marca.png`). `referencia-diseno/extraer-logo.py` lo recorta, le quita el fondo y lo pasa a los colores planos de la paleta. Se usa en el inicio, los encabezados, el favicon y la imagen para compartir.

## Herramientas y tiempo

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Vitest, ESLint, Playwright y Lighthouse.
- Construido con Claude Code en unos 30 minutos, a partir del prompt del Builder Case y de los tres HTML de referencia.
