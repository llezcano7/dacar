// Utilidades compartidas del buscador (Hero y franja de Flota).

export const LUGARES = [
  "Aeropuerto BRC",
  "Centro de Bariloche",
  "San Martin de los Andes",
  "Calafate",
  "Usuhaia",
  "Otros destinos",
  
];

// 07:00, 07:30 ... 22:30
export const HORAS = Array.from({ length: 32 }, (_, i) => {
  const h = 7 + Math.floor(i / 2);
  return `${String(h).padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
});

// Fecha de hoy en formato yyyy-mm-dd, en hora local
export const hoy = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

// Suma n días a una fecha yyyy-mm-dd, en hora local (respeta fin de mes y de año)
export const sumarDias = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
};

export const dias = (n) => `${n} ${n === 1 ? "día" : "días"}`;

// Devuelve el mensaje de error, o "" si la búsqueda es válida.
// El mínimo se cuenta en períodos de 24 hs desde el retiro:
// retiro lunes 10:00 + 3 días => devolución desde el jueves 10:00
export const validarBusqueda = (f, minDias) => {
  const retiro = new Date(`${f.fechaRetiro}T${f.horaRetiro}`);
  const devolucion = new Date(`${f.fechaDevolucion}T${f.horaDevolucion}`);

  if (isNaN(retiro) || isNaN(devolucion)) {
    return "Completá las fechas de retiro y devolución.";
  }
  if (devolucion <= retiro) {
    return "La devolución tiene que ser posterior al retiro.";
  }
  const minimo = new Date(retiro);
  minimo.setDate(minimo.getDate() + minDias);
  if (devolucion < minimo) {
    return `El alquiler mínimo es de ${dias(minDias)} (${minDias * 24} hs).`;
  }
  return "";
};