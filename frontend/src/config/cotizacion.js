import { REGLAS_HORAS }  from "../config/tarifas";
import { calcularAdicionales, etiquetaRenglon } from "./calculoAdicionales";

const dias = (n) => `${n} ${n === 1 ? "día" : "días"}`;

// "$12.500"
const precio = (n) => `$${n.toLocaleString("es-AR")}`;

// "mié 21 oct · 10:00"
const formatoFecha = (fecha, hora) => {
  const d = new Date(`${fecha}T${hora}`);
  const dia = d
    .toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })
    .replace(/[.,]/g, "");
  return `${dia} · ${hora}`;
};

// Recibe { lugarRetiro, fechaRetiro, horaRetiro, lugarDevolucion, fechaDevolucion, horaDevolucion }
// Devuelve null si faltan datos o no son válidos.
export const armarBusqueda = (b) => {
  if (!b.fechaRetiro || !b.fechaDevolucion) return null;

  const horaRetiro = b.horaRetiro || "10:00";
  const horaDevolucion = b.horaDevolucion || "10:00";
  const retiro = new Date(`${b.fechaRetiro}T${horaRetiro}`);
  const devolucion = new Date(`${b.fechaDevolucion}T${horaDevolucion}`);
  if (isNaN(retiro) || isNaN(devolucion) || devolucion <= retiro) return null;

  const HORA = 3600000;
  const ms = devolucion - retiro;
  let diasCompletos = Math.floor(ms / (24 * HORA));
  const resto = ms - diasCompletos * 24 * HORA;
  let horasExtra = 0;
  if (resto > REGLAS_HORAS.toleranciaMin * 60000) {
    if (resto > REGLAS_HORAS.maxHorasExtra * HORA) diasCompletos += 1;
    else horasExtra = Math.ceil(resto / HORA);
  }

  // Opcionales elegidos: llegan en la URL como "silla-bebe,cadenas"
  const seleccionados = String(b.adicionales || "").split(",").filter(Boolean);

  return {
    seleccionados,
    lugarRetiro: b.lugarRetiro,
    lugarDevolucion: b.lugarDevolucion || b.lugarRetiro,
    fechaRetiro: b.fechaRetiro,
    fechaDevolucion: b.fechaDevolucion,
    horaRetiro,
    horaDevolucion,
    retiro: formatoFecha(b.fechaRetiro, horaRetiro),
    devolucion: formatoFecha(b.fechaDevolucion, horaDevolucion),
    dias: diasCompletos,
    horasExtra,
  };
};

export const calcularTotal = (finalPorDia, b) =>
  Math.round(finalPorDia * b.dias + (finalPorDia / 24) * (b.horasExtra ?? 0));

// Tarifa + adicionales automáticos + opcionales elegidos.
// opciones: { categoria: "medianos" } = categoría del auto (para precios por categoría).
// Los opcionales elegidos salen de b.seleccionados; se pueden forzar con opciones.seleccionados.
// Devuelve { tarifa, renglones, adicionales, total }.
export const calcularTotalConAdicionales = (finalPorDia, b, opciones = {}) => {
  const tarifa = calcularTotal(finalPorDia, b);
  const { renglones, total: adicionales } = calcularAdicionales(b, {
    ...opciones,
    tarifaBase: tarifa,
  });
  return { tarifa, renglones, adicionales, total: tarifa + adicionales };
};

const duracion = (b) =>
  b.horasExtra > 0 ? `${dias(b.dias)} y ${b.horasExtra} hs` : dias(b.dias);

// detalle (opcional): resultado de calcularTotalConAdicionales.
export const mensajeWhatsapp = (auto, b, accion = "contratar", detalle = null) => {
  const base = `Hola! Quiero ${accion} el ${auto.modelo} (o similar).`;
  if (!b) return base;
  const reserva = `${base} Retiro: ${b.lugarRetiro}, ${b.retiro}. Devolución: ${b.lugarDevolucion}, ${b.devolucion} por (${duracion(b)}).`;
  if (!detalle || detalle.renglones.length === 0) return reserva;

  const lista = detalle.renglones
    .map((r) => `${etiquetaRenglon(r)} ${precio(r.monto)}`)
    .join(", ");
  return `${reserva} Adicionales: ${lista}. Total estimado: ${precio(detalle.total)}.`;
};