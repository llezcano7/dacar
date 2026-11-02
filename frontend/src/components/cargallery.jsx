import SeccionAnimada from "../components/seccionanimada";
import Card from "../components/card";
import {
  flota,
  DESCUENTO_PAGO_ANTICIPADO,
  CARACTERISTICAS_COMUNES,
} from "../config/cars";
import "./cargallery.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const applyDiscount = (price, percent) =>
  Math.round(price * (1 - percent / 100));

// Arma la lista de características a partir de los datos del auto
const caracteristicas = (car) => [
  { icon: "⚙️", label: `Caja ${car.transmision.toLowerCase()}` },
  { icon: "👥", label: `${car.pasajeros} pasajeros` },
  { icon: "🧳", label: `${car.valijas} valijas` },
  ...(car.extras ?? CARACTERISTICAS_COMUNES),
];

// Desde dónde entra cada card (izquierda, centro, derecha)
const DESDE_X = [-50, 0, 50];

// cars es opcional: más adelante se puede pasar desde una API o dashboard
export default function CarGallery({ onReserve, cars = flota }) {
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
            const precio = Number(car.precioDia);
            const descuento = car.descuento ?? DESCUENTO_PAGO_ANTICIPADO;

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
                  {descuento > 0 && (
                    <span className="car-card-badge">{descuento}% OFF</span>
                  )}
                  <img src={car.foto} alt={car.modelo} loading="lazy" />
                </div>

                <div className="car-card-body">
                  <h3 className="car-card-name">{car.modelo}</h3>

                  <p className="car-card-price">
                    {formatPrice(precio)} <small>/ día</small>
                  </p>

                  {descuento > 0 && (
                    <p className="car-card-discount">
                      Pagando por adelantado:{" "}
                      <strong>
                        {formatPrice(applyDiscount(precio, descuento))} / día
                      </strong>
                    </p>
                  )}

                  <ul className="car-card-features">
                    {caracteristicas(car).map((f) => (
                      <li key={f.label}>
                        <span aria-hidden="true">{f.icon}</span>
                        {f.label}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="car-card-btn"
                    onClick={() => (onReserve ? onReserve(car) : null)}
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
                  </button>
                </div>
              </Card>
            );
          })}
        </section>
      </SeccionAnimada>
    </div>
  );
}