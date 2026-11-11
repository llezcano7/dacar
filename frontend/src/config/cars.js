// Flota de Da'car. Hoy vive acá; más adelante puede venir del back (dashboard)
// sin tocar los componentes. Las fotos van en /public/cars/

// forma: "eco" | "medianos" | "4x4" (define la silueta si no hay foto)
export const categorias = [
   { id: "todos", nombre: "Todos" },
   { id: "economicos", nombre: "Económicos" },
   { id: "medianos", nombre: "Medianos" },
   { id: "4x4", nombre: "Camionetas 4x4" },
];

// IVA que se suma al alquiler (%)
export const IVA = 21;

// Un solo lugar para el cálculo, así Flota y CarGallery nunca difieren
export const calcularPrecio = (precio, descuento = 0) => {
  const conDescuento = Math.round(precio * (1 - descuento / 100));
  const iva = Math.round(conDescuento * (IVA / 100));
  return { conDescuento, iva, final: conDescuento + iva };
};

// Características que comparten todos los autos (un auto puede pisarlas con "extras")
export const CARACTERISTICAS_COMUNES = [
   { icon: "❄️", label: "Aire acondicionado" },
   { icon: "🛞", label: "Dirección hidráulica" },
   { icon: "⛽", label: "Nafta" },
];

export const flota = [
   { id: "sandero", cat: "economicos", forma: "eco",      etiqueta: "Económicos",     modelo: "Renault Sandero", pasajeros: 5, valijas: 2, transmision: "Manual", precioDia: 77350,  foto: "/cars/Sandero.webp" },
   { id: "cronos",  cat: "medianos",   forma: "medianos", etiqueta: "Medianos",       modelo: "Fiat Cronos",     pasajeros: 5, valijas: 3, transmision: "Manual", precioDia: 90350,  foto: "/cars/Cronos.webp" },
   { id: "logan",   cat: "medianos",   forma: "medianos", etiqueta: "Medianos",       modelo: "Renault Logan",   pasajeros: 5, valijas: 3, transmision: "Manual", precioDia: 90350,  foto: "/cars/Logan.webp" },
   { id: "duster",  cat: "4x4",        forma: "4x4",      etiqueta: "Camioneta 4x4",  modelo: "Renault Duster",  pasajeros: 5, valijas: 3, transmision: "Manual", precioDia: 130000, foto: "/cars/Duster.webp" },
];