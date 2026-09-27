"use client";

import { clientesRuta, metasPiloto } from "@/lib/datos";
import { decimal, pesos, porcentaje } from "@/lib/formato";
import { calcularVisita, economiaPlataforma } from "@/lib/resumen";
import { ALERTA_EFECTIVO, CLIENTES_RUTA_FORMAL, rutaFormal, TOPE_EFECTIVO } from "@/lib/reglas";
import { useRutasSeleccionadas } from "./Shell";
import { Barra, Chip, EncabezadoTarjeta, Mini, TablaDesplazable, Tarjeta } from "./ui";

export function Rutas() {
  const sel = useRutasSeleccionadas();
  const economia = economiaPlataforma(sel);
  const incluyeRuta1 = sel.some((r) => r.id === "r1");

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {sel.map((r) => {
          const formal = rutaFormal(r.clientes);
          const pago = economia.porRuta.find((p) => p.id === r.id);
          return (
            <Tarjeta key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-[15px] font-semibold">{r.ruta}</h2>
                  <p className="text-xs text-muted">
                    {r.referente} · {r.recaudador}
                  </p>
                  <p className="text-xs text-muted">Franja: {r.franja}</p>
                </div>
                <Chip tono="dorado">Corresponsal</Chip>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Mini titulo="Clientes" valor={String(r.clientes)} />
                <Mini titulo="Pagan recogida" valor={porcentaje(r.pagaRecogida)} />
                <Mini titulo="Impago cr. 1" valor={porcentaje(r.impagoCredito1)} />
                <Mini
                  titulo="Min. por visita"
                  valor={decimal(r.minutosVisita)}
                  nota={r.minutosVisita <= metasPiloto.minutosMax ? "dentro de la meta" : "sobre la meta de 7"}
                />
                <Mini titulo="Ahorro" valor={pesos(r.ahorro)} />
                <Mini titulo="Cartera" valor={pesos(r.cartera)} />
                <Mini titulo="Capital de trabajo" valor={pesos(r.capitalTrabajo)} />
                <Mini titulo="Racha 8+" valor={String(r.racha8)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Barra fraccion={formal.progreso} etiqueta={`${r.ruta}: hacia empleo formal`} />
                <p className="text-xs text-muted">
                  {r.clientes} de {CLIENTES_RUTA_FORMAL} clientes ·{" "}
                  {formal.formal
                    ? "el recaudador ya tiene contrato laboral"
                    : `faltan ${formal.faltan} para el contrato laboral del recaudador`}
                </p>
              </div>

              {pago && (
                <div className="flex flex-col gap-1 border-t border-divider pt-2.5 text-[13px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-muted">Pago estimado del recaudador este mes</span>
                    <span className="font-mono font-semibold">{pesos(pago.pagoRecaudador)}</span>
                  </div>
                  <p className="text-xs text-muted">
                    $900 × {pago.visitasConTarifa} visitas con tarifa, más el 30% del 1,5% de{" "}
                    {pesos(pago.cuotasRecogidas)} en cuotas recogidas.
                  </p>
                </div>
              )}
            </Tarjeta>
          );
        })}
      </div>

      {incluyeRuta1 && <RutaDeHoy />}
    </>
  );
}

function RutaDeHoy() {
  const visitas = clientesRuta.map((c) => calcularVisita(c, "ok"));
  const total = visitas.reduce((a, v) => a + v.totalVisita, 0);
  const pago = visitas.reduce((a, v) => a + v.pago, 0);
  const tarifas = visitas.reduce((a, v) => a + v.tarifa, 0);

  return (
    <Tarjeta>
      <EncabezadoTarjeta
        titulo="Ruta de hoy · Ruta 1, franja 10:00–12:00"
        enlace={{ href: "/recaudador", label: "Abrir vista del recaudador" }}
      />
      <TablaDesplazable etiqueta="Visitas de hoy en la Ruta 1">
        <table className="w-full min-w-[620px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-divider text-xs text-muted">
              <th scope="col" className="py-1.5 pr-2 font-normal">Cliente</th>
              <th scope="col" className="py-1.5 pr-2 text-right font-normal">Cuota</th>
              <th scope="col" className="py-1.5 pr-2 text-right font-normal">Ahorro</th>
              <th scope="col" className="py-1.5 pr-2 text-right font-normal">Tarifa</th>
              <th scope="col" className="py-1.5 pr-2 text-right font-normal">Entra en mano</th>
              <th scope="col" className="py-1.5 text-right font-normal">Pago recaudador</th>
            </tr>
          </thead>
          <tbody>
            {visitas.map((v) => (
              <tr key={v.cliente.id} className="border-b border-divider">
                <th scope="row" className="py-2 pr-2 text-left font-normal">
                  <span className="block font-semibold">{v.cliente.nombre}</span>
                  <span className="block text-xs text-muted">
                    {v.cliente.pedido
                      ? `Pedido a 15 días · cuota ${v.cliente.pedido.cuotaNumero} de ${v.cliente.pedido.totalCuotas}`
                      : v.cliente.negocio}
                  </span>
                </th>
                <td className="py-2 pr-2 text-right font-mono">{v.cliente.cuota ? pesos(v.cliente.cuota) : "—"}</td>
                <td className="py-2 pr-2 text-right font-mono">{v.cliente.ahorro ? pesos(v.cliente.ahorro) : "—"}</td>
                <td className="py-2 pr-2 text-right font-mono">{v.tarifa ? pesos(v.tarifa) : "—"}</td>
                <td className="py-2 pr-2 text-right font-mono">{pesos(v.totalVisita)}</td>
                <td className="py-2 text-right font-mono">{pesos(v.pago)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <th scope="row" className="py-2 pr-2 text-left">
                Total si registra todas
              </th>
              <td className="py-2 pr-2" />
              <td className="py-2 pr-2" />
              <td className="py-2 pr-2 text-right font-mono">{pesos(tarifas)}</td>
              <td className="py-2 pr-2 text-right font-mono">{pesos(total)}</td>
              <td className="py-2 text-right font-mono">{pesos(pago)}</td>
            </tr>
          </tfoot>
        </table>
      </TablaDesplazable>
      {total > TOPE_EFECTIVO && (
        <p className="rounded-xl border border-warn-line bg-warn-bg px-3 py-2.5 text-[13px] text-warn-ink">
          El recorrido completo suma {pesos(total)}, más que el tope de {pesos(TOPE_EFECTIVO)} en efectivo: el
          recaudador debe consignar en la tienda-punto al pasar {pesos(ALERTA_EFECTIVO)} y antes de la visita de
          pedido.
        </p>
      )}
    </Tarjeta>
  );
}
