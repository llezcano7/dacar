import SeccionAnimada from "../components/seccionanimada";
import Card from "../components/card";
import { waLink } from "../config/contacto.js";
import { mensajeWhatsapp, calcularTotal } from "../config/cotizacion.js";
import { flota, IVA, calcularPrecio } from "../config/cars";
import { getPrecioDia } from "../config/tarifas.js";
import { getPromocion } from "../config/promociones.js";
import "./cargallery.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);



// Arma la lista de características a partir de los datos del auto
const caracteristicas = (car) => [
  { icon: "⚙️", label: `Caja ${car.transmision.toLowerCase()}` },
  { icon: "👥", label: `${car.pasajeros} pasajeros` },
  { icon: "🧳", label: `${car.valijas} valijas` },
  ...(car.extras ?? CARACTERISTICAS_COMUNES),
];

// Desde dónde entra cada card (izquierda, centro, derecha)
const DESDE_X = [-50, 0, 50];

const Icon = ({ children }) => (
  <svg
    width="18"
    height="18"
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

// cars es opcional: más adelante se puede pasar desde una API o dashboard
export default function CarGallery({ cars = flota, busqueda = null }) {
  return (
    <div className=" car-gallery-section container block-start">
      <SeccionAnimada
        id="flota"
        sobretitulo="Nuestra flota"
        titulo="Elegí el auto"
        destacado="ideal para tu viaje"
        subtitulo="Precio por día, con descuento por pago anticipado."
      >
        <section className="car-gallery-grid">
          {cars.map((car, i) => {
            const fecha = busqueda?.fechaRetiro;
            const precioDia = getPrecioDia(car, fecha);
            const promo = getPromocion(car, fecha);
            const descuento = promo?.descuento ?? 0;
            const calculo = calcularPrecio(precioDia ?? 0, descuento);
            const total = busqueda ? calcularTotal(calculo.final, busqueda) : null;

            return (
              <Card
                key={car.id}
                delay={(i % 3) * 120}
                fromX={DESDE_X[i % 3]}
                claseEnvoltura="car-gallery-item"
                className="car-card"
              >
                <div className="car-card-image">
                  <span className="car-card-category uppercase">{car.etiqueta}</span>
                  {descuento > 0 && <span className="car-card-badge">{descuento}% OFF</span>}
                  <img src={car.foto} alt={car.modelo} loading="lazy" />
                </div>

                <div className="car-card-body">
                  <h3 className="car-card-name">{car.modelo}</h3>

                  <ul className="car-card-specs">
                    <li className="car-card-spec">
                      <Icon>
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </Icon>
                      <span>{car.pasajeros}</span>
                    </li>
                    <li className="car-card-spec">
                      <Icon>
                        <rect x="6" y="7" width="12" height="14" rx="2" />
                        <path d="M9 7V5a3 3 0 016 0v2M10 12v5M14 12v5" />
                      </Icon>
                      <span>{car.valijas}</span>
                    </li>
                    <li className="car-card-spec">
                      <Icon>
                        <circle cx="7" cy="4" r="1.5" />
                        <circle cx="17" cy="4" r="1.5" />
                        <circle cx="7" cy="20" r="1.5" />
                        <circle cx="17" cy="20" r="1.5" />
                        <path d="M7 5.5v13M17 5.5v13M7 12h10" />
                      </Icon>
                      <span>{car.transmision}</span>
                    </li>
                    <li className="car-card-spec">
                      <Icon>
                        <path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5M9 4l3 2 3-2M9 20l3-2 3 2" />
                      </Icon>
                      <span>A/C</span>
                    </li>
                  </ul>

                  <div className="car-card-breakdown">
                    {descuento > 0 ? (
                      <>
                        <div className="car-card-line">
                          <span>Precio por día</span>
                          <span className="car-card-line-old">{formatPrice(precioDia)}</span>
                        </div>
                        <div className="car-card-line car-card-line-discount">
                          <span>Pago anticipado {promo.nombre} (-{descuento}%)</span>
                          <span>{formatPrice(calculo.conDescuento)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="car-card-line">
                        <span>Precio por día</span>
                        <span>{formatPrice(calculo.conDescuento)}</span>
                      </div>
                    )}
                    <div className="car-card-line">
                      <span>IVA ({IVA}%)</span>
                      <span>{formatPrice(calculo.iva)}</span>
                    </div>
                    <div className="car-card-line car-card-line-final">
                      <span>Final por día</span>
                      <strong>{formatPrice(calculo.final)}</strong>
                    </div>
                  </div>

                  {total != null && (
                    <div className="car-card-trip">
                      <span>Total {busqueda.dias} días{busqueda.horasExtra > 0 && ` + ${busqueda.horasExtra} hs`} · IVA incl.</span>                      <strong>{formatPrice(total)}</strong>
                    </div>
                  )}
                  <a
                    href={waLink(mensajeWhatsapp(car, busqueda, "reservar"))}
                    className="car-card-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Reservar ahora
                    <svg
                      className="car-card-btn-arrow"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </Card>
            );
          })}
        </section>
      </SeccionAnimada>
    </div>
  );
}