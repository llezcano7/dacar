import { adicionales as catalogoPorDefecto } from "../config/adicionales";
import { configPorDefecto } from "../config/configalquiler";

// Lógica de adicionales. Son funciones puras (sin React ni estado), así que el día
// que haya validación en el back se pueden portar tal cual: solo dependen de datos.

const CLAVES_DIA = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];

const claveDia = (fecha) => CLAVES_DIA[new Date(`${fecha}T00:00`).getDay()];

// El form guarda el nombre del lugar (LUGARES); aceptamos también el id.
const buscarLugar = (config, valor) => {
  const lugar = config.lugares.find((l) => l.id === valor || l.nombre === valor);
  if (!lugar && valor) {
    console.warn(`[adicionales] Lugar desconocido: "${valor}". Tiene que coincidir con el id o el nombre de configalquiler.js`);
  }
  return lugar;
};

// ¿La hora cae fuera de las franjas del lugar ese día?
// evento: "retiro" | "devolucion". Un día sin franjas (cerrado) cuenta como fuera de horario.
// Las franjas incluyen ambos extremos ("18:00" está dentro, "18:30" no); "HH:mm" se compara como texto.
export const fueraDeHorario = (lugar, evento, fecha, hora) => {
  if (!lugar || !fecha || !hora) return false;
  const franjas = lugar.horarios?.[evento]?.[claveDia(fecha)] ?? [];
  return !franjas.some(({ desde, hasta }) => hora >= desde && hora <= hasta);
};

// valor puede ser un número (igual para todos) o un objeto por categoría:
//   { economicos: 100, medianos: 120, grandes: 200, default: 150 }
// "default" es opcional y se usa si la categoría no está en el objeto.
const valorPara = (adicional, categoria) => {
  const { valor } = adicional;
  if (valor === null || typeof valor !== "object") return valor;
  const porCategoria = valor[categoria] ?? valor.default;
  if (porCategoria === undefined) {
    console.warn(`[adicionales] "${adicional.id}" no tiene valor para la categoría "${categoria}"`);
    return 0;
  }
  return porCategoria;
};

// Monto de un adicional según su modo de cobro.
// tarifaBase: tarifa del alquiler (días + horas extra), sin adicionales.
// categoria: categoría del auto (solo importa si el valor es por categoría).
export const calcularMonto = (adicional, { dias, tarifaBase, categoria }) => {
  const valor = valorPara(adicional, categoria);
  switch (adicional.cobro) {
    case "por-dia":
      return Math.round(valor * dias);
    case "por-periodo":
      return Math.round(valor);
    case "porcentaje":
      return Math.round((tarifaBase * valor) / 100);
    default:
      return 0;
  }
};

// Texto del precio de un adicional para la sección de Adicionales (sin depender de un auto):
//   "$ 5.000 por día" · "Desde $ 8.000 por día" · "$ 12.000 por todo el alquiler"
//   "$ 3.000 por entrega o devolución" · "10 % del alquiler"
// Si el valor es por categoría y difiere, muestra "Desde" el menor. Devuelve null si todavía
// no tiene precio cargado (valor 0), para no mostrar "$ 0".
const formatoMonto = (n) => `$ ${n.toLocaleString("es-AR")}`;

export const textoPrecio = (adicional) => {
  const { valor, cobro, tipo } = adicional;
  const valores = valor !== null && typeof valor === "object" ? Object.values(valor) : [valor];
  const positivos = valores.filter((v) => v > 0);
  if (positivos.length === 0) return null;

  const minimo = Math.min(...positivos);
  const desde = new Set(valores).size > 1 ? "Desde " : "";

  if (cobro === "porcentaje") return `${desde}${minimo} % del alquiler`;
  const sufijo =
    cobro === "por-dia"
      ? " por día"
      : tipo === "automatico"
        ? " por entrega o devolución"
        : " por todo el alquiler";
  return `${desde}${formatoMonto(minimo)}${sufijo}`;
};

// Un renglón es una línea del desglose: { id, titulo, evento, monto }.
// evento es "retiro" | "devolucion" en los automáticos, y null en los opcionales.
// eventos: en qué tramos aplica ("retiro" y/o "devolucion"). Si el adicional define
// tituloPorEvento, el renglón usa el título de ese tramo ("ambos" si aplica en los dos).
const armarRenglon = (adicional, evento, contexto, eventos = []) => {
  const clave = eventos.length > 1 ? "ambos" : eventos[0];
  const tituloPropio = adicional.tituloPorEvento?.[clave];
  return {
    id: adicional.id,
    titulo: tituloPropio ?? adicional.titulo,
    evento,
    etiquetaCompleta: Boolean(tituloPropio), // el título ya dice el tramo: no agregar "(retiro)"
    monto: calcularMonto(adicional, contexto),
  };
};

