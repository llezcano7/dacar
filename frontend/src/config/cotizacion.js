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

  return {
    lugarRetiro: b.lugarRetiro,
    lugarDevolucion: b.lugarDevolucion || b.lugarRetiro,
    retiro: formatoFecha(b.fechaRetiro, horaRetiro),
    devolucion: formatoFecha(b.fechaDevolucion, horaDevolucion),
    dias: Math.ceil((devolucion - retiro) / 86400000),
  };
};

export const mensajeWhatsapp = (auto, b, accion = "cotizar") => {
  const base = `Hola! Quiero ${accion} el ${auto.modelo} (o similar).`;
  if (!b) return base;
  return `${base} Retiro: ${b.lugarRetiro}, ${b.retiro}. Devolución: ${b.lugarDevolucion}, ${b.devolucion} (${dias(b.dias)}).`;
};