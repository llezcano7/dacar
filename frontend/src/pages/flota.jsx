import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BuscadorFlota from "../components/buscador";
import SeccionAnimada from "../components/seccionanimada.jsx";
import { waLink } from "../config/contacto.js";
import { armarBusqueda, mensajeWhatsapp } from "../config/cotizacion.js";
import {
  flota as flotaPorDefecto,
  DESCUENTO_PAGO_ANTICIPADO,
  IVA,
  calcularPrecio,
} from "../config/cars.js";
import "./flota.css";

const Icon = ({ children, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const formatoPrecio = (n) =>
  n == null ? "[$ / día]" : `$\u00A0${n.toLocaleString("es-AR")}`;

// autos: lista de la flota. Hoy viene de config/cars.js; luego, del back.
// minDias: mínimo de días de alquiler (más adelante viene del back, igual que en Hero)
export default function Flota({ autos = flotaPorDefecto, minDias = 3 }) {
  const [cat, setCat] = useState("todos");
  const [params, setParams] = useSearchParams();
  const busqueda = armarBusqueda(Object.fromEntries(params));

  const visibles = autos.filter((a) => cat === "todos" || a.cat === cat);

  return (
    <div className="flota" id="flota">
      <BuscadorFlota
        busqueda={busqueda}
        valores={Object.fromEntries(params)}
        minDias={minDias}
        onActualizar={(nuevos) => setParams(new URLSearchParams(nuevos))}
      />
      <div className="fleet-header block-start">
        <SeccionAnimada
          sobretitulo="Flota"
          titulo="Nuestros"
          destacado="autos"
          subtitulo={`Mostrando ${visibles.length} ${visibles.length === 1 ? "auto" : "autos"}`}
        >
        </SeccionAnimada>
      </div>
      <section className="flota-wrapper container">
        <div className="flota-grilla">
          {visibles.map((a) => {
            const descuento = a.descuento ?? DESCUENTO_PAGO_ANTICIPADO;
            const hayDescuento = descuento > 0 && a.precioDia != null;
            const precio =
              a.precioDia != null
                ? calcularPrecio(a.precioDia, hayDescuento ? descuento : 0)
                : null;
            // El total usa el precio final por día (con descuento e IVA)
            const total =
              busqueda && precio ? precio.final * busqueda.dias : null;

            return (
              <article key={a.id} className="flota-card">
                <div className="flota-img">
                  <span className="flota-pill">{a.etiqueta}</span>
                  {hayDescuento && <span className="flota-badge">{descuento}% OFF</span>}
                  {a.foto && <img src={a.foto} alt={`${a.modelo} o similar`} loading="lazy" />}
                </div>

                <div className="flota-info">
                  <div className="flota-title">
                    <h3>{a.modelo}</h3>
                    <span>o similar</span>
                  </div>

                  <ul className="flota-specs">
                    <li className="flota-spec">
                      <Icon size={18}>
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </Icon>
                      <span>{a.pasajeros}</span>
                    </li>
                    <li className="flota-spec">
                      <Icon size={18}>
                        <rect x="6" y="7" width="12" height="14" rx="2" />
                        <path d="M9 7V5a3 3 0 016 0v2M10 12v5M14 12v5" />
                      </Icon>
                      <span>{a.valijas}</span>
                    </li>
                    <li className="flota-spec">
                      <Icon size={18}>
                        <circle cx="7" cy="4" r="1.5" />
                        <circle cx="17" cy="4" r="1.5" />
                        <circle cx="7" cy="20" r="1.5" />
                        <circle cx="17" cy="20" r="1.5" />
                        <path d="M7 5.5v13M17 5.5v13M7 12h10" />
                      </Icon>
                      <span>{a.transmision}</span>
                    </li>
                    <li className="flota-spec">
                      <Icon size={18}>
                        <path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5M9 4l3 2 3-2M9 20l3-2 3 2" />
                      </Icon>
                      <span>A/C</span>
                    </li>
                  </ul>

                  {precio && (
                    <div className="flota-breakdown">
                      {hayDescuento ? (
                        <>
                          <div className="flota-line">
                            <span>Precio por día</span>
                            <span className="flota-line-old">{formatoPrecio(a.precioDia)}</span>
                          </div>
                          <div className="flota-line flota-line-discount">
                            <span>Pago anticipado (-{descuento}%)</span>
                            <span>{formatoPrecio(precio.conDescuento)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flota-line">
                          <span>Precio por día</span>
                          <span>{formatoPrecio(precio.conDescuento)}</span>
                        </div>
                      )}
                      <div className="flota-line">
                        <span>IVA ({IVA}%)</span>
                        <span>{formatoPrecio(precio.iva)}</span>
                      </div>
                      <div className="flota-line flota-line-final">
                        <span>Final por día</span>
                        <strong>{formatoPrecio(precio.final)}</strong>
                      </div>
                    </div>
                  )}
                  {total != null && (
                    <div className="flota-trip">
                      <span>Total {busqueda.dias} días · IVA incl.</span>
                      <strong>{formatoPrecio(total)}</strong>
                    </div>
                  )}
                  <a
                    href={waLink(mensajeWhatsapp(a, busqueda))}
                    className="flota-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={22}>
                      <path d="M4 5h16v11H9l-5 4V5z" />
                    </Icon>
                    Contratar por WhatsApp
                    <Icon size={20}>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </Icon>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flota-wrap">
          <div className="flota-cta">
            <div>
              <div className="flota-cta-titulo">¿No sabés cuál elegir?</div>
              <p>
                Contanos cuántos son, cuántos días, por dónde van a viajar y te
                recomendamos el auto ideal.
              </p>
            </div>
            <a
              href={waLink("Hola! Quiero que me ayuden a elegir un auto.")}
              className="flota-btn flota-btn-cta"
              target="_blank"
              rel="noreferrer"
            >
              <Icon size={22}>
                <path d="M4 5h16v11H9l-5 4V5z" />
              </Icon>
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}