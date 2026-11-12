import { REGLAS_HORAS }  from "../config/tarifas";

const dias = (n) => `${n} ${n === 1 ? "día" : "días"}`;

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

  return {
    lugarRetiro: b.lugarRetiro,
    lugarDevolucion: b.lugarDevolucion || b.lugarRetiro,
    fechaRetiro: b.fechaRetiro,
    retiro: formatoFecha(b.fechaRetiro, horaRetiro),
    devolucion: formatoFecha(b.fechaDevolucion, horaDevolucion),
    dias: diasCompletos,
    horasExtra,
  };
};

export const calcularTotal = (finalPorDia, b) =>
  Math.round(finalPorDia * b.dias + (finalPorDia / 24) * (b.horasExtra ?? 0));

const duracion = (b) =>
  b.horasExtra > 0 ? `${dias(b.dias)} y ${b.horasExtra} hs` : dias(b.dias);

export const mensajeWhatsapp = (auto, b, accion = "contratar") => {
  const base = `Hola! Quiero ${accion} el ${auto.modelo} (o similar).`;
  if (!b) return base;
  return `${base} Retiro: ${b.lugarRetiro}, ${b.retiro}. Devolución: ${b.lugarDevolucion}, ${b.devolucion} por (${duracion(b)}).`;
};