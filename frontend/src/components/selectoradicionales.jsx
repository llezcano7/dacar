import { adicionales as catalogo } from "../config/adicionales.js";
import { textoPrecio, cambiarCantidad } from "../config/calculoAdicionales.js";
import "./selectoradicionales.css";

// Adicionales que el cliente puede elegir (los automáticos los agrega el sistema)
const opcionales = catalogo.filter((a) => a.tipo === "opcional" && a.visible !== false);

// Selector de adicionales opcionales. Lo usan el buscador del inicio y el de la flota.
// valor:    objeto id → cantidad, por ejemplo { "silla-bebe": 2, cadenas: 1 }
// onChange: recibe el objeto nuevo
// tema:     "claro" (fondos claros, el inicio) u "oscuro" (fondos oscuros, la flota)
export default function SelectorAdicionales({ valor = {}, onChange, tema = "claro" }) {
  const cambiar = (id, cantidad) => onChange(cambiarCantidad(valor, id, cantidad));

  return (
    <div className={`sel-adicionales sel-adicionales-${tema === "oscuro" ? "oscuro" : "claro"}`}>
      {opcionales.map((a) => {
        const cantidad = valor[a.id] ?? 0;
        const activo = cantidad > 0;
        const precio = textoPrecio(a);

        return (
          <div
            key={a.id}
            className={`sel-adicionales-item ${activo ? "sel-adicionales-item-activo" : ""}`}
          >
            <button
              type="button"
              className="sel-adicionales-chip"
              aria-pressed={activo}
              onClick={() => cambiar(a.id, activo ? 0 : 1)}
            >
              <span className="sel-adicionales-marca" aria-hidden="true">
                {activo ? "✓" : "+"}
              </span>
              <span className="sel-adicionales-texto">
                <span className="sel-adicionales-nombre">{a.titulo}</span>
                {precio && <small className="sel-adicionales-precio">{precio}</small>}
              </span>
            </button>

            {activo && (a.max ?? 1) > 1 && (
              <div
                className="sel-adicionales-cantidad"
                role="group"
                aria-label={`Cantidad de ${a.titulo}`}
              >
                <button
                  type="button"
                  className="sel-adicionales-paso"
                  aria-label="Quitar uno"
                  onClick={() => cambiar(a.id, cantidad - 1)}
                >
                  −
                </button>
                <span className="sel-adicionales-numero" aria-live="polite">
                  {cantidad}
                </span>
                <button
                  type="button"
                  className="sel-adicionales-paso"
                  aria-label="Agregar uno"
                  onClick={() => cambiar(a.id, cantidad + 1)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}