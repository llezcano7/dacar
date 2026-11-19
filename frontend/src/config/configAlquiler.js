// Configuración del negocio.
//
// HOY es un objeto fijo. Cuando exista el back, esta MISMA forma se pide a un
// endpoint (una configuración por empresa) y el resto del código no cambia:
//
//    const config = await fetch("/api/config-alquiler").then((r) => r.json());
//
// Convenciones:
//  - Fechas "yyyy-mm-dd" y horas "HH:mm", siempre en hora local del negocio (zonaHoraria).
//  - Una franja { desde, hasta } incluye ambos extremos y no cruza la medianoche.
//    Para atender 24 hs: { desde: "00:00", hasta: "23:30" }.
//  - Un día con [] está cerrado.
//  - Los lugares no se borran: se marcan activo: false. Las reservas viejas
//    los referencian por id y no tienen que romperse.
//  - El nombre del lugar es lo que ve el cliente en los selectores (LUGARES en
//    busqueda.js sale de acá) y lo que viaja en la URL y en el mensaje de WhatsApp.
//  - adicionalId (opcional): id de un adicional de config/adicionales.js que se
//    cobra cada vez que el lugar es de retiro o de devolución.

const semana = (franjas) => ({
   lun: franjas,
   mar: franjas,
   mie: franjas,
   jue: franjas,
   vie: franjas,
   sab: franjas,
   dom: franjas,
});

const horarioComercial = semana([{ desde: "09:00", hasta: "18:00" }]);

const lugar = (id, nombre, adicionalId = null) => ({
   id,
   nombre,
   activo: true,
   permiteRetiro: true,
   permiteDevolucion: true,
   adicionalId,
   horarios: { retiro: horarioComercial, devolucion: horarioComercial },
});

export const configPorDefecto = {
   zonaHoraria: "America/Argentina/Buenos_Aires",
   minDiasAlquiler: 3,
   intervaloMinutos: 30,
   lugares: [
      lugar("brc", "Aeropuerto BRC"),
      lugar("centro", "Centro de Bariloche"),
      lugar("sma", "San Martin de los Andes", "dropoff-sma"),
      lugar("calafate", "Calafate", "dropoff-calafate"),
      lugar("ushuaia", "Ushuaia", "dropoff-ushuaia"),
      lugar("otros", "Otros destinos", "dropoff-otros"),
   ],
};