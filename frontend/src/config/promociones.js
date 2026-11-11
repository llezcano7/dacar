import { hoyISO } from "../config/tarifas";

// desde / hasta inclusive; null = sin límite.
// aplica: { cats: [...], autos: [...] }. Si se omite, aplica a toda la flota.
export const promociones = [
  { id: "pago-anticipado", nombre: "Pago anticipado", descuento: 20, desde: null, hasta: null },
  // Ejemplo con fechas y categoría:
  // { id: "black-friday", nombre: "Black Friday", descuento: 30, desde: "2026-11-24", hasta: "2026-11-30", aplica: { cats: ["medianos"] } },
];

const estaVigente = (p, f) => (!p.desde || p.desde <= f) && (!p.hasta || f <= p.hasta);
const aplicaA = (p, auto) =>
  !p.aplica || p.aplica.cats?.includes(auto.cat) || p.aplica.autos?.includes(auto.id);

// La mejor promo vigente para ese auto y fecha, o null
export const getPromocion = (auto, fecha) => {
  const f = fecha || hoyISO();
  return promociones
    .filter((p) => estaVigente(p, f) && aplicaA(p, auto))
    .reduce((mejor, p) => (p.descuento > (mejor?.descuento ?? 0) ? p : mejor), null);
};