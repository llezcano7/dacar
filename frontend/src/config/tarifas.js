// Tarifarios por categoría. Cada período rige desde "desde" (inclusive)
// hasta que empieza el siguiente. Mantener ordenados. Fechas "AAAA-MM-DD".
export const tarifas = {
  economicos: [
    { desde: "2000-01-01", precioDia: 77350 },
    { desde: "2026-12-10", precioDia: 98500 },
  ],
  medianos: [
    { desde: "2000-01-01", precioDia: 90350 },
    { desde: "2026-12-10", precioDia: 117500 },
  ],
  "4x4": [
    { desde: "2000-01-01", precioDia: 130000 },
    { desde: "2026-12-10", precioDia: 160000 },
  ],
};

export const REGLAS_HORAS = {
  toleranciaMin: 30, // hasta 30 min pasadas las 24 h no se cobra nada
  maxHorasExtra: 5,  // pasadas estas horas se cobra el día completo
};

export const hoyISO = () => new Date().toLocaleDateString("sv-SE");

// Precio por día para una fecha (por defecto, hoy). Un auto puede pisar
// el tarifario de su categoría con su propio "tarifas".
export const getPrecioDia = (auto, fecha) => {
  const periodos = auto.tarifas ?? tarifas[auto.cat];
  if (!periodos?.length) return null;
  const f = fecha || hoyISO();
  const vigente = [...periodos].reverse().find((p) => p.desde <= f);
  return (vigente ?? periodos[0]).precioDia;
};