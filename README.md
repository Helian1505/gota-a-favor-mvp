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
  - crédito del día 1 al 4% mensual; crédito de surtido con `tasaSurtido(n) = max(4, 5 − 0,5 × n)` % mensual, donde n son los créditos de surtido pagados a tiempo (el del día 1 no cuenta);
  - pago del recaudador: $900 por visita con tarifa, más 0,3 × 1,5% de la cuota recogida;
  - economía del mes calculada con los valores por cliente del documento (comisiones, cuotas recogidas, impago y costos), con 8,7 recogidas al mes por cliente;
  - arriendo o servicios por abonos, sin crédito y sin interés;
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
- El logo sale del tablero de marca (`referencia-diseno/logo-tablero-marca.png`). `referencia-diseno/extraer-logo.py` recorta solo la gota, le quita el fondo y la pasa a los colores planos de la paleta. El nombre "Gota a favor" (con f minúscula) va en HTML, y el lema es "Tu ahorro, a tu nombre". La gota se usa en el inicio, los encabezados, el favicon y la imagen para compartir.

## Ajustes después de la entrega (27 sep 2026)

Cambios para que las cifras y el mensaje coincidan con el documento entregado:

1. **Logo sin "Crédito que te impulsa".** El lema contradecía el mensaje central (Gota a favor no presta). El inicio ahora usa la gota con el texto "Gota a favor" en HTML y el lema "Tu ahorro, a tu nombre". También se quitaron los PNG del logo completo y se regeneró la imagen para compartir. El nombre se escribe siempre "Gota a favor".
2. **Escalera de tasas 5% → 4,5% → 4%.** Nueva función `tasaSurtido(n)` en `lib/reglas.ts`; el crédito del día 1 no cuenta. Cada cliente tiene el campo `creditosSurtidoPagados`.
   - En /cliente, "Al terminar" ahora dice que el primer crédito de surtido sale al 5% y baja a 4,5% y luego a 4% si se paga a tiempo.
   - En la ficha de /plataforma/clientes, "Próximo crédito de surtido" usa `tasaSurtido` (Marta: 5%).
3. **Arriendo con ejemplo en números.** En /cliente → Primera urgencia → Arriendo o servicios, un arriendo de $400.000 queda en 4 abonos de $100.000, sin crédito y sin interés (`abonosArriendo`).
4. **Nadie guarda plata.** En /plataforma y /plataforma/distribuidores:
   - lo recaudado en pedidos queda "en el bolsillo de cada cliente en el aliado";
   - "el día 15 se le transfiere desde la cuenta del cliente" reemplaza a "el recaudador le paga el día 15".
   - El mismo cambio se hizo en el chat y en el comprobante del recaudador.
5. **Cifras económicas del documento (mes 7, 145 clientes).** `modeloMensual` en `lib/datos.ts` guarda los valores por cliente al mes: aliado $2.706, distribuidor $675, microseguro y facturas $750, y $80.403 en cuotas recogidas. `economiaMes` en `lib/reglas.ts` calcula a partir de ellos:
   - comisiones de $598.995;
   - 739 visitas con tarifa;
   - pago a recaudadores de $717.563 (Ruta 1 $573.332, Ruta 2 $144.231);
   - contribución de $836.522;
   - flujo del mes de ≈ −$8.600.000, con la nota de que el flujo se vuelve positivo en el mes 27.
   - Las pestañas Ruta 1 y Ruta 2 recalculan todo; los costos fijos se asignan por número de clientes.
6. **Detalles menores.** Los enlaces "Inicio", "Cliente" y "Recaudador" de la plataforma pasan de 20 a 32 px de alto, y se agregó esta sección al README.

## Herramientas y tiempo

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Vitest, ESLint, Playwright y Lighthouse.
- Construido con Claude Code en unos 30 minutos, a partir del prompt del Builder Case y de los tres HTML de referencia.