// Texto de un renglón: "Drop-off San Martín de los Andes (devolución)" / "Silla para bebé"
export const etiquetaRenglon = (r) => {
  if (!r.evento || r.etiquetaCompleta) return r.titulo;
  return `${r.titulo} (${r.evento === "retiro" ? "retiro" : "devolución"})`;
};

// Qué adicionales automáticos corresponden a la reserva, sin montos.
// Retiro y devolución se evalúan por separado, así que cada uno puede sumar los suyos.
// motivo: "lugar" (el lugar tiene adicionalId) o "horario" (fuera del horario comercial).
const detectarAutomaticos = (b, config, catalogo) => {
  if (!b) return [];

  const eventos = [
    { evento: "retiro", lugar: buscarLugar(config, b.lugarRetiro), fecha: b.fechaRetiro, hora: b.horaRetiro },
    { evento: "devolucion", lugar: buscarLugar(config, b.lugarDevolucion), fecha: b.fechaDevolucion, hora: b.horaDevolucion },
  ];

  const porEvento = eventos.flatMap((e) =>
    [
      e.lugar?.adicionalId && { id: e.lugar.adicionalId, motivo: "lugar" },
      fueraDeHorario(e.lugar, e.evento, e.fecha, e.hora) && { id: "fuera-de-horario", motivo: "horario" },
    ]
      .filter(Boolean)
      .map(({ id, motivo }) => {
        const adicional = catalogo.find((a) => a.id === id && a.tipo === "automatico");
        return adicional && { adicional, evento: e.evento, motivo, lugar: e.lugar };
      })
      .filter(Boolean)
  );

  // Cada resultado trae "eventos" (en cuáles aplica). Por defecto un adicional se cobra una
  // vez por evento. Si tiene porEvento: false se cobra una sola vez por reserva, aunque
  // aplique en el retiro y en la devolución; en ese caso evento queda en null.
  const unicos = new Map();
  return porEvento.reduce((lista, item) => {
    if (item.adicional.porEvento !== false) {
      lista.push({ ...item, eventos: [item.evento] });
      return lista;
    }
    const previo = unicos.get(item.adicional.id);
    if (previo) {
      previo.eventos.push(item.evento);
    } else {
      const nuevo = { ...item, evento: null, eventos: [item.evento] };
      unicos.set(item.adicional.id, nuevo);
      lista.push(nuevo);
    }
    return lista;
  }, []);
};

// Avisos para mostrar en los formularios, antes de ver precios:
// "Devolución en San Martín de los Andes: se suma «Drop-off San Martín de los Andes»."
export const avisosAdicionales = (
  datos,
  { config = configPorDefecto, catalogo = catalogoPorDefecto } = {}
) =>
  detectarAutomaticos(datos, config, catalogo).map(({ adicional, eventos, motivo, lugar }) => {
    const cuando =
      eventos.length > 1 ? "Retiro y devolución" : eventos[0] === "retiro" ? "Retiro" : "Devolución";
    const donde = motivo === "horario" ? "fuera del horario comercial" : `en ${lugar.nombre}`;
    const unaVez = eventos.length > 1 ? " (se cobra una sola vez)" : "";
    return `${cuando} ${donde}: se suma «${adicional.titulo}»${unaVez}.`;
  });

// Desglose completo: automáticos + opcionales elegidos.
// b: resultado de armarBusqueda (trae b.seleccionados, los ids de opcionales tildados).
// categoria: categoría del auto. tarifaBase: tarifa del alquiler sin adicionales.
export const calcularAdicionales = (
  b,
  {
    seleccionados = b?.seleccionados ?? [],
    categoria,
    tarifaBase = 0,
    config = configPorDefecto,
    catalogo = catalogoPorDefecto,
  } = {}
) => {
  const contexto = { dias: b?.dias ?? 0, tarifaBase, categoria };

  const automaticos = detectarAutomaticos(b, config, catalogo).map(({ adicional, evento, eventos }) =>
    armarRenglon(adicional, evento, contexto, eventos)
  );
  const opcionales = seleccionados
    .map((id) => catalogo.find((a) => a.id === id && a.tipo === "opcional"))
    .filter(Boolean)
    .map((a) => armarRenglon(a, null, contexto));

  const renglones = [...automaticos, ...opcionales];
  const total = renglones.reduce((suma, r) => suma + r.monto, 0);
  return { renglones, total };
};