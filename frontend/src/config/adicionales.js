// Servicios adicionales que se pueden sumar a la reserva.
// Hoy vive acá; más adelante puede venir del back (dashboard) sin tocar el componente.
//
// Campos:
//  - icono: nombre de un ícono definido en Adicionales.jsx
//    "pin" | "clock" | "baby" | "snow" | "shield" | "driver" | "custom"
//  - tipo:
//      "opcional"   → lo elige el cliente
//      "automatico" → lo agrega el sistema según la reserva (ver utils/calculoAdicionales.js)
//  - porEvento (solo automáticos, opcional): por defecto un automático se cobra una vez por
//    cada retiro/devolución en que aplica. Con porEvento: false se cobra una sola vez por reserva.
//  - tituloPorEvento (opcional): título propio del renglón según el tramo en que aplica
//    ({ retiro, devolucion, ambos }). Si falta, se usa "titulo".
//  - cobro y valor: cómo se calcula el monto y el número que usa ese modo
//      "por-dia"     → valor × días de alquiler          (valor en $)
//      "por-periodo" → valor fijo por todo el alquiler   (valor en $)
//      "porcentaje"  → valor % de la tarifa del alquiler (valor en %, ej. 10)
//    Los automáticos generan un renglón cada vez que se aplican (retiro y/o devolución);
//    con "por-periodo" cada renglón es un monto fijo.
//    valor puede ser un número (igual para todos los autos) o un objeto por categoría,
//    con las claves iguales al campo "cat" de config/cars.js:
//      valor: { economicos: 100, medianos: 120, grandes: 200 }
//    Los montos incluyen IVA, igual que el total que ve el cliente.
//
// valor: 0 hasta que se definan los precios.
export const adicionales = [
  {
    id: "dropoff-sma",
    icono: "pin",
    titulo: "Drop-off San Martín de los Andes",
    descripcion:
      "Retirá el auto en Bariloche y devolvelo en San Martín de los Andes (o al revés), sin volver sobre tus pasos.",
    etiqueta: "Solo ida",
    tipo: "automatico",
    cobro: "por-periodo",
    valor: 280000,
  },
  // Drop-off a destinos lejanos. Son automáticos (los dispara el lugar elegido) y cada
  // uno tiene su propio precio. visible: false los oculta en la sección de Adicionales.jsx.
  {
    id: "dropoff-calafate",
    icono: "pin",
    titulo: "Drop-off Calafate",
    descripcion: "Entrega o devolución del auto en Calafate.",
    etiqueta: "Solo ida",
    tipo: "automatico",
    cobro: "por-periodo",
    valor: 1900000,
    visible: true,
  },
  {
    id: "dropoff-ushuaia",
    icono: "pin",
    titulo: "Drop-off Ushuaia",
    descripcion: "Entrega o devolución del auto en Ushuaia.",
    etiqueta: "Solo ida",
    tipo: "automatico",
    cobro: "por-periodo",
    valor: 2300000,
    visible: true,
  },
  {
    id: "dropoff-otros",
    icono: "pin",
    titulo: "A coordinar",
    descripcion: "Entrega o devolución del auto en otros destinos.",
    etiqueta: "Solo ida",
    tipo: "automatico",
    cobro: "por-periodo",
    valor: 0,
    visible: false,
  },
  {
    id: "fuera-de-horario",
    icono: "clock",
    titulo: "Entregas y devoluciones fuera de horario",
    descripcion:
      "¿Tu vuelo llega tarde o salís temprano? Coordinamos la entrega o devolución fuera de nuestro horario comercial.",
    etiqueta: "A coordinar",
    tipo: "automatico",
    porEvento: false, // se cobra una sola vez por reserva, aunque retiro y devolución estén fuera de horario
    tituloPorEvento: {
      retiro: "Retiro fuera de horario",
      devolucion: "Devolución fuera de horario",
      ambos: "Retiro y devolución fuera de horario",
    },
    cobro: "por-periodo",
    valor: 60000,
  },
  {
    id: "silla-bebe",
    icono: "baby",
    titulo: "Silla para bebé",
    descripcion:
      "Sillas homologadas, limpias y listas para instalar. Viajá con los más chicos con total tranquilidad.",
    etiqueta: "Seguridad",
    tipo: "opcional",
    cobro: "por-dia",
    max: 2,
    valor: 5000,
  },
  {
    id: "cadenas",
    icono: "snow",
    titulo: "Cadenas para la nieve",
    descripcion:
      "Imprescindibles para la temporada de invierno en la cordillera. Te las dejamos con el auto.",
    etiqueta: "Invierno",
    tipo: "opcional",
    cobro: "por-periodo",
    visible: false,
    valor: 0,
  },
  {
    id: "seguro",
    icono: "shield",
    titulo: "Seguro opcional",
    descripcion:
      "Sumá una cobertura extra para reducir tu responsabilidad ante imprevistos y manejar sin preocupaciones.",
    etiqueta: "Seguro",
    tipo: "opcional",
    cobro: "por-periodo",
    valor: { economicos: 120000, medianos: 150000, grandes: 300000 },
  },
  {
    id: "conductor",
    icono: "driver",
    titulo: "Conductor adicional",
    descripcion:
      "Sumá un conductor para disfrutar de tu paseo con mayor libertad .",
    etiqueta: "Conductor",
    tipo: "opcional",
    cobro: "por-periodo",
    max: 3,
    valor: 15000,
  },
  {
    id: "chile",
    icono: "custom",
    titulo: "Permiso de cruce a Chile",
    descripcion:
      "Solicitá tu permiso de cruce a Chile al momento de la reserva y disfrutá de los paisajes trasandinos.",
    etiqueta: "Chile",
    tipo: "opcional",
    cobro: "por-periodo",
    valor: 100000,
  },
];